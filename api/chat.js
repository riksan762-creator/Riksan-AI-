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

        // Tembak ke HidePulsa menggunakan model Qwen Coder yang direkomendasikan aktif
        const apiResponse = await fetch('https://ai.hidepulsa.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'kr/qwen3-coder-next', // 🌟 MODEL DIGANTI KE QWEN CODER YANG SEDANG AKTIF
                messages: messages,
                temperature: 0.7
            })
        });

        if (!apiResponse.ok) {
            const errorRaw = await apiResponse.text();
            return res.status(apiResponse.status).json({ 
                error: `Upstream error (${apiResponse.status}): ${errorRaw}` 
            });
        }

        const payloadData = await apiResponse.json();
        return res.status(200).json(payloadData);

    } catch (error) {
        console.error('Critical Proxy Failure:', error);
        return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
}
