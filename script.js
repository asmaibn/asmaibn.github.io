const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const header = qs('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

const navToggle = qs('#navToggle');
const navLinks  = qs('.nav__links');

if (navToggle && navLinks) {

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  qsa('a', navLinks).forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

const autoFadeSelectors = [
  '.hero__eyebrow',
  '.hero__name',
  '.hero__tagline',
  '.hero__cta',
  '.about__photo',
  '.about__text',
  '.skill-card',
  '.project-card',
  '.contact__form',
  '.contact__socials',
];

autoFadeSelectors.forEach(sel => {
  qsa(sel).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${i * 0.08}s`;
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

qsa('.fade-in').forEach(el => observer.observe(el));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

qsa('.skill-card').forEach(card => skillObserver.observe(card));

const contactForm = qs('#contactForm');
const formFeedback = qs('#formFeedback');

if (contactForm) {

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = qs('#name', contactForm).value.trim();
    const email   = qs('#email', contactForm).value.trim();
    const message = qs('#message', contactForm).value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    const recipientEmail = 'asmacupcake8@gmail.com';

    const subject  = encodeURIComponent(`Portfolio message from ${name}`);
    const body     = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoURL = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    window.location.href = mailtoURL;

    showFeedback('Your email client should open now. Thank you!', 'success');
    contactForm.reset();
  });
}

function showFeedback(text, type) {
  if (!formFeedback) return;
  formFeedback.textContent = text;
  formFeedback.className   = `contact__feedback ${type}`;

  setTimeout(() => {
    formFeedback.textContent = '';
    formFeedback.className   = 'contact__feedback';
  }, 5000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const sections  = qsa('section[id]');
const navAnchors = qsa('.nav__links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--accent)'
          : '';
        a.style.borderBottomColor = a.getAttribute('href') === `#${id}`
          ? 'var(--accent)'
          : 'transparent';
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer   = window.matchMedia('(pointer: fine)').matches;

const heroName = qs('.hero__name');
if (heroName && !reducedMotion) {
  const text = heroName.textContent;
  heroName.setAttribute('aria-label', text);
  heroName.innerHTML = text
    .split('')
    .map((ch, i) => {
      const glyph = ch === ' ' ? '&nbsp;' : ch;
      return `<span class="letter" aria-hidden="true" style="animation-delay:${i * 0.035}s">${glyph}</span>`;
    })
    .join('');
}

if (!reducedMotion && finePointer) {

  const canvas = qs('#sparkleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let lastSpawn = 0;

  const sparkleColors = ['#ed4dff', '#9e3d9e', '#ffe8fc', '#ffd166'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function spawnSparkle(x, y) {
    particles.push({
      x,
      y,
      size: Math.random() * 5 + 3,
      speedX: (Math.random() - 0.5) * 1.4,
      speedY: (Math.random() - 0.5) * 1.4 - 0.3,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.1,
      life: 1,
      color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
    });
  }

  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastSpawn > 25) {
      spawnSparkle(e.clientX, e.clientY);
      lastSpawn = now;
    }
  });

  function drawSparkle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.lineTo(p.size * 0.25, -p.size * 0.25);
    ctx.lineTo(p.size, 0);
    ctx.lineTo(p.size * 0.25, p.size * 0.25);
    ctx.lineTo(0, p.size);
    ctx.lineTo(-p.size * 0.25, p.size * 0.25);
    ctx.lineTo(-p.size, 0);
    ctx.lineTo(-p.size * 0.25, -p.size * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.spin;
      p.life -= 0.018;
      drawSparkle(p);
    });
    particles = particles.filter((p) => p.life > 0);
    requestAnimationFrame(animateSparkles);
  }
  animateSparkles();
}

if (!reducedMotion && finePointer) {
  qsa('.hero__cta .btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

if (!reducedMotion && finePointer) {
  qsa('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
