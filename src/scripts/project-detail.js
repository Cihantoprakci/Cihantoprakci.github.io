import '../styles/main.css';

import { gsap, ScrollTrigger } from './core/gsap-config.js';
import { initLenis } from './core/lenis.js';
import { reducedMotion } from './core/reduced-motion.js';
import { initScrollProgress } from './ui/scroll-progress.js';
import { initNav } from './ui/nav.js';
import { revealOnScroll, splitText } from './animations/utils.js';

function boot() {
  initLenis();
  initScrollProgress();
  initNav();

  if (reducedMotion()) return;

  const ctx = gsap.context(() => {
    const heroTitle = document.querySelector('.project-hero__title');
    const heroIndex = document.querySelector('.project-hero__index');
    const heroTagline = document.querySelector('.project-hero__tagline');
    const heroMeta = document.querySelector('.project-hero__meta');

    const titleChars = heroTitle ? splitText(heroTitle, 'chars') : [];
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (heroIndex) tl.from(heroIndex, { y: 12, opacity: 0, duration: 0.5 }, 0);
    if (titleChars.length) {
      tl.from(titleChars, { yPercent: 110, opacity: 0, stagger: 0.02, duration: 0.8 }, 0.1);
    }
    if (heroTagline) tl.from(heroTagline, { y: 14, opacity: 0, duration: 0.6 }, '-=0.4');
    if (heroMeta)
      tl.from(heroMeta.children, { y: 12, opacity: 0, stagger: 0.06, duration: 0.5 }, '-=0.3');

    const cover = document.querySelector('.project-cover');
    if (cover) {
      gsap.fromTo(
        cover,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0)',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: cover, start: 'top 80%', once: true },
        }
      );
    }

    const sections = document.querySelectorAll('.project-section');
    sections.forEach((section) => {
      const heading = section.querySelector('h2');
      const paragraphs = section.querySelectorAll('p, ul:not([class])');
      const galleryItems = section.querySelectorAll('.project-gallery figure');

      if (heading) revealOnScroll([heading]);
      if (paragraphs.length) revealOnScroll(paragraphs, { stagger: 0.08 });
      if (galleryItems.length) {
        gsap.from(galleryItems, {
          y: 24,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: galleryItems[0], start: 'top 85%', once: true },
        });
      }
    });

    ScrollTrigger.refresh();
  });

  if (document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

if (document.readyState === 'complete') boot();
else window.addEventListener('load', boot);
