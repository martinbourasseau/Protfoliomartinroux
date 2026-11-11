import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/instrument-sans/index.css';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import '@fontsource-variable/doto/index.css';
import './styles/main.css';

import { detectLang, getLang, setLang, t, type Key, type Lang } from './i18n';
import { looks, parseRoute, routeIds, type RouteId } from './routes';
import { contact as contactData } from './data';
import { arrow, ext, type Page } from './ui';
import { initTilt } from './fx/tilt';
import { initStretch } from './fx/type';
import type { SignalScene } from './gl/scene';

import { home } from './pages/home';
import { about } from './pages/about';
import { projects } from './pages/projects';
import { playlists } from './pages/playlists';
import { noline } from './pages/noline';
import { events } from './pages/events';
import { contact } from './pages/contact';

const pages: Record<RouteId, Page> = { home, about, projects, playlists, 'no-line': noline, events, contact };

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const view = $('view');
const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let route: RouteId = parseRoute(location.hash);
let scene: SignalScene | null = null;
let cleanups: Array<() => void> = [];
let busy = false;

/* ------------------------------------------------------------------ rendu */

function renderChrome(): void {
  root.lang = getLang();
  root.dataset.route = route;

  $('skip').textContent = t('nav.skip');
  const links = routeIds
    .filter((id) => id !== 'home')
    .map((id) => `<a href="#${id}" ${id === route ? 'aria-current="page"' : ''}>${t(`nav.${id}` as Key)}</a>`)
    .join('');
  const nav = $('nav');
  nav.setAttribute('aria-label', t('nav.main'));
  nav.innerHTML = links;

  $('menu-nav').innerHTML = routeIds
    .map(
      (id, i) =>
        `<a href="#${id}" ${id === route ? 'aria-current="page"' : ''}><span class="mono">${String(i + 1).padStart(2, '0')}</span>${t(`nav.${id}` as Key)}</a>`,
    )
    .join('');
  $('menu-nav').setAttribute('aria-label', t('nav.main'));

  const lang = $('lang');
  lang.setAttribute('aria-label', t('nav.lang'));
  lang.querySelectorAll<HTMLElement>('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === getLang())));

  const burger = $('burger');
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.querySelector('.burger__label')!.textContent = open ? t('nav.close') : t('nav.menu');

  const n = routeIds.indexOf(route) + 1;
  $('hud').innerHTML = `
    <span class="hud__ch mono">${t('hud.channel')} ${String(n).padStart(2, '0')}/${String(routeIds.length).padStart(2, '0')} ${t(`nav.${route}` as Key)}</span>
    <span class="hud__sig" data-sig><i></i><i></i><i></i><i></i><i></i></span>`;

  $('foot').innerHTML = `
    <div class="foot__in">
      <p class="foot__name">Martin Roux</p>
      <ul class="foot__links">
        <li><a href="mailto:${contactData.email}">${contactData.email}</a></li>
        <li><a href="tel:${contactData.phoneHref}">${contactData.phoneDisplay}</a></li>
        <li><a ${ext(contactData.linkedin)}>LinkedIn ${arrow('out')}</a></li>
        <li><a ${ext(contactData.noLine)}>No Line ${arrow('out')}</a></li>
      </ul>
      <p class="foot__note mono">© ${new Date().getFullYear()} ${t('footer.rights')}. ${t('footer.indep')}</p>
      <button type="button" class="foot__top mono" id="to-top">${t('footer.top')} ${arrow('up')}</button>
    </div>`;
}

function renderMeta(): void {
  const title = t(`meta.${route}.title` as Key);
  const desc = t(`meta.${route}.desc` as Key);
  document.title = title;
  const set = (sel: string, value: string): void => document.querySelector(sel)?.setAttribute('content', value);
  set('meta[name="description"]', desc);
  set('meta[property="og:title"]', title);
  set('meta[property="og:description"]', desc);
  set('meta[property="og:locale"]', getLang() === 'fr' ? 'fr_FR' : 'en_GB');
  set('meta[property="og:locale:alternate"]', getLang() === 'fr' ? 'en_GB' : 'fr_FR');
}

function renderView(): void {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  const page = pages[route];
  view.innerHTML = page.render();
  const off = page.mount?.(view);
  if (off) cleanups.push(off);
  cleanups.push(initTilt(view, reduced));
  cleanups.push(initStretch(view, reduced));
  renderChrome();
  renderMeta();
}

/* ------------------------------------------------------------- navigation */

function closeMenu(): void {
  const menu = $('menu');
  if (menu.hidden) return;
  menu.hidden = true;
  $('burger').setAttribute('aria-expanded', 'false');
  root.classList.remove('menu-open');
  $('burger').querySelector('.burger__label')!.textContent = t('nav.menu');
}

/** Changement de page : l'image se referme sur une ligne, comme un écran cathodique. */
function go(next: RouteId): void {
  closeMenu();
  if (next === route && view.childElementCount) return;
  const swap = (): void => {
    route = next;
    renderView();
    window.scrollTo(0, 0);
    scene?.setLook(looks[route]);
    scene?.setScroll(0);
  };
  if (reduced || !view.childElementCount) {
    swap();
    view.focus({ preventScroll: true });
    return;
  }
  if (busy) {
    swap();
    return;
  }
  busy = true;
  root.classList.add('is-leaving');
  window.setTimeout(() => {
    swap();
    root.classList.remove('is-leaving');
    root.classList.add('is-entering');
    view.focus({ preventScroll: true });
    window.setTimeout(() => {
      root.classList.remove('is-entering');
      busy = false;
    }, 520);
  }, 260);
}

window.addEventListener('hashchange', () => go(parseRoute(location.hash)));

function switchLang(lang: Lang): void {
  if (lang === getLang()) return;
  const y = window.scrollY;
  setLang(lang);
  renderView(); // instantané, sans transition : on reste sur la même page
  window.scrollTo(0, y);
}

document.addEventListener('click', (e) => {
  const el = e.target as HTMLElement;
  if (el.closest('#skip')) {
    e.preventDefault(); // le lien d'évitement ne doit pas déclencher le routeur
    view.focus();
    return;
  }
  const langBtn = el.closest<HTMLElement>('[data-lang]');
  if (langBtn) return switchLang(langBtn.dataset.lang as Lang);

  if (el.closest('#burger')) {
    const menu = $('menu');
    const open = menu.hidden === true;
    menu.hidden = !open;
    $('burger').setAttribute('aria-expanded', String(open));
    root.classList.toggle('menu-open', open);
    $('burger').querySelector('.burger__label')!.textContent = open ? t('nav.close') : t('nav.menu');
    if (open) menu.querySelector<HTMLElement>('a')?.focus();
    return;
  }
  if (el.closest('#menu a')) return closeMenu();
  if (el.closest('#to-top')) {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    view.focus({ preventScroll: true });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('menu').hidden) {
    closeMenu();
    $('burger').focus();
  }
});

/* Pochette introuvable : on laisse le visuel typographique, sans le faire passer pour l'original. */
document.addEventListener(
  'error',
  (e) => {
    const img = e.target as HTMLImageElement;
    if (!(img instanceof HTMLImageElement) || !img.classList.contains('cover__img')) return;
    img.closest('.cover')?.classList.add('no-img');
    img.remove();
  },
  true,
);

/* --------------------------------------------------- pointeur et défilement */

let dragging = false;
let lastX = 0;
let lastY = 0;

window.addEventListener(
  'pointermove',
  (e) => {
    scene?.setPointer(e.clientX, e.clientY);
    if (dragging) {
      scene?.dragBy(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  },
  { passive: true },
);
window.addEventListener('pointerdown', (e) => {
  if (!(e.target as HTMLElement).closest('[data-stage]')) return;
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  root.classList.add('is-dragging');
});
const endDrag = (): void => {
  dragging = false;
  root.classList.remove('is-dragging');
};
window.addEventListener('pointerup', (e) => {
  endDrag();
  if (e.pointerType !== 'mouse') scene?.releasePointer();
});
window.addEventListener('pointercancel', () => {
  endDrag();
  scene?.releasePointer();
});
document.addEventListener('pointerleave', () => scene?.releasePointer());

let scrollTick = false;
let lastScroll = 0;
window.addEventListener(
  'scroll',
  () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      scrollTick = false;
      const y = window.scrollY;
      scene?.setScroll(y);
      root.classList.toggle('is-scrolled', y > 24);
      // Parallaxe multi-couches.
      if (!reduced) {
        view.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          const r = el.getBoundingClientRect();
          const k = Number(el.dataset.parallax);
          el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - window.innerHeight / 2) * -k).toFixed(1)}px, 0)`;
        });
      }
      // Indicateur de signal : la vitesse de défilement remplit les barres.
      const sig = document.querySelector<HTMLElement>('[data-sig]');
      if (sig) sig.style.setProperty('--lvl', String(Math.min(5, 1 + Math.round(Math.abs(y - lastScroll) / 14))));
      lastScroll = y;
    });
  },
  { passive: true },
);

/* ------------------------------------------------------------------ départ */

setLang(detectLang());
renderView();
root.classList.add('is-intro');
window.setTimeout(() => root.classList.remove('is-intro'), 1700);

// La scène 3D arrive après le premier affichage : elle ne bloque ni le texte ni la navigation.
const bootScene = async (): Promise<void> => {
  try {
    const { SignalScene, webglAvailable } = await import('./gl/scene');
    if (!webglAvailable()) throw new Error('WebGL indisponible');
    scene = new SignalScene($<HTMLCanvasElement>('gl') as unknown as HTMLCanvasElement, looks[route], { reduced });
    scene.setScroll(window.scrollY);
    root.classList.add('has-gl');
  } catch {
    root.classList.add('no-gl'); // repli : fond tramé en CSS
  }
};
window.setTimeout(() => void bootScene(), 60);
