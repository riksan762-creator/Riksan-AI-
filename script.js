document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const initialScreen = document.getElementById('initialScreen');

  let conversationHistory = [];

  // Input auto-grow tanpa merusak layout
  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  // Fungsi pintasan suggestions
  window.setSuggestion = function(text) {
    userInput.value = text;
    userInput.focus();
    userInput.dispatchEvent(new Event('input'));
  };

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    // Sembunyikan layar suggestion saat chat dimulai
    if (initialScreen) {
      initialScreen.remove();
    }

    appendMessage('user', query);
    conversationHistory.push({ role: 'user', content: query });
    
    userInput.value = '';
    userInput.style.height = 'auto';
    setLoading(true);

    const assistantMessageId = appendMessage('assistant', 'Memikirkan logika...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      });

      const data = await response.json();

      if (response.ok) {
        const reply = data.choices[0].message.content;
        updateMessageText(assistantMessageId, reply);
        conversationHistory.push({ role: 'assistant', content: reply });
      } else {
        updateMessageText(assistantMessageId, `Error: ${data.error || 'Terjadi gangguan sistem.'}`);
      }
    } catch (err) {
      updateMessageText(assistantMessageId, 'Gagal terhubung ke server.');
      console.error(err);
    } finally {
      setLoading(false);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  function appendMessage(sender, text) {
    const id = 'msg-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.id = id;

    const iconType = sender === 'user' ? 'user' : 'cpu';
    
    messageDiv.innerHTML = `
      <div class="msg-avatar"><i data-lucide="${iconType}"></i></div>
      <div class="msg-text">${escapeHtml(text)}</div>
    `;
    
    chatBox.appendChild(messageDiv);
    lucide.createIcons();
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
  }

  function updateMessageText(id, newText) {
    const msgEl = document.getElementById(id);
    if (msgEl) {
      msgEl.querySelector('.msg-text').innerText = newText;
    }
  }

  function setLoading(loading) {
    sendBtn.disabled = loading;
    if (loading) {
      sendBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i>`;
    } else {
      sendBtn.innerHTML = `<i data-lucide="arrow-up"></i>`;
    }
    lucide.createIcons();
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // Tombol reset chat baru di top bar
  document.querySelector('.new-chat-btn').addEventListener('click', () => {
    window.location.reload();
  });
});
