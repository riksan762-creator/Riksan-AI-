// Node.js Serverless Function runtime untuk Vercel Proxy Aman
export default async function handler(req, res) {
    // 1. CORS & Method Protection
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST execution endpoint.' });
    }

    // 2. Validate Security Variable Envs
    const apiKey = process.env.HIDEPULSA_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ 
            error: 'Backend Configuration Error: API Key missing inside Vercel Environment Variables.' 
        });
    }

    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid Input: Payload must contain dynamic chat messages history.' });
        }

        // 3. Forward Secure Request payload to HidePulsa Infrastructure Base URL
        const apiResponse = await fetch('https://ai.hidepulsa.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Konfigurasi default fallback model stabil terpopuler
                messages: messages,
                temperature: 0.7
            })
        });

        if (!apiResponse.ok) {
            const errorRaw = await apiResponse.text();
            return res.status(apiResponse.status).json({ 
                error: `Upstream service rejected transmission. Raw Payload: ${errorRaw}` 
            });
        }

        const payloadData = await apiResponse.json();
        return res.status(200).json(payloadData);

    } catch (error) {
        console.error('Critical Proxy Execution Failure:', error);
        return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
}
