import { gsap, ScrollTrigger } from '../core/gsap-config.js';

export function animateHero({ reduced }) {
  const hero = document.querySelector('#hero');
  if (!hero) return null;

  const titleLines = hero.querySelectorAll('.hero__title-line');
  const role = hero.querySelector('.hero__role');
  const tagline = hero.querySelector('.hero__tagline');
  const cta = hero.querySelector('.hero__cta');
  const portrait = hero.querySelector('.hero__portrait');

  if (reduced) {
    return null;
  }

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (titleLines.length) {
      tl.from(
        titleLines,
        { x: -80, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out' },
        0
      );
    }

    const restGroup = [role, tagline, cta].filter(Boolean);
    if (restGroup.length) {
      tl.from(
        restGroup,
        { x: -50, opacity: 0, stagger: 0.1, duration: 0.85, ease: 'power3.out' },
        '-=0.6'
      );
    }

    if (portrait) {
      tl.from(portrait, { x: 100, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0);
    }

    const heroContent = hero.querySelector('.hero__inner');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'bottom 90%',
          end: 'bottom 30%',
          scrub: 0.8,
        },
      });
    }

    ScrollTrigger.refresh();
  }, hero);

  return () => ctx.revert();
}
