export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;

    // --- DETEKSI APAKAH ADA GAMBAR (VISION) ---
    let containsImage = false;
    for (const msg of messages) {
      if (Array.isArray(msg.content)) {
        for (const part of msg.content) {
          if (part.type === 'image_url') {
            containsImage = true;
            break;
          }
        }
      }
    }

    // Jika ada gambar, pakai model Vision. Jika teks murni, pakai model Versatile (Ahli Koding).
    const selectedModel = containsImage ? 'llama-3.2-11b-vision-preview' : 'llama-3.3-70b-versatile';

    const systemMessage = {
      role: "system",
      content: `Kamu adalah Riksan AI versi 3.0, AI super cerdas buatan Riksan (CTO Sawargi Pay).
      
ATURAN UTAMA:
1. KEAHLIAN DEVELOPER: Kamu ahli membuat kodingan UI/UX elegan, manajemen server, dan logika pembayaran digital (PPOB).
2. ANALISIS GAMBAR: Jika pengguna mengirimkan gambar, perhatikan secara detail dan jawab secara komprehensif apa yang ada di dalam gambar tersebut.
3. GENERATOR GAMBAR (PENTING): Jika pengguna memintamu membuat, menggambar, atau menghasilkan gambar, berikan respon berupa Markdown berikut TANPA menggunakan code block: 
![Deskripsi Gambar](https://image.pollinations.ai/prompt/tulis_deskripsi_detail_dalam_bahasa_inggris_disini?width=1024&height=1024&nologo=true)
Contoh: "Ini dia gambar mobilnya: ![Mobil Sport](https://image.pollinations.ai/prompt/a%20red%20sports%20car%20in%20cyberpunk%20city?width=1024&height=1024&nologo=true)"
4. Bersikaplah seperti AI profesional kelas atas.`
    };

    const apiMessages = [systemMessage, ...messages];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: apiMessages,
        temperature: 0.6,
        max_tokens: 4096
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Server Error.');
    
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message || 'Kendala jaringan.' });
  }
}
