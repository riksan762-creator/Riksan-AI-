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
  <img src="https://img.shields.io/badge/HTML5-Viewport_Locked-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
</p>

---

## 🌌 1. Filosofi Proyek & Arsitektur
**Riksan AI** bukan sekadar aplikasi antarmuka chat biasa. Ini adalah sebuah **Multi-Engine Gateway Hub** berperforma tinggi yang berjalan di atas infrastruktur *serverless cloud*. 

Sistem ini dirancang untuk menjembatani berbagai model kecerdasan buatan terkemuka di dunia (seperti DeepSeek, Claude Anthropic, dan Qwen) ke dalam satu platform tunggal yang responsif, terenkripsi, dan ramah terhadap perangkat seluler (*mobile-first*).

---

## 🧠 2. Modul Edukasi: Memahami Masalah & Solusi Koding

Sebagai pengembang, membangun sistem berbasis *Artificial Intelligence Stream* mengharuskan kita paham kendala jaringan dan perilaku *browser*. Berikut adalah masalah krusial di dunia nyata yang berhasil diselesaikan oleh **Riksan AI Core**:

### 🚫 Masalah 1: Error Fatal `Unexpected token 'd' is not valid JSON`
* **Kenapa Ini Terjadi?** Ketika data dikirim dari server menggunakan protokol Server-Sent Events (SSE), data tersebut mengalir dalam bentuk bongkahan teks (*chunks*) yang diawali dengan kata `data: {"choices": ...}`. Jika kode JavaScript kamu langsung melakukan `JSON.parse()` tanpa membuang teks pembuka `data: `, browser akan membaca huruf pertama yaitu **`d`** dan langsung mengalami *crash* karena menganggapnya format JSON yang rusak.
* **Solusi Riksan AI:** Implementasi *Safe Stream Parser* pada sisi klien yang menyaring kata `data: ` secara ketat menggunakan regex sebelum diubah menjadi objek JavaScript.

### 🚫 Masalah 2: Layar HP Melompat-lompat & Auto-Zoom Saat Mengetik
* **Kenapa Ini Terjadi?** Browser seluler (iOS Safari & Android Chrome) memiliki mekanisme proteksi bawaan: jika pengguna menyentuh kolom input yang ukuran fontnya di bawah `16px`, layar akan dipaksa melakukan *zoom-in* otomatis. Selain itu, penggunaan unit tinggi biasa (`15vh` / `100vh`) akan langsung hancur bergeser ke atas ketika papan ketik virtual HP muncul.
* **Solusi Riksan AI:** Mengunci ukuran teks input tepat di angka `16px` dan memanfaatkan unit CSS Modern dinamis yaitu **`dvh` (Dynamic Viewport Height)** dan **`svh` (Short Viewport Height)** agar posisi form chat fleksibel dan mulus (*smooth*) mengikuti pergerakan keyboard.

---

## 🗺️ 3. Diagram Alur Transmisi Data (Data Flow)

Sistem memproses permintaan dari antarmuka pengguna ke server penengah hingga sampai ke pusat data AI menggunakan jalur asinkronus berikut:

```text
┌─────────────────────────┐          [Mengirim Teks Input]         ┌─────────────────────────┐
│   User Interface (UI)   ├───────────────────────────────────────>│   Vercel Edge Gateway   │
│  (Premium Glassmorphism)│<───────────────────────────────────────┤  (api/chat.js Backend)  │
└─────────────────────────┘         [Membaca Stream Per Kata]      └────────────┬────────────┘
                                                                                │
                                                                   [Membagi Payload Rute]
                                                                                │
                                              ┌─────────────────────────────────┴─────────────────────────────────┐
                                              ▼                                                                   ▼
                               ┌──────────────────────────────┐                                    ┌──────────────────────────────┐
                               │     OpenAI Protocol Hub      │                                    │    Anthropic Protocol Hub    │
                               ├──────────────────────────────┤                                    ├──────────────────────────────┤
                               │ Core Model:                  │                                    │ Core Model:                  │
                               │ • kr/deepseek-3.2            │                                    │ • kr/claude-sonnet-4.5       │
                               │ • kr/qwen3-coder-next        │                                    │ • kr/claude-opus-4.7         │
                               └──────────────────────────────┘                                    └──────────────────────────────┘
