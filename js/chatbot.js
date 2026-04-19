/* ═══════════════════════════════════════════════════════════════════════
   SomeTalk — Aria AI Chatbot Engine
   Real AI integration powered by Gemini via Vercel Functions
   ═══════════════════════════════════════════════════════════════════════ */

/* ─── Crisis keywords (Client-side fast check) ─────────────────────── */
const CRISIS_KEYWORDS = [
  'kill myself', 'suicide', 'suicidal', 'end my life', 'want to die',
  'don\'t want to live', 'not worth living', 'self harm', 'self-harm',
  'hurt myself', 'hurting myself', 'cutting myself', 'overdose',
  'no reason to live', 'everyone would be better off without me',
  'can\'t go on', 'can\'t take it anymore', 'goodbye forever',
];

/* ─── Aria response logic ────────────────────────────────────────────── */
let chatHistory = [];
let isTyping = false;

function isCrisis(input) {
  const lower = input.toLowerCase();
  return CRISIS_KEYWORDS.some(k => lower.includes(k));
}

// Fetch response from Vercel Serverless Function
async function fetchAriaResponse() {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: chatHistory })
    });
    
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error("AI Fetch Error:", err);
    return "I'm having a little trouble connecting to my thoughts right now. Could you please try sending that again? 💙";
  }
}

/* ─── Chat UI ────────────────────────────────────────────────────────── */
const ARIA_WELCOME = "Hi, I'm Aria. 🌿\n\nI'm your safe space to talk — about anxiety, sadness, stress, relationships, or anything that's weighing on you. I'm here to listen without judgment.\n\nHow are you feeling right now?";

function initChat() {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;

  chatHistory = [];
  msgContainer.innerHTML = '';
  appendAriaMessage(ARIA_WELCOME, true);
  // Store Aria's opening context so she remembers her first message
  chatHistory.push({ role: 'aria', content: ARIA_WELCOME });
}

function appendAriaMessage(text, instant = false) {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'message aria-msg';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = '✨';

  const inner = document.createElement('div');

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = formatMessage(text);

  const time = document.createElement('div');
  time.className = 'msg-time';
  time.textContent = getCurrentTime();

  inner.appendChild(bubble);
  inner.appendChild(time);
  wrapper.appendChild(avatar);
  wrapper.appendChild(inner);
  msgContainer.appendChild(wrapper);
  scrollToBottom();
}

function appendUserMessage(text) {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'message user-msg';

  const inner = document.createElement('div');

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;

  const time = document.createElement('div');
  time.className = 'msg-time';
  time.style.textAlign = 'right';
  time.textContent = getCurrentTime();

  inner.appendChild(bubble);
  inner.appendChild(time);

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = '🫂';

  wrapper.appendChild(inner);
  wrapper.appendChild(avatar);
  msgContainer.appendChild(wrapper);
  scrollToBottom();
}

function appendCrisisCard() {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;

  const card = document.createElement('div');
  card.className = 'crisis-msg-card';
  card.innerHTML = `
    <h4>🆘 You're not alone — help is here</h4>
    <p>What you're feeling is real, and your life has immense value. Please reach out to a crisis counselor right now — they will listen without judgment.</p>
    <p style="margin-top:8px"><strong>iCall:</strong> 9152987821 &nbsp;·&nbsp; <strong>Vandrevala:</strong> 1860-2662-345 &nbsp;·&nbsp; <strong>Emergency:</strong> 112</p>
    <button onclick="showCrisisModal()" style="margin-top:10px">Get Immediate Help →</button>
  `;
  msgContainer.appendChild(card);
  scrollToBottom();

  // Also follow up from Aria
  setTimeout(() => {
    const followup = "I'm still right here with you. 💙 Please know that what you're feeling isn't permanent — even though it might feel that way. Will you tell me a little about what's been happening?";
    appendAriaMessage(followup);
    chatHistory.push({ role: 'aria', content: followup });
  }, 1500);
}

function showTypingIndicator() {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;

  const existing = document.getElementById('typing-indicator');
  if (existing) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'typing-indicator';
  wrapper.id = 'typing-indicator';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = '✨';

  const dots = document.createElement('div');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';

  wrapper.appendChild(avatar);
  wrapper.appendChild(dots);
  msgContainer.appendChild(wrapper);
  scrollToBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function formatMessage(text) {
  // Convert standard markdown bolding
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function scrollToBottom() {
  const msgContainer = document.getElementById('chat-messages');
  if (msgContainer) {
    setTimeout(() => {
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 50);
  }
}

function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ─── Sending messages ───────────────────────────────────────────────── */
async function sendMessage() {
  if (isTyping) return;
  const input = document.getElementById('chat-input');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  appendUserMessage(text);
  chatHistory.push({ role: 'user', content: text });

  isTyping = true;
  showTypingIndicator();

  // Intercept crisis keywords locally immediately so we don't rely purely on AI
  if (isCrisis(text)) {
    removeTypingIndicator();
    isTyping = false;
    appendCrisisCard();
    return;
  }

  // Fetch the real AI response
  const responseText = await fetchAriaResponse();
  
  removeTypingIndicator();
  isTyping = false;
  
  appendAriaMessage(responseText);
  chatHistory.push({ role: 'aria', content: responseText });
}

function sendStarter(btn) {
  const text = btn.textContent;
  const input = document.getElementById('chat-input');
  if (input) input.value = text;
  sendMessage();
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function clearChat() {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;
  msgContainer.innerHTML = '';
  chatHistory = [];
  initChat();
}
