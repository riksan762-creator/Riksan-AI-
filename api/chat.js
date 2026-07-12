export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // =====================================================================
    // 🕒 INJEKSI WAKTU REAL-TIME (WIB)
    // Ini membuat AI selalu tahu hari, tanggal, dan jam saat ini!
    // =====================================================================
    const now = new Date();
    const dateOptions = { timeZone: 'Asia/Jakarta', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dayOptions = { timeZone: 'Asia/Jakarta', weekday: 'long' };
    
    const currentDate = now.toLocaleDateString('id-ID', dateOptions);
    const currentTime = now.toLocaleTimeString('id-ID', timeOptions);
    const currentDay = now.toLocaleDateString('id-ID', dayOptions);

    // =====================================================================
    // 🧠 SYSTEM PROMPT: INTI OTAK RIKSAN AI
    // =====================================================================
    const systemMessage = {
      role: "system",
      content: `Kamu adalah Riksan AI, model kecerdasan buatan (AI) yang super canggih, sangat cerdas, dan responsif versi tahun 2026. 

Aturan Identitas & Pengetahuanmu:
1. Kamu diciptakan dan dikembangkan secara eksklusif oleh Riksan, Co-founder dan CTO dari aplikasi digital Sawargi Pay.
2. Jika ada yang bertanya siapa pembuatmu, jawablah dengan bangga dan berkelas bahwa kamu adalah karya dari Riksan.
3. KESADARAN WAKTU: Saat ini adalah hari ${currentDay}, tanggal ${currentDate}, jam ${currentTime} WIB. Jika pengguna bertanya hari ini hari apa, jam berapa, atau kejadian terkini, gunakan acuan waktu ini agar jawabanmu terasa hidup dan relevan dengan masa sekarang.
4. Jawablah dengan wawasan yang luas. Jika pengguna meminta kode (HTML, CSS, JS, PHP, dll), berikan menggunakan format markdown code block agar sistem bisa membungkusnya ke dalam kotak hitam yang rapi.
5. Gunakan gaya bahasa Indonesia yang asik, natural, profesional, dan pintar layaknya asisten developer tingkat tinggi.`
    };

    // Gabungkan sistem dengan pesan dari user
    const apiMessages = [systemMessage, ...messages];

    // =====================================================================
    // 🚀 PANGGIL GROQ API (Super Cepat)
    // Groq menggunakan endpoint yang mirip dengan OpenAI, jadi sangat mudah!
    // =====================================================================
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}` // Kunci API Groq-mu
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // Menggunakan model LLaMA 3 70B (Sangat canggih & akurat)
        messages: apiMessages,
        temperature: 0.7, 
        max_tokens: 2000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Terjadi kesalahan pada server Groq.');
    }
    
    // Kirim balasan kembali ke tampilan depan
    res.status(200).json(data);

  } catch (error) {
    console.error("Error di server Riksan AI:", error);
    res.status(500).json({ error: error.message || 'Sistem sedang sibuk atau terjadi kendala jaringan.' });
  }
}
