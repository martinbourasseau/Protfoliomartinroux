/**
 * Inclinaison 3D des pochettes et des tuiles ([data-tilt]).
 * Souris : l'objet suit le curseur. Tactile : il suit le doigt, et s'incline
 * doucement selon sa position dans l'écran pendant le défilement.
 */
const MAX = 13;

export function initTilt(root: HTMLElement, reduced: boolean): () => void {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-tilt]'));
  if (!items.length || reduced) return () => {};
  const coarse = window.matchMedia('(hover: none)').matches;
  const off: Array<() => void> = [];

  const apply = (el: HTMLElement, nx: number, ny: number): void => {
    el.style.setProperty('--ry', `${(nx * MAX).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-ny * MAX).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(50 + nx * 45).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(50 + ny * 45).toFixed(1)}%`);
  };

  for (const el of items) {
    const move = (e: PointerEvent): void => {
      const r = el.getBoundingClientRect();
      apply(el, ((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
      el.classList.add('is-tilting');
    };
    const leave = (): void => {
      el.classList.remove('is-tilting');
      if (!coarse) apply(el, 0, 0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('pointercancel', leave);
    off.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('pointercancel', leave);
    });
  }

  if (coarse) {
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const vh = window.innerHeight;
        items.forEach((el, i) => {
          if (el.classList.contains('is-tilting')) return;
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          const ny = ((r.top + r.height / 2) / vh - 0.5) * 1.4;
          apply(el, (i % 2 ? -0.35 : 0.35) * (1 - Math.abs(ny)), ny);
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    off.push(() => window.removeEventListener('scroll', onScroll));
  }

  return () => off.forEach((fn) => fn());
}
