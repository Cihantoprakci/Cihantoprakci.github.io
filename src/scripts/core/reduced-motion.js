const query = window.matchMedia('(prefers-reduced-motion: reduce)');

export function reducedMotion() {
  return query.matches;
}

export function onReducedMotionChange(callback) {
  query.addEventListener('change', () => callback(query.matches));
}
