import { t } from '../i18n';
import { platformNames, playlists as items, type Platform } from '../data';
import { arrow, cover, ext, extHint, stage, type Page } from '../ui';

type Filter = Platform | 'all';
let active: Filter = 'all';

export const playlists: Page = {
  render() {
    const filters: Filter[] = ['all', 'apple', 'spotify', 'deezer'];
    return `
    <header class="pl-top">
      <h1 class="pl-top__title"><span class="pl-top__num" aria-hidden="true">50+</span><span>${t('playlists.title')}</span></h1>
      ${stage()}
      <p class="pl-top__claim">${t('playlists.claim')}</p>
      <p class="pl-top__intro">${t('playlists.intro')}</p>
    </header>

    <section class="wrap">
      <div class="filters" role="group" aria-label="${t('playlists.filter')}">
        ${filters
          .map((f) => {
            const n = f === 'all' ? items.length : items.filter((p) => p.platform === f).length;
            return `<button type="button" class="filter" data-filter="${f}" aria-pressed="${f === active}">
              ${f === 'all' ? t('playlists.all') : platformNames[f]} <span class="mono">${n}</span></button>`;
          })
          .join('')}
        <p class="filters__count mono" aria-live="polite" data-count></p>
      </div>

      <ul class="mosaic" data-mosaic>
        ${items
          .map(
            (p, i) => `
          <li class="tile tile--${p.size}" data-platform="${p.platform}" style="view-transition-name:tile-${p.id}">
            <a class="tile__link" ${ext(p.url)} data-tilt>
              ${cover({ title: p.name, sub: platformNames[p.platform], alt: p.name, local: p.cover?.local, remote: p.cover?.remote, tone: p.platform })}
              <span class="tile__bar">
                <span class="tile__name">${p.name}</span>
                <span class="tile__plat mono">${t('playlists.open')} ${platformNames[p.platform]} ${arrow('out')}${extHint()}</span>
              </span>
              <span class="tile__idx mono" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            </a>
          </li>`,
          )
          .join('')}
      </ul>
      <p class="mosaic__note mono">${t('playlists.note')}</p>
    </section>`;
  },

  mount(root) {
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('.tile'));
    const count = root.querySelector<HTMLElement>('[data-count]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = (): void => {
      let n = 0;
      for (const tile of tiles) {
        const show = active === 'all' || tile.dataset.platform === active;
        tile.hidden = !show;
        if (show) n++;
      }
      root.querySelectorAll<HTMLElement>('.filter').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === active)));
      root.querySelector<HTMLElement>('[data-mosaic]')?.setAttribute('data-active', active);
      if (count) count.textContent = `${n} ${n > 1 ? t('playlists.count.many') : t('playlists.count.one')}`;
    };

    const onClick = (e: Event): void => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-filter]');
      if (!btn) return;
      active = btn.dataset.filter as Filter;
      // Transition entre plateformes : les tuiles glissent vers leur nouvelle place.
      const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
      if (doc.startViewTransition && !reduced) doc.startViewTransition(apply);
      else apply();
    };

    root.addEventListener('click', onClick);
    apply();
    return () => root.removeEventListener('click', onClick);
  },
};
