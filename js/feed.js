/* ═══════════════════════════════════════════════════════════════════════
   SomeTalk — Community Feed Logic
   ═══════════════════════════════════════════════════════════════════════ */

const AVATAR_COLORS = [
  'linear-gradient(135deg,#7C3AED,#A78BFA)',
  'linear-gradient(135deg,#059669,#6EE7B7)',
  'linear-gradient(135deg,#3B82F6,#93C5FD)',
  'linear-gradient(135deg,#D97706,#FCD34D)',
  'linear-gradient(135deg,#DB2777,#F9A8D4)',
  'linear-gradient(135deg,#0891B2,#67E8F9)',
];

const AVATAR_EMOJIS = ['🌙','🌿','💙','⭐','🌸','🍃','🌊','✨','🦋','🌷'];

const ANON_NAMES = [
  'Gentle Soul', 'Quiet Moon', 'Wandering Star', 'Soft Rain', 'Still Water',
  'Morning Mist', 'Autumn Leaf', 'Calm Breeze', 'Hidden Sun', 'Night Bloom',
  'Healing Wave', 'Whispered Hope', 'Lost Lantern', 'Tender Heart', 'Cloudy Sky',
];

const SEED_POSTS = [
  {
    id: 'p1',
    mood: 'anxious',
    content: "I've been waking up at 3am every night for the past week with my heart racing. I don't even know what I'm anxious about — it's just there, like a weight on my chest. Does anyone else experience this? It's exhausting pretending to be fine during the day.",
    time: '2 hours ago',
    reactions: { love: 14, relate: 23, here: 9 },
    userReacted: {},
    avatarColor: AVATAR_COLORS[0],
    avatarEmoji: '🌙',
    anonName: 'Quiet Moon',
    isNew: false,
  },
  {
    id: 'p2',
    mood: 'hopeful',
    content: "Six months ago I couldn't get out of bed. Today I went for a 20-minute walk and it felt like climbing Everest — but I did it. Recovery isn't linear but today was a good day. If you're in the dark place right now, I promise it can change. It really can.",
    time: '4 hours ago',
    reactions: { love: 47, relate: 31, here: 18 },
    userReacted: {},
    avatarColor: AVATAR_COLORS[1],
    avatarEmoji: '🌿',
    anonName: 'Healing Wave',
    isNew: false,
  },
  {
    id: 'p3',
    mood: 'lonely',
    content: "I'm surrounded by people but I feel completely invisible. At work, at home — like I could disappear and the world would just keep spinning. I'm not suicidal, just... so, so lonely in a way I can't explain to anyone around me.",
    time: '5 hours ago',
    reactions: { love: 28, relate: 41, here: 22 },
    userReacted: {},
    avatarColor: AVATAR_COLORS[2],
    avatarEmoji: '💙',
    anonName: 'Still Water',
    isNew: false,
  },
  {
    id: 'p4',
    mood: 'overwhelmed',
    content: "Finals, a part-time job, and trying to hold my family together financially — I'm 21 and I feel like I'm 50. Everyone tells me I'm strong but I'm so tired of being strong. I just want someone to take care of me for once.",
    time: '7 hours ago',
    reactions: { love: 19, relate: 55, here: 13 },
    userReacted: {},
    avatarColor: AVATAR_COLORS[3],
    avatarEmoji: '🌸',
    anonName: 'Autumn Leaf',
    isNew: false,
  },
  {
    id: 'p5',
    mood: 'recovering',
    content: "Started therapy last month after years of telling myself I couldn't afford it (emotionally or financially). Found iCall — they do it on a sliding scale. Just wanted to share in case anyone else has been putting it off. Asking for help wasn't weakness. It took everything I had.",
    time: '9 hours ago',
    reactions: { love: 34, relate: 28, here: 41 },
    userReacted: {},
    avatarColor: AVATAR_COLORS[4],
    avatarEmoji: '⭐',
    anonName: 'Morning Mist',
    isNew: false,
  },
  {
    id: 'p6',
    mood: 'sad',
    content: "My dad passed away three weeks ago and I keep waiting to feel something. Everyone around me is crying and I'm just... numb. Is something wrong with me? I loved him so much. I don't understand why I can't cry.",
    time: '11 hours ago',
    reactions: { love: 52, relate: 17, here: 38 },
    userReacted: {},
    avatarColor: AVATAR_COLORS[5],
    avatarEmoji: '🍃',
    anonName: 'Soft Rain',
    isNew: false,
  },
];

let posts = [...SEED_POSTS];
let currentFilter = 'all';
let selectedMood = '';
let currentPostModalOpen = false;

/* ─── Render Posts ───────────────────────────────────────────────────── */
function renderPosts(filter = 'all') {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;
  const filtered = filter === 'all' ? posts : posts.filter(p => p.mood === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="text-align:center;padding:60px 24px;color:var(--text-400)">
        <div style="font-size:2.5rem;margin-bottom:12px">🌿</div>
        <p style="font-size:1rem;font-weight:600;color:var(--text-300);margin-bottom:8px">No stories yet for this mood</p>
        <p style="font-size:0.85rem">Be the first to share. You're not alone.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((p, i) => buildPostCard(p, i)).join('');
}

function buildPostCard(post, index) {
  const moodConfig = {
    anxious: { label: '😰 Anxious', class: 'mood-anxious' },
    sad: { label: '😔 Sad', class: 'mood-sad' },
    hopeful: { label: '🌱 Hopeful', class: 'mood-hopeful' },
    overwhelmed: { label: '🌊 Overwhelmed', class: 'mood-overwhelmed' },
    recovering: { label: '✨ Recovering', class: 'mood-recovering' },
    lonely: { label: '🌙 Lonely', class: 'mood-lonely' },
  };
  const mc = moodConfig[post.mood] || { label: post.mood, class: '' };

  return `
    <div class="post-card" id="post-${post.id}" style="animation-delay:${index * 0.06}s">
      ${post.isNew ? '<div class="post-new-badge">New</div>' : ''}
      <div class="post-card-header">
        <div class="post-avatar" style="background:${post.avatarColor}">${post.avatarEmoji}</div>
        <div class="post-meta">
          <div class="post-anon-name">${post.anonName}</div>
          <div class="post-time">${post.time}</div>
        </div>
        <div class="post-mood-badge ${mc.class}">${mc.label}</div>
      </div>
      <div class="post-content">${escapeHtml(post.content)}</div>
      <div class="post-reactions">
        <button
          class="reaction-btn ${post.userReacted.love ? 'reacted' : ''}"
          id="react-love-${post.id}"
          onclick="react('${post.id}','love')"
        >🌿 Sending love <span id="love-count-${post.id}">${post.reactions.love}</span></button>
        <button
          class="reaction-btn ${post.userReacted.relate ? 'reacted' : ''}"
          id="react-relate-${post.id}"
          onclick="react('${post.id}','relate')"
        >💙 I feel this <span id="relate-count-${post.id}">${post.reactions.relate}</span></button>
        <button
          class="reaction-btn ${post.userReacted.here ? 'reacted' : ''}"
          id="react-here-${post.id}"
          onclick="react('${post.id}','here')"
        >🤝 You're not alone <span id="here-count-${post.id}">${post.reactions.here}</span></button>
      </div>
    </div>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─── Filter ─────────────────────────────────────────────────────────── */
function filterPosts(mood, btn) {
  currentFilter = mood;
  document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    const targetId = mood === 'all' ? 'filter-all' : 'filter-' + mood;
    const targetBtn = document.getElementById(targetId);
    if (targetBtn) targetBtn.classList.add('active');
  }
  renderPosts(mood);
}

/* ─── React ──────────────────────────────────────────────────────────── */
function react(postId, type) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (post.userReacted[type]) {
    post.reactions[type]--;
    post.userReacted[type] = false;
  } else {
    post.reactions[type]++;
    post.userReacted[type] = true;
  }

  const countEl = document.getElementById(`${type}-count-${postId}`);
  const btnEl = document.getElementById(`react-${type}-${postId}`);
  if (countEl) countEl.textContent = post.reactions[type];
  if (btnEl) btnEl.classList.toggle('reacted', post.userReacted[type]);

  if (post.userReacted[type]) {
    showToast('💙 Reaction sent — your empathy matters');
  }
}

/* ─── Post Modal ─────────────────────────────────────────────────────── */
function openPostModal() {
  const modal = document.getElementById('post-modal');
  if (!modal) return;
  modal.classList.add('open');
  currentPostModalOpen = true;
  document.getElementById('post-content').focus();
}

function closePostModal() {
  const modal = document.getElementById('post-modal');
  if (!modal) return;
  modal.classList.remove('open');
  currentPostModalOpen = false;
  document.getElementById('post-content').value = '';
  document.getElementById('char-count').textContent = '0';
  selectedMood = '';
  document.querySelectorAll('.mood-select-btn').forEach(b => b.classList.remove('selected'));
}

function closePostModalOutside(e) {
  if (e.target.id === 'post-modal') closePostModal();
}

function selectMood(mood, btn) {
  selectedMood = mood;
  document.querySelectorAll('.mood-select-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function submitPost() {
  const content = document.getElementById('post-content').value.trim();
  if (!content) { showToast('✏️ Please write something first'); return; }
  if (!selectedMood) { showToast('💭 Select how you\'re feeling'); return; }
  if (content.length < 20) { showToast('📝 Share a little more — at least 20 characters'); return; }

  // Build new post
  const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  const randomEmoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
  const randomName = ANON_NAMES[Math.floor(Math.random() * ANON_NAMES.length)];

  const newPost = {
    id: 'p' + Date.now(),
    mood: selectedMood,
    content,
    time: 'Just now',
    reactions: { love: 0, relate: 0, here: 0 },
    userReacted: {},
    avatarColor: randomColor,
    avatarEmoji: randomEmoji,
    anonName: randomName,
    isNew: true,
  };

  posts.unshift(newPost);
  closePostModal();
  filterPosts(currentFilter, null);
  showToast('🌿 Your story has been shared anonymously');

  // Scroll to top of grid
  setTimeout(() => {
    const grid = document.getElementById('posts-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

/* ─── Char counter ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const ta = document.getElementById('post-content');
  const cc = document.getElementById('char-count');
  if (ta && cc) {
    ta.addEventListener('input', () => {
      cc.textContent = ta.value.length;
      cc.style.color = ta.value.length > 550 ? 'var(--coral-400)' : 'var(--text-400)';
    });
  }
});
