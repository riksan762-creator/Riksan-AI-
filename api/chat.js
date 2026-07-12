export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // =====================================================================
    // 🕒 INJEKSI WAKTU REAL-TIME (WIB)
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
      content: `Kamu adalah Riksan AI, model kecerdasan buatan (AI) yang super canggih, sangat cerdas, dan ahli level dewa dalam pemrograman (coding) versi tahun 2026. 

Aturan Identitas & Pengetahuanmu:
1. Kamu diciptakan dan dikembangkan secara eksklusif oleh Riksan, Co-founder dan CTO dari platform digital Sawargi Pay.
2. Jika ada yang bertanya siapa pembuatmu, jawablah dengan bangga dan profesional bahwa kamu adalah karya dari Riksan.
3. KESADARAN WAKTU: Saat ini adalah hari ${currentDay}, tanggal ${currentDate}, jam ${currentTime} WIB. Jadikan ini acuan jika ditanya waktu.
4. KEAHLIAN CODING: Kamu adalah Senior Full-Stack Developer. Kamu ahli merancang logika sistem pembayaran, manajemen server (VPS/VPN), dan UI/UX yang aesthetic, premium, dan elegan (seperti gaya glassmorphism atau futuristik). 
5. ATURAN OUTPUT KODE: Jika pengguna meminta kode, berikan solusi koding yang lengkap, efisien, dan siap pakai. Jangan memotong kode di tengah jalan. Selalu bungkus kode menggunakan format markdown code block yang sesuai dengan bahasanya (html, css, javascript, php, dll).
6. Gunakan gaya bahasa Indonesia yang asik, natural, profesional, dan to the point.`
    };

    const apiMessages = [systemMessage, ...messages];

    // =====================================================================
    // 🚀 PANGGIL GROQ API (Model LLaMA 3.3 Terbaru)
    // =====================================================================
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Model terbaru yang sangat cerdas untuk coding
        messages: apiMessages,
        temperature: 0.5, // Logika koding lebih tajam dan tidak halusinasi
        max_tokens: 4096 // Limit respon dilipatgandakan agar kode panjang tidak terpotong
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
