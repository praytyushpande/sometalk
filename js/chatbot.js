/* ═══════════════════════════════════════════════════════════════════════
   SomeTalk — Aria AI Chatbot Engine
   Empathetic response system with crisis detection
   ═══════════════════════════════════════════════════════════════════════ */

/* ─── Crisis keywords ────────────────────────────────────────────────── */
const CRISIS_KEYWORDS = [
  'kill myself', 'suicide', 'suicidal', 'end my life', 'want to die',
  'don\'t want to live', 'not worth living', 'self harm', 'self-harm',
  'hurt myself', 'hurting myself', 'cutting myself', 'overdose',
  'no reason to live', 'everyone would be better off without me',
  'can\'t go on', 'can\'t take it anymore', 'goodbye forever',
];

/* ─── Empathy Response Matrix ────────────────────────────────────────── */
const RESPONSE_GROUPS = {
  greeting: {
    triggers: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy', 'namaste'],
    responses: [
      "Hi there. 🌿 I'm Aria, and I'm really glad you're here. This is a safe space — no judgment, no rush. How are you feeling right now?",
      "Hello. I'm so happy you reached out. 💙 Whatever you're carrying today, you don't have to face it alone. What's on your mind?",
      "Hey. I'm Aria. I'm here to listen — fully and without judgment. How are you doing today, really?",
    ],
  },

  anxiety: {
    triggers: ['anxious', 'anxiety', 'panic', 'panic attack', 'racing heart', 'heart racing', 'scared', 'fear', 'terrified', 'worried', 'overthinking', 'spiraling', 'can\'t breathe'],
    responses: [
      "Anxiety can feel like your body forgot that it's safe. 💙 First — can I ask, is this anxiety showing up as physical sensations (racing heart, tight chest), or more like racing thoughts you can't quiet?",
      "I hear you. That anxious feeling is so overwhelming — it's like your nervous system is sounding an alarm even when there's no immediate threat. You're not broken for feeling this. What's it been like for you lately?",
      "Anxiety is exhausting. The way it hijacks your body and mind, even when you know logically that you're okay — it's really hard. 🌿 Can I try a quick grounding exercise with you, or would you rather just talk first?",
    ],
  },

  breathing: {
    triggers: ['breathing exercise', 'breathe', 'calm down', 'help me breathe', 'breathe with me', 'grounding'],
    responses: [
      "Let's do a 4-7-8 breath together. 🌿\n\n**Inhale** slowly through your nose for **4 counts**.\n\nNow **hold** for **7 counts**.\n\nNow **exhale** slowly through your mouth for **8 counts**.\n\nLet's do that 3 times. Take your time — I'll be right here. How did that feel?",
      "Let's try box breathing. 🌬️\n\n**Breathe in** for 4 counts.\n**Hold** for 4 counts.\n**Breathe out** for 4 counts.\n**Hold** for 4 counts.\n\nRepeat this 4 times. Your nervous system knows how to settle — we just have to remind it. Tell me when you're ready to continue.",
    ],
  },

  sad: {
    triggers: ['sad', 'sadness', 'depressed', 'depression', 'crying', 'cry', 'numb', 'empty', 'hopeless', 'dark', 'low', 'miserable', 'grief', 'grieving', 'loss', 'lost'],
    responses: [
      "I'm so sorry you're feeling this way. 💙 Sadness — especially the deep, heavy kind — can make everything feel colorless. You don't have to explain or justify it. I just want to ask: has this been going on for a while, or did something specific happen?",
      "That numbness you're describing is real. Sometimes when we've been sad for too long, our feelings go quiet — not because they're gone, but because we've been carrying too much for too long. You don't have to be okay right now. Can you tell me more?",
      "Feeling depressed is so much more than being sad — it's like the color drains from everything. 🌿 I want to understand what you're going through. When did you start feeling this way, and is there anyone around you who knows?",
    ],
  },

  lonely: {
    triggers: ['lonely', 'alone', 'isolated', 'nobody understands', 'no one cares', 'invisible', 'disconnected', 'no friends', 'no one to talk to'],
    responses: [
      "That feeling of being surrounded by people yet utterly alone — it's one of the most painful human experiences there is. 💙 The fact that it's hard to put into words doesn't make it less real. I'm here, and I'm listening. What does this loneliness feel like for you?",
      "You reached out here, and that took courage. You may feel invisible to the people around you, but you are not invisible to me right now. 🌿 Can you tell me a bit about what's going on in your life?",
    ],
  },

  overwhelmed: {
    triggers: ['overwhelmed', 'too much', 'can\'t cope', 'falling apart', 'breaking down', 'exhausted', 'burnout', 'burnt out', 'can\'t do this', 'giving up', 'stressed', 'stress', 'pressure'],
    responses: [
      "When everything piles up at once, the brain goes into overload — it literally can't prioritize. 🌊 That feeling of 'I can't do this' isn't weakness. It's your mind saying it needs help.\n\nLet's take one thing at a time. First: what's the heaviest thing on your plate right now?",
      "Burnout and overwhelm are serious. Your body and mind have limits, and it sounds like you've been pushing past them for a while. 💙 You don't have to solve everything tonight. Can you tell me what's been taking the most from you?",
    ],
  },

  sleep: {
    triggers: ['can\'t sleep', 'insomnia', 'awake', '3am', 'nightmares', 'sleep', 'tired', 'exhausted', 'no energy'],
    responses: [
      "Not being able to sleep is both a symptom and a cause — it makes everything harder to cope with. 😔 The 3am mind is a particularly cruel version of it. What happens when you can't sleep — does your mind race, or is it more of a restless body feeling?",
      "Sleep deprivation is one of the fastest ways to feel like you're falling apart. Your mind and body desperately need that recovery time. 🌙 How long has this been going on, and do you have any sense of what's keeping you awake?",
    ],
  },

  work_study: {
    triggers: ['work', 'job', 'study', 'exam', 'college', 'university', 'boss', 'career', 'fail', 'failing', 'grades', 'school', 'deadline', 'assignment'],
    responses: [
      "The pressure of work and study can feel relentless — especially when it's tied to your sense of worth or your future. 💙 I want to understand what's happening. What's making things particularly hard right now?",
      "Academic and work pressure are real stressors, not things to just 'push through.' A lot of people are struggling with this silently. 🌿 Can you tell me more about what you're dealing with? I want to help you think through it.",
    ],
  },

  family: {
    triggers: ['family', 'parents', 'mom', 'dad', 'mother', 'father', 'sibling', 'brother', 'sister', 'relationship', 'breakup', 'divorce', 'partner', 'boyfriend', 'girlfriend'],
    responses: [
      "Family and relationship pain cuts deep — these are the people who are supposed to be our safe harbor. When that breaks down, it's uniquely hard. 💙 What's going on at home?",
      "Relationship struggles — whether with family, partners, or friends — can shake your whole foundation. You don't have to carry this alone. 🌿 Can you tell me what's been happening?",
    ],
  },

  anger: {
    triggers: ['angry', 'anger', 'rage', 'furious', 'frustrated', 'frustration', 'hate', 'resentment'],
    responses: [
      "Anger is often a protective emotion — it covers something more vulnerable underneath, like hurt or fear. 🌿 It's completely valid to feel angry. What's been making you feel this way?",
      "That frustrated, angry feeling is exhausting in its own way. Sometimes anger is our mind's way of saying a boundary has been crossed, or something deeply unfair is happening. Can you tell me more about what's going on?",
    ],
  },

  therapy: {
    triggers: ['therapy', 'therapist', 'counselor', 'counselling', 'therapy session', 'psychiatrist', 'psychologist', 'medication', 'antidepressant'],
    responses: [
      "Reaching out for professional support is one of the most courageous things you can do. 💙 Are you currently seeing someone, or are you thinking about starting? I can share some resources that might help.",
      "Therapy can be genuinely life-changing — and it's not about being 'severely' ill. Anyone can benefit from a space to process their thoughts with a professional. 🌿 \n\nFor affordable options in India:\n**iCall**: 9152987821 (sliding scale fees)\n**Vandrevala Foundation**: 1860-2662-345 (free)\n\nWould you like to talk through what's been holding you back from reaching out?",
    ],
  },

  gratitude: {
    triggers: ['thank you', 'thanks', 'that helped', 'feeling better', 'grateful', 'appreciate'],
    responses: [
      "I'm really glad I could be here for you. 🌿 Remember — what you're going through is real, and you deserve support. If you ever need to talk again, I'm always here.",
      "💙 It means a lot that you reached out. You showed real strength today. Please be gentle with yourself — healing isn't linear, and you're doing better than you think.",
    ],
  },

  affirmation: {
    triggers: ['am i crazy', 'something wrong with me', 'normal', 'am i normal', 'weak', 'failure', 'worthless', 'stupid', 'pathetic', 'burden'],
    responses: [
      "You are not crazy. 💙 You are a human being navigating pain, and pain changes how we experience the world. There is absolutely nothing 'wrong' with you — you're struggling, and struggling is not the same as being broken.",
      "You are not weak. 🌿 It takes tremendous strength to keep going when you're hurting this much. The people who seem 'fine' are often the ones carrying the most. You reaching out today? That's brave.",
      "You are not a burden. I want to say that clearly. 💙 The people who love you would want to know you're hurting. And even if it doesn't feel that way — you matter. Your life has value, exactly as it is right now.",
    ],
  },

  fallback: {
    triggers: [],
    responses: [
      "Thank you for sharing that with me. 💙 I want to make sure I really understand what you're going through. Can you tell me a little more about how you're feeling?",
      "I hear you. 🌿 What you're feeling is real and it matters. Would you like to talk more about it, or would a breathing exercise or grounding technique help right now?",
      "It sounds like you're carrying something heavy. I'm here with you. 💙 Can you help me understand — is this more of an emotional feeling (like sadness or anxiety), or is it more of a situational stress (something happening in your life)?",
      "You've come to the right place. 🌿 I'm listening, and I'm not going anywhere. Take all the time you need — what's going on?",
    ],
  },
};

/* ─── Aria response logic ────────────────────────────────────────────── */
let ariaResponseIndex = {};
let chatHistory = [];
let isTyping = false;

function isCrisis(input) {
  const lower = input.toLowerCase();
  return CRISIS_KEYWORDS.some(k => lower.includes(k));
}

function getAriaResponse(input) {
  const lower = input.toLowerCase();

  // Check crisis first
  if (isCrisis(lower)) return null; // null signals crisis

  // Match response group
  for (const [group, data] of Object.entries(RESPONSE_GROUPS)) {
    if (group === 'fallback') continue;
    if (data.triggers.some(t => lower.includes(t))) {
      ariaResponseIndex[group] = ariaResponseIndex[group] || 0;
      const resp = data.responses[ariaResponseIndex[group] % data.responses.length];
      ariaResponseIndex[group]++;
      return resp;
    }
  }

  // Fallback
  const group = 'fallback';
  ariaResponseIndex[group] = ariaResponseIndex[group] || 0;
  const resp = RESPONSE_GROUPS.fallback.responses[ariaResponseIndex[group] % RESPONSE_GROUPS.fallback.responses.length];
  ariaResponseIndex[group]++;
  return resp;
}

/* ─── Chat UI ────────────────────────────────────────────────────────── */
const ARIA_WELCOME = "Hi, I'm Aria. 🌿\n\nI'm your safe space to talk — about anxiety, sadness, stress, relationships, or anything that's weighing on you. I'm here to listen without judgment.\n\nHow are you feeling right now?";

function initChat() {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;

  chatHistory = [];
  msgContainer.innerHTML = '';
  appendAriaMessage(ARIA_WELCOME, true);
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
    appendAriaMessage("I'm still right here with you. 💙 Please know that what you're feeling isn't permanent — even though it might feel that way. Will you tell me a little about what's been happening?");
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
  // Bold **text**
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
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
function sendMessage() {
  if (isTyping) return;
  const input = document.getElementById('chat-input');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  appendUserMessage(text);
  chatHistory.push({ role: 'user', text });

  isTyping = true;
  showTypingIndicator();

  // Delay for realism
  const delay = 1200 + Math.random() * 1200;

  setTimeout(() => {
    removeTypingIndicator();
    isTyping = false;

    const response = getAriaResponse(text);
    if (response === null) {
      // Crisis detected
      appendCrisisCard();
    } else {
      appendAriaMessage(response);
      chatHistory.push({ role: 'aria', text: response });
    }
  }, delay);
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
  ariaResponseIndex = {};
  appendAriaMessage(ARIA_WELCOME);
}
