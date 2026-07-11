document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const emptyState = document.getElementById('emptyState');

  let conversationHistory = [];

  // Logic UI Input (Auto-Resize & Tombol Biru aktif)
  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';

    if (this.value.trim().length > 0) {
      sendBtn.disabled = false;
      sendBtn.classList.add('active'); // Ubah jadi biru terang
    } else {
      sendBtn.disabled = true;
      sendBtn.classList.remove('active'); // Kembalikan ke pudar
    }
  });

  // Pintasan Suggestion (Klik menu langsung terketik)
  window.setSuggestion = function(text) {
    userInput.value = text;
    userInput.dispatchEvent(new Event('input')); // Panggil event agar tinggi menyesuaikan
    userInput.focus();
  };

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    // Hapus tampilan shortcut logo saat chat dimulai
    if (emptyState) emptyState.style.display = 'none';

    appendMessage('user', query);
    conversationHistory.push({ role: 'user', content: query });

    // Reset input
    userInput.value = '';
    userInput.style.height = 'auto';
    userInput.dispatchEvent(new Event('input')); // Matikan lagi tombol send
    
    // Set animasi loading
    sendBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i>`;
    lucide.createIcons();

    const assistantId = appendMessage('assistant', 'Memproses...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      });

      const data = await response.json();

      if (response.ok) {
        const reply = data.choices[0].message.content;
        updateMessageText(assistantId, reply);
        conversationHistory.push({ role: 'assistant', content: reply });
      } else {
        updateMessageText(assistantId, `Error: ${data.error || 'Terjadi kendala server.'}`);
      }
    } catch (err) {
      updateMessageText(assistantId, 'Gagal terhubung. Pastikan API menyala.');
    } finally {
      // Kembalikan ikon panah ke atas
      sendBtn.innerHTML = `<i data-lucide="arrow-up"></i>`;
      lucide.createIcons();
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  function appendMessage(sender, text) {
    const id = 'msg-' + Date.now();
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.id = id;

    if (sender === 'user') {
      div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    } else {
      div.innerHTML = `
        <div class="msg-avatar">
          <i data-lucide="cpu" style="width: 20px; height: 20px; color: var(--text-main);"></i>
        </div>
        <div class="msg-bubble">${escapeHtml(text)}</div>
      `;
    }
    
    chatBox.appendChild(div);
    lucide.createIcons();
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
  }

  function updateMessageText(id, text) {
    const el = document.getElementById(id);
    if (el) el.querySelector('.msg-bubble').innerText = text;
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Tombol Chat Baru
  document.querySelector('.new-chat-btn').addEventListener('click', () => {
    window.location.reload();
  });
});
