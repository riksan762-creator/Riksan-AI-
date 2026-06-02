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

## 🧠 2. Modul Edukasi: Memahami Masalah & Solusi Koding

### 🚫 Masalah 1: Error Fatal `Unexpected token 'd' is not valid JSON`
* **Penyebab:** Jalur data streaming (SSE) selalu diawali kata teks `data: `. Jika kodingan langsung mengeksekusi `JSON.parse()`, browser akan membaca huruf **`d`** dari kata `data` dan langsung mengalami *crash* layout.
* **Solusi Riksan AI:** Implementasi *Safe Stream Parser* yang memotong string `data: ` menggunakan metode `.replace(/^data: /, '')` sebelum divalidasi ke format JSON objek.

### 🚫 Masalah 2: Layar HP Melompat-lompat Saat Mengetik
* **Penyebab:** Penggunaan unit tinggi biasa (`vh`) akan hancur bergeser ke atas ketika keyboard virtual HP aktif.
* **Solusi Riksan AI:** Memanfaatkan unit CSS modern **`dvh` (Dynamic Viewport Height)** agar posisi form chat otomatis menyesuaikan tinggi layar secara halus (*smooth*).

---

## 🚀 3. Panduan Instalasi & Integrasi API AI (Step-by-Step Guide)

Bagian ini akan mengajari kamu cara menginstalasi dan mengonfigurasi skema API dari berbagai vendor AI ke dalam satu berkas backend (`api/chat.js`).

### Langkah 1: Inisialisasi Struktur File Proyek
Buat struktur direktori dasar pada repositori lokal kamu seperti ini:
```text
├── api/
│   └── chat.js          # Tempat Instalasi & Integrasi API AI (Backend)
├── css/
│   └── style.css        # Desain Interface Premium Glassmorphism
├── js/
│   └── script.js        # Kontroler Stream Klien & Antarmuka UI
└── index.html           # File Utama Aplikasi
