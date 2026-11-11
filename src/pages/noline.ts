import { l, t } from '../i18n';
import { contact, roster } from '../data';
import { arrow, ext, extHint, stage, type Page } from '../ui';

export const noline: Page = {
  render() {
    return `
    <header class="nl-top">
      <p class="nl-top__kicker mono">${t('noline.kicker')}</p>
      <h1 class="nl-top__title" aria-label="No Line"><span>NO</span><span class="nl-top__rule" aria-hidden="true"></span><span>LINE</span></h1>
      ${stage()}
      <p class="nl-top__intro">${t('noline.intro')}</p>
      <div class="nl-top__visit">
        <a class="btn btn--solid btn--xl" ${ext(contact.noLine)}>${t('noline.visit')} ${arrow('out')}${extHint()}</a>
        <p class="mono">${t('noline.visit.note')}</p>
      </div>
    </header>

    <section class="nl-story wrap">
      <div class="nl-story__text">
        <p>${t('noline.p1')}</p>
        <p>${t('noline.p2')}</p>
      </div>
      <aside class="nl-role">
        <h2 class="h3">${t('noline.role.title')}</h2>
        <p>${t('noline.role.text')}</p>
      </aside>
    </section>

    <section class="nl-services wrap" aria-labelledby="nls-title">
      <h2 id="nls-title" class="h2">${t('noline.services.title')}</h2>
      <ul class="nl-services__list">
        <li>${t('noline.s1')}</li>
        <li>${t('noline.s2')}</li>
        <li>${t('noline.s3')}</li>
        <li>${t('noline.s4')}</li>
      </ul>
    </section>

    <section class="nl-roster" aria-labelledby="nlr-title">
      <div class="wrap"><h2 id="nlr-title" class="h2">${t('noline.roster.title')}</h2></div>
      <ul class="roster">
        ${roster
          .map(
            (a) => `<li><a class="roster__row" ${ext(a.url)}>
              <span class="roster__name">${a.name}</span>
              <span class="roster__tag mono">${l(a.tag)}</span>
              ${arrow('out')}${extHint()}
            </a></li>`,
          )
          .join('')}
      </ul>
    </section>

    <section class="endcta wrap">
      <h2 class="endcta__title">${t('home.noline.title')}</h2>
      <div>
        <a class="btn btn--solid btn--xl" ${ext(contact.noLine)}>${t('noline.visit')} ${arrow('out')}${extHint()}</a>
        <p class="mono endcta__note">${t('noline.visit.note')}</p>
      </div>
    </section>`;
  },
};
