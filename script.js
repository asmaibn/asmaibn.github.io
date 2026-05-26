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

    const recipientEmail = 'you@example.com';

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