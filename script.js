document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const emptyState = document.getElementById('emptyState');

  let conversationHistory = [];

  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';

    if (this.value.trim().length > 0) {
      sendBtn.disabled = false;
      sendBtn.classList.add('active');
    } else {
      sendBtn.disabled = true;
      sendBtn.classList.remove('active');
    }
  });

  window.setSuggestion = function(text) {
    userInput.value = text;
    userInput.dispatchEvent(new Event('input'));
    userInput.focus();
  };

  // --- FUNGSI FORMAT MARKDOWN ---
  function formatMarkdown(text) {
    let formatted = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Deteksi Code Block dan tambahkan class "language-x" untuk Highlight.js
    formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
      const language = lang ? lang : 'plaintext';
      const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
      
      return `
        <div class="code-wrapper">
          <div class="code-header">
            <span class="code-lang">${language}</span>
            <button class="copy-btn" onclick="copyToClipboard(this, '${codeId}')">
              <i data-lucide="copy" style="width: 14px; height: 14px;"></i> Salin
            </button>
          </div>
          <pre><code id="${codeId}" class="language-${language}">${code}</code></pre>
        </div>
      `;
    });

    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    return formatted;
  }

  // --- FUNGSI COPY CODE ---
  window.copyToClipboard = function(btnElement, codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;

    // Ambil isi kode murni, abaikan tag <span> dari Highlight.js
    const textToCopy = codeElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px; color: #10a37f;"></i> Disalin`;
      lucide.createIcons();
      
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        lucide.createIcons();
      }, 2000);
    }).catch(err => {
      console.error('Gagal menyalin:', err);
      alert('Gagal menyalin kode.');
    });
  };

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    if (emptyState) emptyState.style.display = 'none';

    appendMessage('user', query);
    conversationHistory.push({ role: 'user', content: query });

    userInput.value = '';
    userInput.style.height = 'auto';
    userInput.dispatchEvent(new Event('input'));
    
    sendBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i>`;
    lucide.createIcons();

    const assistantId = appendMessage('assistant', 'Menganalisis...');

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
      div.innerHTML = `<div class="msg-bubble">${formatMarkdown(text)}</div>`;
    } else {
      div.innerHTML = `
        <div class="msg-avatar">
          <i data-lucide="cpu" style="width: 20px; height: 20px; color: var(--text-main);"></i>
        </div>
        <div class="msg-bubble">${formatMarkdown(text)}</div>
      `;
    }
    
    chatBox.appendChild(div);
    lucide.createIcons();
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
  }

  // --- FUNGSI UPDATE TEXT DAN MEWARNAI KODE ---
  function updateMessageText(id, text) {
    const el = document.getElementById(id);
    if (el) {
      el.querySelector('.msg-bubble').innerHTML = formatMarkdown(text);
      lucide.createIcons();
      
      // TRIGGER HIGHLIGHT.JS UNTUK MEWARNAI KODE
      el.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }

  document.querySelector('.new-chat-btn').addEventListener('click', () => {
    window.location.reload();
  });
});
