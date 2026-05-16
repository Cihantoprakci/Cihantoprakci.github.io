import '../styles/main.css';

import { gsap, ScrollTrigger } from './core/gsap-config.js';
import { initLenis } from './core/lenis.js';
import { reducedMotion } from './core/reduced-motion.js';

import { initScrollProgress } from './ui/scroll-progress.js';
import { initNav } from './ui/nav.js';

import { initContactForm } from './features/contact-form.js';

import { animateHero } from './animations/hero.anim.js';
import { animateAbout } from './animations/about.anim.js';
import { animateProjects } from './animations/projects.anim.js';
import { animateSkills } from './animations/skills.anim.js';
import { animateContact } from './animations/contact.anim.js';
import { animateFooter } from './animations/footer.anim.js';

function boot() {
  initLenis();

  initScrollProgress();
  initNav();

  initContactForm();

  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
      isMobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
      reduced: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const conditions = ctx.conditions;

      const cleanups = [
        animateHero(conditions),
        animateAbout(conditions),
        animateProjects(conditions),
        animateSkills(conditions),
        animateContact(conditions),
        animateFooter(conditions),
      ];

      ScrollTrigger.refresh();

      return () => {
        cleanups.forEach((fn) => typeof fn === 'function' && fn());
      };
    }
  );

  if (document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  boot();
} else {
  window.addEventListener('DOMContentLoaded', boot);
}

if (reducedMotion()) {
  document.documentElement.dataset.reducedMotion = 'true';
}
