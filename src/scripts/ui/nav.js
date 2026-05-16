import { scrollTo } from '../core/lenis.js';

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  const links = document.querySelectorAll('[data-nav-link]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-list]')?.parentElement;
  const yearEl = document.querySelector('[data-current-year]');

  if (!nav) return;

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sections = Array.from(links)
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();

      if (link.closest('.nav__logo, .footer__logo')) {
        scrollTo(0);
        return;
      }
      scrollTo(target, { offset: -80 });
    });
  });

  function openMobileMenu() {
    toggle?.setAttribute('aria-expanded', 'true');
    toggle?.setAttribute('aria-label', 'Fermer le menu');
    menu?.classList.add('is-open');
    document.body.dataset.locked = 'true';
  }

  function closeMobileMenu() {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Ouvrir le menu');
    menu?.classList.remove('is-open');
    document.body.dataset.locked = 'false';
  }

  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMobileMenu();
    else openMobileMenu();
  });
}
