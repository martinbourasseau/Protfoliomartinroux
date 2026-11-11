import { formatDate, l, t } from '../i18n';
import { projects as items } from '../data';
import { arrow, cover, ext, extHint, pageHead, type Page } from '../ui';

export const projects: Page = {
  render() {
    const index = `<nav class="pindex" aria-label="${t('projects.index')}">
      ${items.map((p, i) => `<button type="button" class="pindex__btn" data-goto="${p.id}"><span class="mono">${String(i + 1).padStart(2, '0')}</span> ${p.artist}</button>`).join('')}
    </nav>`;

    return `
    ${pageHead('projects.title', 'projects.intro', index)}
    <div class="plist">
      ${items
        .map((p, i) => {
          const prev = items[i - 1];
          const next = items[i + 1];
          return `
        <article class="project ${i % 2 ? 'project--flip' : ''}" id="p-${p.id}" aria-labelledby="pt-${p.id}">
          <a class="project__cover" ${ext(p.url)} data-tilt aria-label="${t('projects.listen')} : ${p.artist}, ${p.title}">
            ${cover({ title: p.title, sub: p.artist, alt: `${t('projects.cover.alt')} ${p.title}`, local: p.cover.local, remote: p.cover.remote, tone: i % 2 ? 'b' : 'a' })}
            <span class="project__disc" aria-hidden="true"></span>
          </a>
          <div class="project__body">
            <p class="project__artist">${p.artist}</p>
            <h2 class="project__title" id="pt-${p.id}">${p.title}</h2>
            <p class="project__desc">${l(p.description)}</p>
            <dl class="specs">
              <div><dt>${t('projects.format')}</dt><dd>${l(p.format)}, ${p.tracks} ${t('projects.tracks')}</dd></div>
              <div><dt>${t('projects.released')}</dt><dd>${formatDate(p.released)}</dd></div>
              <div><dt>${t('projects.platform')}</dt><dd>${p.platform}</dd></div>
              ${p.origin ? `<div><dt>${t('projects.origin')}</dt><dd>${l(p.origin)}</dd></div>` : ''}
              ${p.role ? `<div class="specs__wide"><dt>${t('projects.role')}</dt><dd>${l(p.role)}</dd></div>` : ''}
            </dl>
            <p class="cover-note mono">${t('projects.cover.note')}</p>
            <div class="project__actions">
              <a class="btn btn--solid" ${ext(p.url)}>${t('projects.listen')} ${arrow('out')}${extHint()}</a>
              ${prev ? `<button type="button" class="btn btn--ghost" data-goto="${prev.id}">${arrow('up')} ${t('projects.prev')}</button>` : ''}
              ${next ? `<button type="button" class="btn btn--ghost" data-goto="${next.id}">${t('projects.next')} ${arrow('right')}</button>` : ''}
            </div>
          </div>
        </article>`;
        })
        .join('')}
    </div>
    <section class="endcta wrap">
      <h2 class="endcta__title">${t('projects.end')}</h2>
      <a class="btn btn--solid btn--xl" href="#contact">${t('home.end.cta')} ${arrow()}</a>
    </section>`;
  },

  mount(root) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onClick = (e: Event): void => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-goto]');
      if (!btn) return;
      const target = root.querySelector<HTMLElement>(`#p-${btn.dataset.goto}`);
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      target?.querySelector<HTMLElement>('.project__title')?.focus({ preventScroll: true });
    };
    root.addEventListener('click', onClick);
    root.querySelectorAll<HTMLElement>('.project__title').forEach((h) => h.setAttribute('tabindex', '-1'));
    return () => root.removeEventListener('click', onClick);
  },
};
