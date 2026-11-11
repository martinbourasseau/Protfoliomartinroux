import { l, t, type Key } from '../i18n';
import { events as items, type EventStatus } from '../data';
import { arrow, ext, extHint, pageHead, type Page } from '../ui';

const statuses: EventStatus[] = ['organised', 'attended', 'announced'];

export const events: Page = {
  render() {
    const shown = items.filter((e) => e.published);
    const legend = `<dl class="legend" aria-label="${t('events.legend')}">
      ${statuses
        .map(
          (s) => `<div class="legend__item"><dt><span class="status status--${s}">${t(`events.status.${s}` as Key)}</span></dt>
            <dd>${t(`events.status.${s}.d` as Key)}</dd></div>`,
        )
        .join('')}
    </dl>`;

    return `
    ${pageHead('events.title', 'events.intro')}
    <section class="wrap">${legend}</section>
    <section class="wrap evlist">
      ${shown
        .map(
          (e) => `
        <article class="event event--${e.status}" aria-labelledby="ev-${e.id}">
          <div class="event__side">
            <span class="status status--${e.status}">${t(`events.status.${e.status}` as Key)}</span>
            <p class="event__date">${l(e.date)}</p>
            ${e.place ? `<p class="event__place mono">${l(e.place)}</p>` : ''}
          </div>
          <div class="event__main">
            <h2 class="event__name" id="ev-${e.id}">${e.name}</h2>
            <p class="event__role">${l(e.role)}</p>
            ${e.details.length ? `<ul class="event__details">${e.details.map((d) => `<li>${l(d)}</li>`).join('')}</ul>` : ''}
            <p class="event__source mono">${t('events.source')} : ${
              e.source.url ? `<a class="link" ${ext(e.source.url)}>${l(e.source.label)} ${arrow('out')}${extHint()}</a>` : l(e.source.label)
            }</p>
          </div>
        </article>`,
        )
        .join('')}
      <p class="evlist__more mono">${t('events.more')}</p>
    </section>`;
  },
};
