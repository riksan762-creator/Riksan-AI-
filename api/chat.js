export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed.' });
    }

    const apiKey = process.env.HIDEPULSA_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Backend Configuration Error: API Key missing.' });
    }

    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid Input.' });
        }

        // 🌟 PROSES KAMUFLASE: Bersihkan role "system" agar proxy HidePulsa tidak crash (502)
        let sanitizedMessages = [];
        let extractedSystemPrompt = "";

        messages.forEach(msg => {
            if (msg.role === 'system') {
                extractedSystemPrompt = msg.content; // Simpan teks instruksinya
            } else {
                sanitizedMessages.push({ role: msg.role, content: msg.content });
            }
        });

        // Jika ada instruksi sistem, suntikkan di atas pesan user pertama sebagai teks biasa
        if (extractedSystemPrompt && sanitizedMessages.length > 0 && sanitizedMessages[0].role === 'user') {
            sanitizedMessages[0].content = `[IMPORTANT INSTRUCTION: ${extractedSystemPrompt}]\n\n${sanitizedMessages[0].content}`;
        } else if (extractedSystemPrompt && sanitizedMessages.length === 0) {
            sanitizedMessages.push({ role: 'user', content: `Halo, aktifkan mode: ${extractedSystemPrompt}` });
        }

        // Tembak ke HidePulsa dengan struktur bersih (Hanya berisi User & Assistant)
        const apiResponse = await fetch('https://ai.hidepulsa.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'kr/claude-opus-4.7',
                messages: sanitizedMessages, // Gunakan yang sudah disterilkan
                temperature: 0.7
            })
        });

        if (!apiResponse.ok) {
            const errorRaw = await apiResponse.text();
            return res.status(apiResponse.status).json({ 
                error: `Upstream error: ${errorRaw}` 
            });
        }

        const payloadData = await apiResponse.json();
        return res.status(200).json(payloadData);

    } catch (error) {
        console.error('Critical Proxy Failure:', error);
        return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
}
