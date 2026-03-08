/* =============================================
   LONGLANDS PARK — MAIN JS
   ============================================= */

// ─── Activate animation layer immediately ────
document.body.classList.add('js-loaded');

// ─── Nav scroll behaviour ───────────────────
const nav = document.getElementById('mainNav');

function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ─── Mobile hamburger ────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}

function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hamburger) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
}

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) closeMobileMenu();
});

// ─── Scroll reveals ──────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = (i % 4) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

// ─── Feature cards observer ──────────────────
const featureCards = document.querySelectorAll('.feature-card');
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
featureCards.forEach(el => cardObserver.observe(el));

// ─── Team cards observer ─────────────────────
const teamCards = document.querySelectorAll('.team-card');
const teamObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        teamObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
teamCards.forEach(el => teamObserver.observe(el));

// ─── Contact cards observer ──────────────────
const contactCards = document.querySelectorAll('.contact__card');
const contactObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        contactObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
contactCards.forEach(el => contactObserver.observe(el));

// ─── Location map observer ───────────────────
const locMaps = document.querySelectorAll('.location__map-wrap');
const locObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        locObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
locMaps.forEach(el => locObserver.observe(el));

// ─── Active nav link highlight ───────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));

// ─── Stat counter ────────────────────────────
function animateCounter(el, end, suffix = '') {
  const duration = 1800;
  const start    = performance.now();
  const isFloat  = String(end).includes('.');

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = (isFloat ? (eased * end).toFixed(1) : Math.round(eased * end)) + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.classList.add('counted');
      setTimeout(() => el.classList.remove('counted'), 400);
    }
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statEls = entry.target.querySelectorAll('.hero__stat-value');
        const data    = [
          { end: 100, suffix: '' },
          { end: 600, suffix: '+' },
          { end: 92,  suffix: '' },
          { end: 24,  suffix: 'km' },
        ];
        statEls.forEach((el, i) => {
          if (data[i]) animateCounter(el, data[i].end, data[i].suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── Smooth scroll ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ─── Lightbox ────────────────────────────────
function openLightbox(src, caption) {
  const lb    = document.getElementById('lightbox');
  const img   = document.getElementById('lightboxImg');
  const capEl = document.getElementById('lightboxCaption');
  img.src = src; img.alt = caption;
  capEl.textContent = caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ─── Contact form (if present) ───────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = '✓ Enquiry Sent';
    btn.style.background = 'var(--green-mid)';
    btn.style.color = 'var(--gold-light)';
    btn.style.opacity = '1';
  }, 1500);
}