import { gsap, ScrollTrigger } from '../core/gsap-config.js';
import { animateSectionLabel } from './utils.js';

export function animateSkills({ reduced }) {
  const section = document.querySelector('#competences');
  if (!section) return null;

  const sectionLabel = section.querySelector('#skills-label');
  const reveals = gsap.utils.toArray(section.querySelectorAll('[data-reveal]'));

  if (reduced) {
    return null;
  }

  const ctx = gsap.context(() => {
    animateSectionLabel(sectionLabel);

    reveals.forEach((el) => {
      gsap.from(el, {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
    });

    ScrollTrigger.refresh();
  }, section);

  return () => ctx.revert();
}
