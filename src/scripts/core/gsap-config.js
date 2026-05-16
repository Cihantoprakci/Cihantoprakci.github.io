import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

ScrollTrigger.config({
  ignoreMobileResize: true,
});

export { gsap, ScrollTrigger };
