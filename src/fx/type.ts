/**
 * Titre à largeur variable ([data-stretch]).
 * Chaque lettre s'élargit quand le curseur ou le doigt s'en approche : on joue sur
 * l'axe « wdth » de la police Archivo. Sans pointeur, une onde traverse le nom.
 */
const MIN = 62;
const MAX = 125;

export function splitLetters(text: string): string {
  return Array.from(text)
    .map((ch) => `<span class="ltr" aria-hidden="true">${ch}</span>`)
    .join('');
}

export function initStretch(root: HTMLElement, reduced: boolean): () => void {
  const host = root.querySelector<HTMLElement>('[data-stretch]');
  if (!host || reduced) return () => {};
  const letters = Array.from(host.querySelectorAll<HTMLElement>('.ltr'));
  let raf = 0;
  let px = -1;
  let py = -1;
  let idleSince = performance.now();
  let alive = true;

  const onMove = (e: PointerEvent): void => {
    px = e.clientX;
    py = e.clientY;
    idleSince = performance.now();
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const tick = (now: number): void => {
    if (!alive) return;
    const rect = host.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const idle = now - idleSince > 2600 || px < 0;
      const reach = Math.max(120, rect.width * 0.22);
      letters.forEach((el, i) => {
        let k: number;
        if (idle) {
          // Onde de repos, lente.
          k = Math.pow(Math.max(0, Math.sin(now / 900 - i * 0.55)), 6) * 0.7;
        } else {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(px - (r.left + r.width / 2), (py - (r.top + r.height / 2)) * 0.6);
          k = Math.max(0, 1 - d / reach);
          k = k * k;
        }
        el.style.fontVariationSettings = `"wdth" ${(MIN + (MAX - MIN) * k).toFixed(1)}, "wght" 900`;
      });
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
  };
}
