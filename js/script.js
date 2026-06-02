// DOM Cache Elements
const messagesContainer = document.getElementById('messagesContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const sidebar = document.getElementById('sidebar');
const newChatBtn = document.getElementById('newChatBtn');
const menuItems = document.querySelectorAll('.menu-list li');

let conversationHistory = [];
let currentSystemPrompt = "You are Riksan AI, a helpful, ultra-professional AI assistant.";

// Initial Configurations
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true
});

// Sync Theme Interface
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggleBtn.innerHTML = newTheme === 'dark' ? 
        `<i class="fa-solid fa-sun"></i> <span>Light Mode</span>` : 
        `<i class="fa-solid fa-moon"></i> <span>Dark Mode</span>`;
});

// Mobile Controls
menuToggleBtn.addEventListener('click', () => sidebar.classList.add('open'));
closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));

// Switch System Persona Capabilities
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentSystemPrompt = item.getAttribute('data-prompt');
        resetChat();
        if(window.innerWidth <= 768) sidebar.classList.remove('open');
    });
});

newChatBtn.addEventListener('click', resetChat);

function resetChat() {
    conversationHistory = [];
    messagesContainer.innerHTML = `
        <div class="welcome-screen" id="welcomeScreen">
            <h1>What can I help with today?</h1>
            <p>Experience precision intelligence engineered for professional workflows.</p>
        </div>
    `;
    userInput.value = '';
}

// Auto-grow Textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    // Remove welcome screen
    if(document.getElementById('welcomeScreen')) {
        document.getElementById('welcomeScreen').remove();
    }

    appendMessage('user', text);
    userInput.value = '';
    userInput.style.height = 'auto';

    // Build context
    if(conversationHistory.length === 0) {
        conversationHistory.push({ role: 'system', content: currentSystemPrompt });
    }
    conversationHistory.push({ role: 'user', content: text });

    // Typing state
    const loadingId = appendTypingIndicator();

    try {
        const data = await ApiService.sendMessage(conversationHistory);
        removeTypingIndicator(loadingId);

        const aiMessage = data.choices[0].message.content;
        appendMessage('assistant', aiMessage);
        conversationHistory.push({ role: 'assistant', content: aiMessage });
    } catch (error) {
        removeTypingIndicator(loadingId);
        appendMessage('assistant', `⚠️ **Error Communication:** ${error.message}. Silakan periksa Vercel logs.`);
    }
});

function appendMessage(sender, text) {
    const row = document.createElement('div');
    row.className = `message-row ${sender}-row`;
    
    let renderedContent = text;
    if(sender === 'assistant') {
        // Parse markdown for premium UI look
        renderedContent = marked.parse(text);
    } else {
        // Escape HTML tags to prevent XSS injection
        renderedContent = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    row.innerHTML = `
        <div class="message-content">
            <div class="avatar">${sender === 'user' ? 'U' : 'R'}</div>
            <div class="text-wrapper">${renderedContent}</div>
        </div>
    `;

    messagesContainer.appendChild(row);
    postProcessCodeBlocks(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function appendTypingIndicator() {
    const id = 'loading-' + Date.now();
    const row = document.createElement('div');
    row.className = `message-row ai-row`;
    row.id = id;
    row.innerHTML = `
        <div class="message-content">
            <div class="avatar">R</div>
            <div class="text-wrapper">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if(el) el.remove();
}

function postProcessCodeBlocks(container) {
    const preBlocks = container.querySelectorAll('pre');
    preBlocks.forEach(pre => {
        if (pre.querySelector('.code-header')) return;

        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
            <span><i class="fa-solid fa-code"></i> Code Block</span>
            <button class="copy-btn"><i class="fa-regular fa-copy"></i> Copy</button>
        `;

        pre.parentNode.insertBefore(header, pre);

        const copyBtn = header.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            const codeText = pre.querySelector('code').innerText;
            navigator.clipboard.writeText(codeText).then(() => {
                copyBtn.innerHTML = `<i class="fa-solid fa-check" style="color:#10b981"></i> Copied!`;
                setTimeout(() => {
                    copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`;
                }, 2000);
            });
        });
    });
}
