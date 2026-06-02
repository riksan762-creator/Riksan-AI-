# 🤖 Riksan AI — Advanced Multi-Engine Hub & Stream Core

<p align="center">
  <img src="https://img.shields.io/badge/OpenAI-Compatible_API-00a67e?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
  <img src="https://img.shields.io/badge/Anthropic-Claude_Network-cc7b19?style=for-the-badge&logo=anthropic&logoColor=white" alt="Anthropic">
  <img src="https://img.shields.io/badge/DeepSeek-V3_&_Coder-0052cc?style=for-the-badge" alt="DeepSeek">
  <img src="https://img.shields.io/badge/Qwen-Alibaba_Cloud-ff6a00?style=for-the-badge&logo=alibabacloud&logoColor=white" alt="Qwen">
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Runtime-Vercel_Edge-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JS">
  <img src="https://img.shields.io/badge/CSS3-Modern_Glassmorphism-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</p>

---

## 🌌 1. Filosofi Proyek & Arsitektur
**Riksan AI** adalah platform *Multi-Engine Gateway Hub* berperforma tinggi yang berjalan di atas infrastruktur *serverless cloud*. Sistem ini menjembatani berbagai model kecerdasan buatan terkemuka di dunia ke dalam satu platform tunggal yang responsif, terenkripsi, dan dioptimasi penuh untuk perangkat seluler (*mobile-first*).

---

## 🛠️ 2. Arsitektur Kode Backend (`api/chat.js`)

Berikut adalah struktur kode inti untuk menangani perutean multi-API (OpenAI, Anthropic, DeepSeek, Qwen) menggunakan protokol *Server-Sent Events (SSE)*:

```javascript
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { messages, engineType } = req.body; 
    const API_KEY = process.env.HIDEPULSA_API_KEY;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    let TARGET_URL = "";
    let fetchPayload = {};

    if (engineType === 'anthropic') {
        TARGET_URL = "[https://ai.hidepulsa.com/v1/messages](https://ai.hidepulsa.com/v1/messages)"; 
        fetchPayload = {
            model: "kr/claude-sonnet-4.5", 
            max_tokens: 4096,
            messages: messages, 
            stream: true
        };
    } else {
        TARGET_URL = "[https://ai.hidepulsa.com/v1/chat/completions](https://ai.hidepulsa.com/v1/chat/completions)";
        fetchPayload = {
            model: engineType === 'qwen' ? "kr/qwen3-coder-next" : "kr/deepseek-3.2",
            messages: messages,
            stream: true,
            search: true 
        };
    }

    try {
        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fetchPayload)
        });

        if (!response.ok) {
            res.write(`data: ${JSON.stringify({ error: "Upstream server overload." })}\n\n`);
            return res.end();
        }

        const reader = response.body;
        for await (const chunk of reader) {
            res.write(chunk); 
        }
        res.end();

    } catch (err) {
        res.write(`data: ${JSON.stringify({ error: "Gateway connection lost." })}\n\n`);
        res.end();
    }
}
