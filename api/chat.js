export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed.' }), { status: 405 });
    }

    const apiKey = process.env.HIDEPULSA_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Backend Configuration Error: API Key missing.' }), { status: 500 });
    }

    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Invalid Input.' }), { status: 400 });
        }

        // 🌟 TRIK UTAMA: Gabungkan seluruh history menjadi 1 string pesan USER tunggal
        // Ini dilakukan agar mem bypass bug parser di proxy backend HidePulsa
        let flattenedHistory = "";
        
        messages.forEach(msg => {
            if (msg.role === 'system') {
                flattenedHistory += `[System Instruction: ${msg.content}]\n`;
            } else if (msg.role === 'user') {
                flattenedHistory += `User: ${msg.content}\n`;
            } else if (msg.role === 'assistant') {
                flattenedHistory += `AI: ${msg.content}\n`;
            }
        });

        // Tambahkan perintah penutup agar AI merespon dengan format yang benar
        flattenedHistory += "\nLanjutkan percakapan di atas sebagai AI. Berikan respon langsung tanpa menuliskan ulang label 'AI:' di awal jawaban kamu.";

        // Bungkus menjadi struktur tunggal yang disukai proxy HidePulsa
        const sanitizedPayload = [
            {
                role: 'user',
                content: flattenedHistory
            }
        ];

        // Jalankan fetch stream ke upstream
        const apiResponse = await fetch('https://ai.hidepulsa.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'kr/qwen3-coder-next',
                messages: sanitizedPayload, // Kirim payload yang sudah disterilkan
                temperature: 0.7,
                stream: true
            })
        });

        if (!apiResponse.ok) {
            const errorRaw = await apiResponse.text();
            return new Response(JSON.stringify({ error: `Upstream error: ${errorRaw}` }), { status: apiResponse.status });
        }

        return new Response(apiResponse.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), { status: 500 });
    }
}
