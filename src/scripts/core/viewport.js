const desktopQuery = window.matchMedia('(min-width: 900px)');
const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

export function isDesktop() {
  return desktopQuery.matches;
}

export function hasHover() {
  return hoverQuery.matches;
}
