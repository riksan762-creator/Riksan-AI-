/* style.css - Optimized for Stabilization and Layout like ChatGPT */
:root {
  --bg-main: #212121;
  --bg-sidebar: #171717;
  --bg-input: #2f2f2f;
  --text-main: #ececec;
  --text-muted: #b4b4b4;
  --border-color: #424242;
  --accent-color: #10a37f; /* Teal ala OpenAI */
  --max-content-width: 768px; /* Ini kunci stabilisasi agar tidak terlalu lebar */
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif;
}

body {
  background-color: var(--bg-main);
  color: var(--text-main);
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.app-container {
  display: flex;
  width: 100%;
  height: 100%;
}

/* --- Sidebar Styling (Lebih Rapi) --- */
.sidebar {
  width: 260px;
  background-color: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-right: 1px solid var(--border-color);
  flex-shrink: 0; /* Sidebar tidak boleh mengecil */
}

.new-chat-btn {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s;
}

.new-chat-btn:hover {
  background-color: #2a2a2a;
  border-color: #565656;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
  padding: 12px 0 0 0;
  border-top: 1px solid #2a2a2a;
}

/* --- Main Chat Workspace --- */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  background-color: rgba(33, 33, 33, 0.95); /* Sedikit blur di belakang header */
  backdrop-filter: blur(5px);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-header h1 {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.chat-header h1 span {
  color: var(--accent-color);
}

/* --- Message Display Area (PENTING UNTUK JARAK) --- */
.messages-box {
  flex: 1;
  overflow-y: auto;
  padding-top: 20px;
  padding-bottom: 150px; /* Jarak ekstra di bawah agar tidak tertutup input area */
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
}

/* Container di dalam pesan untuk stabilisasi lebar */
.message-content {
  max-width: var(--max-content-width);
  margin: 0 auto; /* Tengah-tengah */
  width: 100%;
  display: flex;
  gap: 18px; /* Jarak antara avatar dan teks */
  padding: 18px 24px; /* Jarak atas/bawah dan kiri/kanan di dalam pesan */
}

.message.assistant {
  background-color: rgba(255, 255, 255, 0.015);
}

/* Avatar Styling */
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--border-color);
  flex-shrink: 0;
  margin-top: 2px; /* Menyelaraskan sedikit dengan baris pertama teks */
}

/* Efek Animasi Premium Avatar Riksan AI */
.message.assistant .avatar {
  background-color: var(--accent-color);
  box-shadow: 0 0 10px rgba(16, 163, 127, 0.3);
  animation: pulseGlow 2.5s infinite ease-in-out;
}

@keyframes pulseGlow {
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(16, 163, 127, 0.3); }
  50% { transform: scale(1.03); box-shadow: 0 0 14px rgba(16, 163, 127, 0.5); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(16, 163, 127, 0.3); }
}

/* Text Container di dalam pesan */
.text {
  flex: 1;
  font-size: 15px;
  line-height: 1.7; /* Jarak antar baris teks agar enak dibaca */
  white-space: pre-wrap;
  word-break: break-word;
}

/* --- Input Area (PENTING UNTUK STABILISASI) --- */
.input-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(33, 33, 33, 0) 0%, var(--bg-main) 30%, var(--bg-main) 100%);
  padding: 10px 0 30px 0; /* Padding bawah lebih besar */
  z-index: 5;
}

.input-wrapper-container {
  max-width: var(--max-content-width);
  margin: 0 auto;
  width: 100%;
  padding: 0 24px; /* Memberikan jarak dari pinggir layar mobile */
}

.input-wrapper {
  position: relative;
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 16px; /* Sudut lebih melengkung ala ChatGPT */
  display: flex;
  align-items: flex-end; /* Supaya button di bawah kalau textarea tinggi */
  padding: 10px 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrapper:focus-within {
  border-color: #565656;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.input-wrapper textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-main);
  resize: none;
  max-height: 200px;
  font-size: 15px;
  line-height: 1.5;
  padding: 4px 40px 4px 4px; /* padding kanan besar agar tidak tertutup button */
  overflow-y: auto;
}

.input-wrapper textarea::placeholder {
  color: var(--text-muted);
}

.input-wrapper button {
  position: absolute;
  right: 12px;
  bottom: 10px;
  background-color: var(--text-main);
  color: var(--bg-main);
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, opacity 0.2s;
}

.input-wrapper button:hover:not(:disabled) {
  background-color: #ffffff;
}

.input-wrapper button:disabled {
  background-color: #3f3f3f;
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Loading Spin Animation */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* --- Mobile Responsiveness (Kritis untuk Stabil) --- */
@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    left: -260px; /* Sembunyikan sidebar di mobile */
    top: 0;
    bottom: 0;
    z-index: 100;
    transition: left 0.3s ease;
  }
  
  .sidebar.open {
    left: 0;
  }

  .message-content {
    padding: 16px;
    gap: 14px;
  }

  .text {
    font-size: 14px;
  }
  
  .input-wrapper-container {
    padding: 0 16px;
  }
}
