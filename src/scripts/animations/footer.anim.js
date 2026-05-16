import { gsap } from '../core/gsap-config.js';

export function animateFooter({ reduced }) {
  const footer = document.querySelector('[data-footer]');
  if (!footer) return null;
  if (reduced) return null;

  const blocks = footer.querySelectorAll('[data-footer-block]');
  if (!blocks.length) return null;

  const ctx = gsap.context(() => {
    gsap.from(blocks, {
      y: 28,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: footer, start: 'top 88%', once: true },
    });
  }, footer);

  return () => ctx.revert();
}
