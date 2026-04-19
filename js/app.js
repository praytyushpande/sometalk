/* ═══════════════════════════════════════════════════════════════════════
   SomeTalk — App Router + Initialization
   ═══════════════════════════════════════════════════════════════════════ */

/* ─── Section Router ─────────────────────────────────────────────────── */
let currentSection = 'home';
let chatInitialized = false;

function showSection(name) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
  });

  // Show target
  const target = document.getElementById('section-' + name);
  if (!target) return;
  target.classList.add('active');
  currentSection = name;

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.remove('active-nav');
  });
  const navLink = document.getElementById('nav-' + name);
  if (navLink) navLink.classList.add('active-nav');

  // Section-specific init
  if (name === 'feed') {
    renderPosts(currentFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (name === 'therapists') {
    if (typeof initTherapists === 'function') initTherapists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (name === 'chat') {
    if (!chatInitialized) {
      initChat();
      chatInitialized = true;
    }
    // Focus input
    setTimeout(() => {
      const inp = document.getElementById('chat-input');
      if (inp) inp.focus();
    }, 300);
  }

  if (name === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Close mobile menu
  const navLinks = document.getElementById('nav-links');
  if (navLinks) navLinks.classList.remove('open');
}

/* ─── Mobile Menu ────────────────────────────────────────────────────── */
function toggleMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  if (navLinks) navLinks.classList.toggle('open');
}

/* ─── Crisis Modal ───────────────────────────────────────────────────── */
function showCrisisModal() {
  const modal = document.getElementById('crisis-modal');
  if (modal) modal.classList.add('open');
}

function closeCrisisModal() {
  const modal = document.getElementById('crisis-modal');
  if (modal) modal.classList.remove('open');
}

function closeCrisisModalOutside(e) {
  if (e.target.id === 'crisis-modal') closeCrisisModal();
}

/* ─── Toast ──────────────────────────────────────────────────────────── */
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toastTimeout);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ─── Navbar scroll effect ───────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── Keyboard: Escape closes modals ────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePostModal();
    closeCrisisModal();
    const navLinks = document.getElementById('nav-links');
    if (navLinks) navLinks.classList.remove('open');
  }
});

/* ─── Scroll animation observer ─────────────────────────────────────── */
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const animatables = document.querySelectorAll('.feature-card, .testimonial-card');
  animatables.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
    observer.observe(el);
  });
}

/* ─── Init ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Show home section
  showSection('home');

  // Setup animations
  setupScrollAnimations();
});



/* ─── Prevent accidental navigation ─────────────────────────────────── */
document.querySelectorAll('a[href="#"]').forEach(a => {
  a.addEventListener('click', e => e.preventDefault());
});
