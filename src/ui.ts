/** Petits fragments HTML partagés par les pages. */
import { t, type Key } from './i18n';

/**
 * Pochettes enregistrées dans src/assets/covers (voir `npm run fetch:covers`).
 * Un fichier présent est servi par le site ; sinon on demande le visuel à la plateforme.
 */
const localCovers = import.meta.glob('./assets/covers/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const localCover = (file?: string): string | undefined => (file ? localCovers[`./assets/covers/${file}`] : undefined);

export interface Page {
  render(): string;
  /** Branche les interactions propres à la page. Renvoie une fonction de nettoyage. */
  mount?(root: HTMLElement): void | (() => void);
}

export const esc = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

/** Attributs d'un lien externe, avec l'annonce « nouvel onglet » pour les lecteurs d'écran. */
export const ext = (url: string): string => `href="${esc(url)}" target="_blank" rel="noopener noreferrer"`;
export const extHint = (): string => `<span class="sr-only"> (${t('ext')})</span>`;

export const arrow = (dir: 'out' | 'right' | 'left' | 'up' = 'right'): string => {
  const d = {
    out: 'M5 15 15 5M7 5h8v8',
    right: 'M3 10h14M11 4l6 6-6 6',
    left: 'M17 10H3M9 4l-6 6 6 6',
    up: 'M10 17V3M4 9l6-6 6 6',
  }[dir];
  return `<svg class="ico" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;
};

/**
 * Pochette : affiche le visuel officiel s'il se charge, sinon un visuel typographique
 * qui ne se fait pas passer pour l'original. Voir le gestionnaire d'erreur dans main.ts.
 */
export function cover(o: { title: string; sub: string; alt: string; local?: string; remote?: string; tone?: string }): string {
  const src = localCover(o.local) ?? o.remote;
  const img = src
    ? `<img class="cover__img" src="${esc(src)}" alt="${esc(o.alt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
    : '';
  return `<span class="cover ${src ? '' : 'cover--type'}" data-tone="${o.tone ?? 'a'}">
    <span class="cover__type" ${src ? 'aria-hidden="true"' : ''}>
      <span class="cover__sub">${esc(o.sub)}</span>
      <span class="cover__title">${esc(o.title)}</span>
    </span>
    ${img}
    <span class="cover__glare" aria-hidden="true"></span>
  </span>`;
}

/** Zone libre du hero où l'on peut faire tourner le nuage de particules. */
export const stage = (): string =>
  `<div class="stage" data-stage aria-hidden="true"><span class="stage__hint">${t('stage.hint')}</span></div>`;

export const pageHead = (titleKey: Key, introKey: Key, extra = ''): string => `
  <header class="phead">
    <div class="phead__text">
      <h1 class="phead__title">${t(titleKey)}</h1>
      <p class="phead__intro">${t(introKey)}</p>
      ${extra}
    </div>
    ${stage()}
  </header>`;
