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

  // --- FUNGSI FORMAT MARKDOWN (Mengubah Teks Jadi Kotak Kode) ---
  function formatMarkdown(text) {
    // 1. Amankan tag HTML agar tidak error
    let formatted = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // 2. Deteksi Code Block (Kode panjang yang dibungkus ```)
    formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
      const language = lang ? lang : 'code';
      const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
      
      return `
        <div class="code-wrapper">
          <div class="code-header">
            <span class="code-lang">${language}</span>
            <button class="copy-btn" onclick="copyToClipboard(this, '${codeId}')">
              <i data-lucide="copy" style="width: 14px; height: 14px;"></i> Salin
            </button>
          </div>
          <pre><code id="${codeId}">${code}</code></pre>
        </div>
      `;
    });

    // 3. Deteksi Inline Code (Kode pendek pakai `)
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // 4. Deteksi Teks Tebal (Bold)
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    return formatted;
  }

  // --- FUNGSI COPY CODE (Untuk Tombol Salin) ---
  window.copyToClipboard = function(btnElement, codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;

    // Ambil isi kode murni tanpa tag HTML
    const textToCopy = codeElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
      // Ubah tombol jadi "Disalin" + ikon Check
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px; color: #10a37f;"></i> Disalin`;
      lucide.createIcons();
      
      // Kembalikan ke ikon semula setelah 2 detik
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        lucide.createIcons();
      }, 2000);
    }).catch(err => {
      console.error('Gagal menyalin:', err);
      alert('Gagal menyalin kode ke clipboard.');
    });
  };

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    if (emptyState) emptyState.style.display = 'none';

    // Cetak pesan user ke layar
    appendMessage('user', query);
    conversationHistory.push({ role: 'user', content: query });

    userInput.value = '';
    userInput.style.height = 'auto';
    userInput.dispatchEvent(new Event('input'));
    
    sendBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i>`;
    lucide.createIcons();

    // Siapkan balon chat balasan AI
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
      // User text dirender biasa
      div.innerHTML = `<div class="msg-bubble">${formatMarkdown(text)}</div>`;
    } else {
      // AI text dirender dengan kotak kode (jika ada)
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

  // Update text function untuk mendukung format HTML baru (kotak kode)
  function updateMessageText(id, text) {
    const el = document.getElementById(id);
    if (el) {
      el.querySelector('.msg-bubble').innerHTML = formatMarkdown(text);
      lucide.createIcons(); // Render ikon "copy" di dalam kode
    }
  }

  document.querySelector('.new-chat-btn').addEventListener('click', () => {
    window.location.reload();
  });
});
