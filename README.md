# 🤖 Riksan AI — Advanced Dual-Engine Core V1

<p align="center">
  <a href="https://github.com/riksan762/riksan-core-v1">
    <img src="https://img.shields.io/badge/Architecture-Dual--Engine%20Hybrid-7c3aed?style=for-the-badge&logo=cpu" alt="Architecture">
  </a>
  <img src="https://img.shields.io/badge/OpenAI--Compatible-Active-00a67e?style=for-the-badge&logo=openai" alt="OpenAI">
  <img src="https://img.shields.io/badge/Anthropic--Compatible-Active-cc7b19?style=for-the-badge&logo=anthropic" alt="Anthropic">
  <img src="https://img.shields.io/badge/Runtime-Vercel%20Edge-000000?style=for-the-badge&logo=vercel" alt="Runtime">
</p>

---

## 🌌 Overview

**Riksan AI** adalah platform asisten kecerdasan buatan (*Artificial Intelligence*) modular berperforma tinggi yang dibangun di atas infrastruktur serverless. Sistem ini menerapkan arsitektur **Dual-Engine Endpoint**, memungkinkan integrasi *seamless* secara simultan ke ekosistem **OpenAI-compatible gateway** dan **Anthropic-compatible payload router** melalui satu gerbang kontrol pintar.

Dengan optimalisasi penuh pada penanganan *Server-Sent Events (SSE)*, Riksan AI mampu mengeksekusi instruksi kompleks, komputasi *real-time search*, hingga otomatisasi koding tanpa gejala lag ataupun *stuttering* pada antarmuka pengguna.

---

## ✨ Fitur Utama (Enterprise Features)

* **⚡ Hybrid Model Orchestration:** Pindah *engine* secara instan antara kekuatan penalaran logis tingkat tinggi (Claude 4.7 Opus / Sonnet 4.5) dan kecepatan eksekusi instan (DeepSeek Matrix / Qwen Coder).
* **🎨 Ultra-Premium UI Glassmorphism:** Desain visual estetik dengan tema gelap futuristik, memanfaatkan teknik lapisan *blur translucent*, efek pendaran neon kontemporer (*neon glow boundaries*), dan kenyamanan scannability tingkat tinggi.
* **📱 Smart Mobile Input Lock (`dvh` & `svh`):** Sistem mitigasi layout geser. Posisi papan ketik dikunci menggunakan unit CSS dinamis, mencegah browser HP melakukan auto-zoom atau lompatan *viewport* yang mengganggu saat keyboard virtual aktif.
* **🧩 Safe Stream Parser (Anti-Crash Algorithm):** Algoritma pemisah data pintar yang secara otomatis menyaring *raw text chunk*, mengisolasi fragmen `data: `, serta mencegah *error* pembacaan JSON ilegal (`Unexpected token 'd'`).
* **📦 Markdown & Syntax Highlight Render:** Parser bawaan berkecepatan tinggi yang mendukung konversi teks kaya, rendering tabel matematika, serta pewarnaan baris kode pemrograman (*monospaced code block*) otomatis.

---

## 🏗️ Diagram Arsitektur Data

```text
                     ┌───────────────────────────┐
                     │    Riksan AI Frontend     │
                     │  (Glassmorphism View Core)│
                     └─────────────┬─────────────┘
                                   │
                         [text/event-stream]
                                   │
                     ┌─────────────▼─────────────┐
                     │     Vercel Edge API       │
                     │  (Secure Router Engine)   │
                     └─────────────┬─────────────┘
                                   │
            ┌──────────────────────┴──────────────────────┐
            ▼                                             ▼
┌───────────────────────┐                     ┌───────────────────────┐
│   OpenAI Endpoint     │                     │  Anthropic Endpoint   │
│   (POST /v1/chat/...) │                     │  (POST /v1/messages)  │
├───────────────────────┤                     ├───────────────────────┤
│ Models:               │                     │ Models:               │
│ - kr/deepseek-3.2     │                     │ - kr/claude-opus-4.7  │
│ - kr/qwen3-coder-next │                     │ - kr/claude-sonnet-4.5│
└───────────────────────┘                     └───────────────────────┘
