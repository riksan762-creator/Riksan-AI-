// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi ikon Lucide awal
  lucide.createIcons();

  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');

  // Memory chat array untuk menjaga alur konteks logika tetap bersambung
  let conversationHistory = [];

  // Auto-resize kolom textarea input saat teks memanjang kebawah
  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    // Masukkan pesan pengguna ke UI dan memori
    appendMessage('user', query);
    conversationHistory.push({ role: 'user', content: query });
    
    // Reset kolom input
    userInput.value = '';
    userInput.style.height = 'auto';
    setLoading(true);

    // Buat wadah pesan gantung untuk respons Riksan AI
    const assistantMessageId = appendMessage('assistant', 'Riksan AI sedang menganalisis logika...');

    try {
      // Menembak Vercel Serverless Function lokal (/api/chat)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: conversationHistory })
      });

      const data = await response.json();

      if (response.ok) {
        const reply = data.choices[0].message.content;
        updateMessageText(assistantMessageId, reply);
        conversationHistory.push({ role: 'assistant', content: reply });
      } else {
        updateMessageText(assistantMessageId, `Error: ${data.error || 'Gagal memproses logika.'}`);
      }
    } catch (err) {
      updateMessageText(assistantMessageId, 'Gagal terhubung ke infrastruktur server.');
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
      <div class="avatar"><i data-lucide="${iconType}"></i></div>
      <div class="text">${escapeHtml(text)}</div>
    `;
    
    chatBox.appendChild(messageDiv);
    lucide.createIcons(); // Render ulang ikon baru yang baru ditambahkan
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
  }

  function updateMessageText(id, newText) {
    const msgEl = document.getElementById(id);
    if (msgEl) {
      msgEl.querySelector('.text').innerText = newText;
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
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Tombol aksi buat sesi percakapan baru (Clear Chat Workspace)
  document.querySelector('.new-chat-btn').addEventListener('click', () => {
    chatBox.innerHTML = `
      <div class="message assistant">
        <div class="avatar"><i data-lucide="cpu"></i></div>
        <div class="text">Workspace direset. Halo, saya Riksan AI. Ada arsitektur kode baru yang mau dipecahkan?</div>
      </div>
    `;
    conversationHistory = [];
    lucide.createIcons();
  });
});
