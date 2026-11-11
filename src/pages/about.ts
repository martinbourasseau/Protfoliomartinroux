import { l, t } from '../i18n';
import { journey, skills } from '../data';
import { arrow, stage, type Page } from '../ui';

const PHOTO = 'img/martin-1400.webp';
const PHOTO_SM = 'img/martin-720.webp';

export const about: Page = {
  render() {
    const frames = [
      { pos: '48% 36%', zoom: 3.1, alt: t('about.frame1.alt') },
      { pos: '50% 62%', zoom: 2.2, alt: t('about.frame2.alt') },
      { pos: '8% 47%', zoom: 2.6, alt: t('about.frame3.alt') },
    ];
    return `
    <header class="about-top">
      <h1 class="about-top__title">${t('about.title')}</h1>
      ${stage()}
      <p class="about-top__intro">${t('about.intro')}</p>
    </header>

    <section class="portrait wrap">
      <span class="portrait__word" aria-hidden="true" data-parallax="0.12">PARIS</span>
      <figure class="portrait__main" data-tilt>
        <img src="${PHOTO}" srcset="${PHOTO_SM} 720w, ${PHOTO} 1400w" sizes="(max-width: 800px) 86vw, 42vw"
             width="1400" height="1867" alt="${t('about.photo.alt')}" decoding="async" />
        <figcaption class="mono">${t('about.photo.cap')}, 48.8566 N</figcaption>
      </figure>
      <div class="portrait__text">
        <p>${t('about.p1')}</p>
        <p>${t('about.p2')}</p>
      </div>
      <ul class="portrait__strip" aria-label="${t('about.photo.cap')}">
        ${frames
          .map(
            (f, i) => `<li class="frame"><span class="frame__img" role="img" aria-label="${f.alt}"
              style="background-image:url(${PHOTO_SM});background-position:${f.pos};background-size:${f.zoom * 100}%"></span>
              <span class="mono">${String(i + 1).padStart(2, '0')}A</span></li>`,
          )
          .join('')}
      </ul>
    </section>

    <section class="method wrap" aria-labelledby="method-title">
      <h2 id="method-title" class="h2">${t('about.method.title')}</h2>
      <ol class="method__list">
        <li><h3>${t('about.m1.t')}</h3><p>${t('about.m1.d')}</p></li>
        <li><h3>${t('about.m2.t')}</h3><p>${t('about.m2.d')}</p></li>
        <li><h3>${t('about.m3.t')}</h3><p>${t('about.m3.d')}</p></li>
      </ol>
    </section>

    <section class="journey wrap" aria-labelledby="journey-title">
      <div class="journey__head">
        <h2 id="journey-title" class="h2">${t('about.journey.title')}</h2>
        <p class="mono">${t('about.journey.note')}</p>
      </div>
      <ol class="tracklist">
        ${journey
          .map(
            (s) => `<li class="track">
              <h3 class="track__title">${l(s.title)}</h3>
              <p class="track__text">${l(s.text)}</p>
              <p class="track__date mono">${l(s.date)}</p>
            </li>`,
          )
          .join('')}
      </ol>
    </section>

    <section class="extras wrap">
      <div>
        <h2 class="h3">${t('about.skills.title')}</h2>
        <ul class="chips">${skills.map((s) => `<li>${l(s)}</li>`).join('')}</ul>
      </div>
      <div>
        <h2 class="h3">${t('about.school.title')}</h2>
        <p>${t('about.school.text')}</p>
        <a class="btn" href="#projects">${t('about.cta')} ${arrow()}</a>
      </div>
    </section>`;
  },
};
