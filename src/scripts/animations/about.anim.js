import { gsap, ScrollTrigger } from '../core/gsap-config.js';
import { revealOnScroll, animateSectionLabel } from './utils.js';

export function animateAbout({ reduced }) {
  const about = document.querySelector('#about');
  if (!about) return null;

  const portraitMask = about.querySelector('.about__portrait-mask');
  const sectionLabel = about.querySelector('#about-label');
  const lede = about.querySelector('.about__lede');
  const bodyParagraphs = about.querySelectorAll('.about__body p');
  const timeline = about.querySelector('.about__timeline');
  const timelineSteps = about.querySelectorAll('.about__step');
  const timelineLine = about.querySelector('.about__timeline-line');
  const timelineCar = about.querySelector('.about__timeline-car');
  const timelineWrap = about.querySelector('.about__timeline-wrap');

  if (reduced) {
    if (lede) lede.classList.add('is-ready');
    bodyParagraphs.forEach((p) => p.classList.add('is-ready'));
    return null;
  }

  const ledeLines = lede?.querySelectorAll('.about__lede-line') || [];

  const ctx = gsap.context(() => {
    animateSectionLabel(sectionLabel);

    if (portraitMask) {
      gsap.fromTo(
        portraitMask,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: portraitMask, start: 'top 80%', once: true },
        }
      );
    }

    if (ledeLines.length) {
      gsap.from(ledeLines, {
        y: 40,
        opacity: 0,
        stagger: 0.18,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: lede, start: 'top 80%', once: true },
        onStart: () => lede.classList.add('is-ready'),
      });
    }

    revealOnScroll(bodyParagraphs, { stagger: 0.12, y: 30 });

    if (timelineSteps.length) {
      gsap.from(timelineSteps, {
        y: 20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: timeline, start: 'top 85%', once: true },
      });
    }

    if (timelineCar && timelineWrap && timelineLine) {
      const currentDot = about.querySelector('.about__step--current .about__step-dot');
      const compute = () => {
        const lineRect = timelineLine.getBoundingClientRect();
        const wrapRect = timelineWrap.getBoundingClientRect();
        const startX = lineRect.left - wrapRect.left;
        let endX = lineRect.right - wrapRect.left;
        if (currentDot) {
          const dotRect = currentDot.getBoundingClientRect();
          endX = dotRect.left + dotRect.width / 2 - wrapRect.left;
        }
        return { startX, endX };
      };

      gsap.set(timelineCar, { yPercent: -85 });
      const { startX, endX } = compute();
      gsap.fromTo(
        timelineCar,
        { x: startX, xPercent: -22 },
        {
          x: endX,
          xPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineWrap,
            start: 'top 70%',
            end: 'top 25%',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    const lineFill = about.querySelector('.about__timeline-line-fill');
    const currentStep = about.querySelector('.about__step--current');
    if (lineFill && currentStep && timelineLine) {
      gsap.set(lineFill, { width: 0 });
      ScrollTrigger.create({
        trigger: timeline,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          const lineRect = timelineLine.getBoundingClientRect();
          const dot = currentStep.querySelector('.about__step-dot');
          if (!dot) return;
          const dotRect = dot.getBoundingClientRect();
          const targetPx = dotRect.left + dotRect.width / 2 - lineRect.left;
          const targetPct = Math.max(0, Math.min(100, (targetPx / lineRect.width) * 100));
          gsap.to(lineFill, {
            width: `${targetPct}%`,
            duration: 1.4,
            ease: 'power2.out',
          });
        },
      });
    }
  }, about);

  return () => ctx.revert();
}
