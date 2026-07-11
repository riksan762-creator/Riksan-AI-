/* style.css - Premium Mobile Layout Perfect ChatGPT Clone */
:root {
  --bg-dark: #0d0d0d;
  --bg-surface: #171717;
  --bg-pill: #212121;
  --text-main: #f9f9f9;
  --text-muted: #b4b4b4;
  --border-color: #2f2f2f;
  --accent-color: #10a37f;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-main);
  height: 100vh;
  height: -webkit-fill-available;
  overflow: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: -webkit-fill-available;
  position: relative;
}

/* --- Top Navigation Bar --- */
.top-nav {
  height: 60px;
  background-color: var(--bg-dark);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 50;
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.nav-btn {
  background: transparent;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.nav-btn:active {
  background-color: var(--bg-surface);
}

.nav-btn i {
  width: 22px;
  height: 22px;
}

/* --- Main Workspace Container --- */
.chat-main {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-dark);
}

.messages-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 16px 20px 100px 20px; /* Padding bawah disiapkan untuk input melayang */
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
}

/* --- Initial ChatGPT Screen Layout --- */
.initial-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 180px);
}

.welcome-logo {
  width: 50px;
  height: 50px;
  background-color: var(--bg-surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.shortcut-list {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shortcut-item {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: background 0.2s;
}

.shortcut-item:active {
  background-color: var(--bg-pill);
}

.shortcut-item i {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

/* --- Chat Message Bubble --- */
.message {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
  max-width: 600px;
  width: 100%;
  align-self: center;
}

.message.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.user .msg-avatar {
  background-color: var(--bg-pill);
}

.message.assistant .msg-avatar {
  background-color: var(--accent-color);
}

.msg-text {
  background-color: transparent;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  padding-top: 4px;
  flex: 1;
}

.message.user .msg-text {
  text-align: right;
  background-color: var(--bg-surface);
  padding: 10px 16px;
  border-radius: 18px;
  max-width: 80%;
  flex: none;
}

/* --- Floating Pill Input Box --- */
.input-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 20px 24px 20px;
  background: linear-gradient(180deg, rgba(13,13,13,0) 0%, var(--bg-dark) 40%);
  z-index: 60;
}

.input-pill {
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--bg-pill);
  border-radius: 28px; /* Kapsul Sempurna */
  display: flex;
  align-items: center;
  padding: 6px 6px 6px 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  border: 1px solid var(--border-color);
}

.input-pill textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-main);
  resize: none;
  max-height: 120px;
  font-size: 15px;
  padding: 8px 8px;
  line-height: 1.4;
}

.pill-icon-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.send-btn {
  background-color: var(--text-main);
  color: var(--bg-dark);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.send-btn:active {
  transform: scale(0.95);
}

.send-btn:disabled {
  background-color: var(--border-color);
  color: var(--text-muted);
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
