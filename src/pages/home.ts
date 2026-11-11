import { l, t } from '../i18n';
import { playlists, projects } from '../data';
import { arrow, cover, stage, type Page } from '../ui';
import { splitLetters } from '../fx/type';

export const home: Page = {
  render() {
    const ticker = playlists.map((p) => `<span class="ticker__item">${p.name}</span>`).join('');
    return `
    <section class="hero">
      ${stage()}
      <div class="hero__meta">
        <ul class="hero__roles">
          <li>${t('home.role1')}</li>
          <li>${t('home.role2')}</li>
          <li>${t('home.role3')}</li>
        </ul>
        <p class="hero__place mono">${t('home.place')}<br />48.8566 N, 2.3522 E</p>
      </div>
      <h1 class="hero__name" data-stretch aria-label="Martin Roux">
        <span class="hero__line">${splitLetters('MARTIN')}</span>
        <span class="hero__line hero__line--2">${splitLetters('ROUX')}</span>
      </h1>
      <div class="hero__foot">
        <p class="hero__tagline">${t('home.tagline')}</p>
        <p class="hero__lede">${t('home.lede')}</p>
        <div class="hero__cta">
          <a class="btn btn--solid" href="#projects">${t('home.cta.projects')} ${arrow()}</a>
          <a class="btn" href="#contact">${t('home.cta.contact')}</a>
        </div>
      </div>
    </section>

    <section class="ticker" aria-label="${t('home.ticker')}">
      <p class="ticker__label mono">${t('home.ticker')}</p>
      <div class="ticker__track" data-ticker aria-hidden="true">${ticker}${ticker}${ticker}</div>
      <p class="sr-only">${playlists.map((p) => p.name).join(', ')}</p>
    </section>

    <section class="stats wrap" aria-labelledby="stats-title">
      <h2 id="stats-title" class="sr-only">${t('home.stats.title')}</h2>
      <a class="stats__big" href="#playlists">
        <span class="stats__num">50+</span>
        <span class="stats__cap">${t('home.stats.big')}</span>
      </a>
      <ul class="stats__list">
        <li><a href="#projects"><strong>${t('home.stats.a.t')}</strong><span>${t('home.stats.a.d')}</span>${arrow()}</a></li>
        <li><a href="#about"><strong>${t('home.stats.b.t')}</strong><span>${t('home.stats.b.d')}</span>${arrow()}</a></li>
        <li><a href="#no-line"><strong>${t('home.stats.c.t')}</strong><span>${t('home.stats.c.d')}</span>${arrow()}</a></li>
      </ul>
    </section>

    <section class="hprojects wrap" aria-labelledby="hp-title">
      <div class="hprojects__head">
        <h2 id="hp-title" class="h2">${t('home.projects.title')}</h2>
        <a class="link" href="#projects">${t('home.projects.all')} ${arrow()}</a>
      </div>
      <div class="hprojects__row">
        ${projects
          .map(
            (p, i) => `
          <a class="sleeve sleeve--${i % 2 ? 'b' : 'a'}" href="#projects" data-tilt>
            ${cover({ title: p.title, sub: p.artist, alt: `${t('projects.cover.alt')} ${p.title}`, local: p.cover.local, remote: p.cover.remote, tone: i % 2 ? 'b' : 'a' })}
            <span class="sleeve__meta"><strong>${p.artist}</strong><span>${p.title}</span><span class="mono">${l(p.format)}, ${p.released.slice(0, 4)}</span></span>
          </a>`,
          )
          .join('')}
      </div>
    </section>

    <section class="hnoline">
      <div class="wrap hnoline__in">
        <h2 class="hnoline__title">${t('home.noline.title')}</h2>
        <div>
          <p>${t('home.noline.text')}</p>
          <a class="btn" href="#no-line">${t('home.noline.cta')} ${arrow()}</a>
        </div>
      </div>
    </section>

    <section class="endcta wrap">
      <h2 class="endcta__title">${t('home.end.title')}</h2>
      <a class="btn btn--solid btn--xl" href="#contact">${t('home.end.cta')} ${arrow()}</a>
    </section>`;
  },

  mount(root) {
    // Le bandeau des playlists avance avec le défilement de la page.
    const track = root.querySelector<HTMLElement>('[data-ticker]');
    if (!track) return;
    const onScroll = (): void => {
      track.style.setProperty('--shift', `${-(window.scrollY * 0.35) % (track.scrollWidth / 3)}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  },
};
