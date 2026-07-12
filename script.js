document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const emptyState = document.getElementById('emptyState');
  
  // Element Baru V3.0
  const ellipsisBtn = document.getElementById('ellipsisBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const attachBtn = document.getElementById('attachBtn');
  const fileInput = document.getElementById('fileInput');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  const previewImg = document.getElementById('previewImg');
  const removeImgBtn = document.getElementById('removeImgBtn');
  const voiceBtn = document.getElementById('voiceBtn');

  let conversationHistory = [];
  let currentImageBase64 = null; // Menyimpan gambar sementara

  // --- 1. LOGIKA MENU ELLIPSIS ---
  ellipsisBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
    if(!ellipsisBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('show');
    }
  });

  // --- 2. LOGIKA UPLOAD & PREVIEW GAMBAR ---
  attachBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        currentImageBase64 = e.target.result;
        previewImg.src = currentImageBase64;
        imagePreviewContainer.style.display = 'block';
        sendBtn.disabled = false;
        sendBtn.classList.add('active');
      };
      reader.readAsDataURL(file);
    }
  });

  removeImgBtn.addEventListener('click', () => {
    currentImageBase64 = null;
    fileInput.value = '';
    imagePreviewContainer.style.display = 'none';
    if(userInput.value.trim().length === 0) {
      sendBtn.disabled = true;
      sendBtn.classList.remove('active');
    }
  });

  // --- 3. LOGIKA VOICE RECOGNITION (MIC) ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => voiceBtn.classList.add('recording');
    recognition.onend = () => voiceBtn.classList.remove('recording');
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value += (userInput.value ? ' ' : '') + transcript;
      userInput.dispatchEvent(new Event('input')); // Trigger auto-resize & send button
    };

    voiceBtn.addEventListener('click', () => {
      if(voiceBtn.classList.contains('recording')) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    voiceBtn.addEventListener('click', () => alert('Browser ini tidak mendukung fitur suara.'));
  }

  // --- 4. LOGIKA INPUT & FORMATTING AI ---
  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    if (this.value.trim().length > 0 || currentImageBase64) {
      sendBtn.disabled = false; sendBtn.classList.add('active');
    } else {
      sendBtn.disabled = true; sendBtn.classList.remove('active');
    }
  });

  window.setSuggestion = function(text) {
    userInput.value = text;
    userInput.dispatchEvent(new Event('input'));
    userInput.focus();
  };

  function formatMarkdown(text) {
    let formatted = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Render Gambar Generatif dari AI
    formatted = formatted.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="ai-generated-img">');
    
    // Render Kotak Kode
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

  window.copyToClipboard = function(btnElement, codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;
    navigator.clipboard.writeText(codeElement.innerText).then(() => {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px; color: #10a37f;"></i> Disalin`;
      lucide.createIcons();
      setTimeout(() => { btnElement.innerHTML = originalHTML; lucide.createIcons(); }, 2000);
    });
  };

  // --- 5. LOGIKA SUBMIT PESAN (TEXT + GAMBAR) ---
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query && !currentImageBase64) return;

    if (emptyState) emptyState.style.display = 'none';

    // Persiapkan konten pesan untuk API
    let messageContent;
    let uiUserHTML = '';

    if (currentImageBase64) {
      messageContent = [
        { type: "text", text: query || "Tolong analisis gambar ini." },
        { type: "image_url", image_url: { url: currentImageBase64 } }
      ];
      uiUserHTML = `<img src="${currentImageBase64}" class="msg-image"><br>${formatMarkdown(query)}`;
    } else {
      messageContent = query;
      uiUserHTML = formatMarkdown(query);
    }

    conversationHistory.push({ role: 'user', content: messageContent });
    
    // Render Pesan User di Layar
    appendUserMessage(uiUserHTML);

    // Reset Input
    userInput.value = '';
    userInput.style.height = 'auto';
    currentImageBase64 = null;
    fileInput.value = '';
    imagePreviewContainer.style.display = 'none';
    userInput.dispatchEvent(new Event('input'));
    
    sendBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i>`;
    lucide.createIcons();

    const assistantId = appendAIMessage('Menganalisis...');

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
        updateMessageText(assistantId, `Error: ${data.error || 'Kendala server.'}`);
      }
    } catch (err) {
      updateMessageText(assistantId, 'Gagal terhubung ke API.');
    } finally {
      sendBtn.innerHTML = `<i data-lucide="arrow-up"></i>`;
      lucide.createIcons();
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  function appendUserMessage(htmlContent) {
    const div = document.createElement('div');
    div.className = `message user`;
    div.innerHTML = `<div class="msg-bubble">${htmlContent}</div>`;
    chatBox.appendChild(div);
    lucide.createIcons();
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function appendAIMessage(text) {
    const id = 'msg-' + Date.now();
    const div = document.createElement('div');
    div.className = `message assistant`;
    div.id = id;
    div.innerHTML = `
      <div class="msg-avatar"><i data-lucide="cpu" style="width: 20px; height: 20px; color: var(--text-main);"></i></div>
      <div class="msg-bubble">${formatMarkdown(text)}</div>
    `;
    chatBox.appendChild(div);
    lucide.createIcons();
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
  }

  function updateMessageText(id, text) {
    const el = document.getElementById(id);
    if (el) {
      el.querySelector('.msg-bubble').innerHTML = formatMarkdown(text);
      lucide.createIcons();
      el.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
    }
  }

  document.querySelector('.new-chat-btn').addEventListener('click', () => window.location.reload());
});
