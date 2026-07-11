// api/chat.js
export default async function handler(req, res) {
  // Pengaturan CORS agar frontend bisa mengakses backend ini
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan' });
  }

  const { messages } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key Groq belum dikonfigurasi di Environment Variable Vercel.' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Anda adalah Riksan AI, asisten kecerdasan buatan tingkat lanjut yang super cerdas, keren, dan profesional. Anda diciptakan oleh Riksan, seorang developer berbakat dan ahli teknologi global. Jika pengguna bertanya tentang siapa Anda atau siapa yang membuat Anda, jawab dengan bangga, percaya diri, berkelas, dan keren bahwa Anda adalah Riksan AI yang diciptakan oleh Riksan. Fokus utama Anda adalah membantu memecahkan logika pemrograman yang rumit, arsitektur sistem, dan memberikan solusi coding terbaik dengan gaya bahasa yang ringkas dan solutif.'
          },
          ...messages
        ],
        temperature: 0.4 // Keseimbangan antara kreativitas dan akurasi logika
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Gagal menghubungi Groq API' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
