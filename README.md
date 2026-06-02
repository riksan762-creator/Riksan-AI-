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

## 🚀 2. Panduan Lengkap Menjalankan & Deploy Proyek

Ikuti instruksi langkah-demi-langkah di bawah ini untuk menyiapkan lingkungan lokal, menguji kode, mengunggah ke GitHub, hingga melakukan publikasi otomatis (*live deployment*) di Vercel.

### 📁 Langkah 2.1: Konfigurasi Struktur Folder Proyek
Sebelum menjalankan perintah apa pun, pastikan seluruh berkas kodingan kamu berada di struktur direktori yang benar:
```text
riksan-ai/
├── api/
│   └── chat.js          # File backend Node.js (Vercel Serverless)
├── css/
│   └── style.css        # Desain Interface Premium Glassmorphism
├── js/
│   └── script.js        # File logika penanganan stream di sisi client
├── index.html           # File HTML utama aplikasi
└── README.md            # Dokumentasi ini
```

### 💻 Langkah 2.2: Menjalankan Proyek Secara Lokal (Local Development)
Untuk menguji performa *streaming* chat di komputer lokal sebelum di-upload ke internet, gunakan **Vercel CLI** untuk membuat local server peniru (*emulation*):

1. Buka terminal/command prompt di dalam folder proyek `riksan-ai/`.
2. Install Vercel CLI secara global (jika belum punya):
```bash
   npm install -g vercel
   ```
3. Jalankan perintah *development server* lokal:
```bash
   vercel dev
   ```
4. Terminal akan memproses fungsi API lokal dan memberikan alamat akses. Buka browser kamu dan akses:
```text
   http://localhost:3000
   ```

---

### 🐙 Langkah 2.3: Mengunggah Proyek ke GitHub
Gunakan rentetan perintah Git berikut untuk mengunci kode lokal dan mengirimkannya ke repositori cloud GitHub kamu:

```bash
# 1. Inisialisasi folder lokal menjadi repositori Git aktif
git init

# 2. Daftarkan seluruh file dan folder ke dalam staging area Git
git add .

# 3. Kunci perubahan kode di dalam database lokal dengan memberikan pesan deskriptif
git commit -m "feat: implement premium multi-engine architecture with anti-jump layout"

# 4. Ubah nama branch utama lokal menjadi 'main' (standar global modern)
git branch -M main

# 5. Pasang alamat remote target (Hubungkan folder lokal ke link repositori GitHub kamu)
# Note: Ganti URL di bawah dengan tautan repositori kosong yang kamu buat di akun GitHub-mu
git remote add origin [https://github.com/username/riksan-ai.git](https://github.com/username/riksan-ai.git)

# 6. Push atau unggah seluruh source code dari komputer lokal langsung ke GitHub
git push -u origin main
```

---

### ☁️ Langkah 2.4: Deploy Otomatis ke Cloud Vercel Production

Kamu bisa memilih salah satu dari dua metode deployment profesional di bawah ini:

#### 🔹 Metode A: Deploy Via Web Dashboard Vercel (Rekomendasi Utama)
1. Buka browser dan login ke akun [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik tombol **"Add New..."** di pojok kanan atas, lalu pilih opsi **"Project"**.
3. Cari nama repositori GitHub kamu (`riksan-ai`) pada daftar yang tersedia, lalu klik tombol **"Import"**.
4. Di bagian **Environment Variables**, klik untuk membuka dropdown panel. Langkah ini sangat krusial agar backend kamu bisa terhubung ke API Key rahasia:
   * **Key:** `HIDEPULSA_API_KEY`
   * **Value:** `sk-kr-zyGrey5gaxvJxV4GBFWJmRfTcN3GTgFj`
   * Klik tombol **"Add"** setelah mengisi data.
5. Klik tombol **"Deploy"**.
6. Tunggu proses kompilasi selama beberapa detik. Selesai! Proyek kamu sekarang online dengan URL berdomain `.vercel.app`. Setiap kali kamu melakukan `git push` di masa depan, Vercel akan memperbarui web kamu secara otomatis.

#### 🔹 Metode B: Deploy Langsung Menggunakan Vercel CLI (Via Terminal)
Jika kamu lebih suka melakukan publikasi cepat langsung dari baris perintah terminal editor kodinganmu:

```bash
# 1. Masuk/Login ke akun Vercel kamu lewat terminal
vercel login

# 2. Jalankan perintah inisialisasi proyek (Ikuti dan setujui semua opsi default di layar)
vercel

# 3. Daftarkan API Key rahasia kamu langsung ke server cloud Vercel
vercel env add HIDEPULSA_API_KEY sk-kr-zyGrey5gaxvJxV4GBFWJmRfTcN3GTgFj

# 4. Lakukan trigger kompilasi final untuk merilis URL produksi live komersial
vercel --prod
```

---

## 🔒 3. Fault Tolerance & Proteksi Sistem
Sistem ini dibekali dengan modul *Error Shielding*. Ketika server proxy melempar kode error `502 Bad Gateway`, sistem backend tidak akan mati total melainkan langsung mengisolasi paket data berbahaya, menghentikan koneksi secara aman, dan mengirimkan pesan peringatan yang rapi ke user interface.

---

<p align="center">
  <b>Riksan AI Core Engineering Docs</b> • Dikelola penuh oleh <b>Riksan (CTO)</b>
</p>
