// Node.js Serverless Function runtime untuk Vercel Proxy Aman
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed.' });
    }

    const apiKey = process.env.HIDEPULSA_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ 
            error: 'Backend Configuration Error: API Key missing.' 
        });
    }

    try {
        const { messages } = req.body;

        // Tembak ke endpoint OpenAI-compatible milik HidePulsa
        const apiResponse = await fetch('https://ai.hidepulsa.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'kr/claude-opus-4.7', // 🌟 DIUBAH KE MODEL YANG DIDUKUNG PROVIDER KAMU
                messages: messages,
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
