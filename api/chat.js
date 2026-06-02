export default async function handler(req, res) {
    // Jalankan proteksi metode request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed.' });
    }

    const apiKey = process.env.HIDEPULSA_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Backend Configuration Error: API Key is missing in Vercel Env.' });
    }

    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid Input: Messages payload must be an array.' });
        }

        // 🌟 STERILISASI DATA: Bersihkan role "system" demi kepatuhan penuh proxy Claude
        let sanitizedMessages = [];
        let extractedSystemPrompt = "";

        messages.forEach(msg => {
            if (msg.role === 'system') {
                extractedSystemPrompt = msg.content;
            } else {
                sanitizedMessages.push({ role: msg.role, content: msg.content });
            }
        });

        // Gabungkan instruksi ke pesan user pertama jika ada
        if (extractedSystemPrompt && sanitizedMessages.length > 0 && sanitizedMessages[0].role === 'user') {
            sanitizedMessages[0].content = `[System Instruction: ${extractedSystemPrompt}]\n\n${sanitizedMessages[0].content}`;
        } else if (extractedSystemPrompt && sanitizedMessages.length === 0) {
            sanitizedMessages.push({ role: 'user', content: `Halo, jalankan instruksi ini: ${extractedSystemPrompt}` });
        }

        // Mengintip payload sebelum dikirim (Bisa kamu lihat di Vercel Logs)
        console.log("Payload yang dikirim ke HidePulsa:", JSON.stringify(sanitizedMessages));

        // 🌟 PENYEMPURNAAN HEADER: Meniru Request Browser asli agar tidak diblokir Nginx
        const apiResponse = await fetch('https://ai.hidepulsa.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                model: 'kr/claude-opus-4.7',
                messages: sanitizedMessages,
                temperature: 0.7
            })
        });

        // Ambil respon mentah dari server upstream
        const responseText = await apiResponse.text();

        if (!apiResponse.ok) {
            console.error("HidePulsa Error Response Teks:", responseText);
            return res.status(apiResponse.status).json({ 
                error: `Upstream error (${apiResponse.status}): ${responseText}` 
            });
        }

        // Jika sukses gilang gemilang, kirim datanya ke frontend Riksan AI
        const payloadData = JSON.parse(responseText);
        return res.status(200).json(payloadData);

    } catch (error) {
        console.error('Critical Proxy Execution Failure:', error);
        return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
}
