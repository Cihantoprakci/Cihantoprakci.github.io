import { gsap, ScrollTrigger } from '../core/gsap-config.js';

export function splitText(el, type = 'chars') {
  if (!el) return [];

  const original = el.dataset.originalText || el.textContent.trim();
  el.dataset.originalText = original;
  el.innerHTML = '';

  if (type === 'chars') {
    const words = original.split(/(\s+)/);
    const charSpans = [];
    words.forEach((token) => {
      if (/^\s+$/.test(token)) {
        el.appendChild(document.createTextNode(token));
        return;
      }
      const wordWrapper = document.createElement('span');
      wordWrapper.className = 'word';
      wordWrapper.style.display = 'inline-block';
      wordWrapper.style.overflow = 'hidden';
      [...token].forEach((char) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.style.display = 'inline-block';
        span.textContent = char;
        wordWrapper.appendChild(span);
        charSpans.push(span);
      });
      el.appendChild(wordWrapper);
    });
    el.classList.add('is-ready');
    return charSpans;
  }

  if (type === 'words') {
    const words = original.split(/\s+/);
    const wordSpans = [];
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.display = 'inline-block';
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      wordSpans.push(span);
    });
    el.classList.add('is-ready');
    return wordSpans;
  }

  if (type === 'lines') {
    el.style.position = 'relative';
    const tempSpans = original.split(/\s+/).map((word) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = word + ' ';
      el.appendChild(span);
      return span;
    });

    const lines = groupByLine(tempSpans);
    el.innerHTML = '';

    const lineSpans = lines.map((wordsInLine) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'line-wrap';
      wrapper.style.display = 'block';
      wrapper.style.overflow = 'hidden';

      const inner = document.createElement('span');
      inner.className = 'line';
      inner.style.display = 'inline-block';
      inner.textContent = wordsInLine.join(' ');
      wrapper.appendChild(inner);
      el.appendChild(wrapper);
      return inner;
    });

    el.classList.add('is-ready');
    return lineSpans;
  }

  return [];
}

function groupByLine(spans) {
  const lines = [];
  let currentLine = [];
  let lastTop = null;

  spans.forEach((span) => {
    const top = span.getBoundingClientRect().top;
    if (lastTop === null || Math.abs(top - lastTop) < 4) {
      currentLine.push(span.textContent.trim());
    } else {
      lines.push(currentLine);
      currentLine = [span.textContent.trim()];
    }
    lastTop = top;
  });

  if (currentLine.length) lines.push(currentLine);
  return lines;
}

export function revealOnScroll(elements, options = {}) {
  if (!elements?.length) return;

  const items = elements instanceof NodeList || Array.isArray(elements) ? elements : [elements];

  items.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
        onStart: () => el.classList.add('is-ready'),
        ...options,
      }
    );
  });
}

export function countUp(el, options = {}) {
  if (!el) return;
  const target = parseInt(el.dataset.countTarget || el.textContent, 10);
  if (isNaN(target)) return;

  el.textContent = '0';

  gsap.fromTo(
    { val: 0 },
    { val: 0 },
    {
      val: target,
      duration: 1.6,
      ease: 'power2.out',
      snap: { val: 1 },
      onUpdate() {
        el.textContent = Math.round(this.targets()[0].val);
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      ...options,
    }
  );
}

export function refreshScrollTrigger(delay = 100) {
  setTimeout(() => ScrollTrigger.refresh(), delay);
}

export function parallaxScrub(el, { from = 0, to = -20, trigger = el, scrub = 0.6 } = {}) {
  if (!el) return;
  gsap.fromTo(
    el,
    { yPercent: from },
    {
      yPercent: to,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
      },
    }
  );
}

export function animateSectionLabel(el, options = {}) {
  if (!el) return;
  const chars = splitText(el, 'chars');
  if (!chars.length) return;
  gsap.from(chars, {
    yPercent: 130,
    opacity: 0,
    stagger: 0.025,
    duration: 0.9,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    ...options,
  });
}

export function slideInFromSide(el, { side = 'left', distance = 80, ...rest } = {}) {
  if (!el) return;
  const x = side === 'left' ? -distance : distance;
  gsap.from(el, {
    x,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    ...rest,
  });
}

export function popReveal(elements, options = {}) {
  if (!elements) return;
  const items = elements instanceof NodeList || Array.isArray(elements) ? elements : [elements];
  gsap.from(items, {
    y: 32,
    opacity: 0,
    scale: 0.92,
    stagger: 0.08,
    duration: 0.7,
    ease: 'back.out(1.6)',
    scrollTrigger: { trigger: items[0], start: 'top 88%', once: true },
    ...options,
  });
}
