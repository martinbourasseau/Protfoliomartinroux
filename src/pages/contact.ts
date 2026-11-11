import { t } from '../i18n';
import { contact as c } from '../data';
import { arrow, ext, extHint, stage, type Page } from '../ui';

export const contact: Page = {
  render() {
    return `
    <header class="ct-top">
      <h1 class="ct-top__title">${t('contact.title')}</h1>
      ${stage()}
      <p class="ct-top__intro">${t('contact.intro')}</p>
    </header>

    <section class="wrap ct-grid">
      <ul class="ct-list">
        <li class="ct-row">
          <span class="ct-row__label mono">${t('contact.email')}</span>
          <a class="ct-row__value" href="mailto:${c.email}">${c.email}</a>
          <button type="button" class="copy mono" data-copy="${c.email}">${t('contact.copy')}</button>
        </li>
        <li class="ct-row">
          <span class="ct-row__label mono">${t('contact.phone')}</span>
          <a class="ct-row__value" href="tel:${c.phoneHref}">${c.phoneDisplay}</a>
          <button type="button" class="copy mono" data-copy="${c.phoneDisplay}">${t('contact.copy')}</button>
        </li>
        <li class="ct-row">
          <span class="ct-row__label mono">${t('contact.linkedin')}</span>
          <a class="ct-row__value" ${ext(c.linkedin)}>${t('contact.linkedin.cta')} ${arrow('out')}${extHint()}</a>
        </li>
        <li class="ct-row">
          <span class="ct-row__label mono">${t('contact.noline')}</span>
          <a class="ct-row__value" ${ext(c.noLine)}>no-line.fr ${arrow('out')}${extHint()}</a>
        </li>
        <li class="ct-row ct-row--plain"><span class="mono">${t('contact.place')}</span></li>
      </ul>

      <form class="form" id="contact-form" novalidate>
        <h2 class="h3">${t('contact.form.title')}</h2>
        <div class="field"><label for="cf-name">${t('contact.form.name')}</label><input id="cf-name" name="name" type="text" autocomplete="name" required /></div>
        <div class="field"><label for="cf-email">${t('contact.form.email')}</label><input id="cf-email" name="email" type="email" autocomplete="email" /></div>
        <div class="field"><label for="cf-subject">${t('contact.form.subject')}</label><input id="cf-subject" name="subject" type="text" /></div>
        <div class="field"><label for="cf-message">${t('contact.form.message')}</label><textarea id="cf-message" name="message" rows="5" required></textarea></div>
        <p class="form__error" role="alert" hidden data-error>${t('contact.form.error')}</p>
        <button type="submit" class="btn btn--solid">${t('contact.form.submit')} ${arrow('out')}</button>
        <p class="form__note mono">${t('contact.form.note')}</p>
      </form>
    </section>`;
  },

  mount(root) {
    const form = root.querySelector<HTMLFormElement>('#contact-form');
    const error = root.querySelector<HTMLElement>('[data-error]');

    // Pas de serveur d'envoi : le formulaire prépare un e-mail dans la messagerie du visiteur.
    const onSubmit = (e: Event): void => {
      e.preventDefault();
      if (!form) return;
      const data = new FormData(form);
      const name = String(data.get('name') ?? '').trim();
      const email = String(data.get('email') ?? '').trim();
      const subject = String(data.get('subject') ?? '').trim();
      const message = String(data.get('message') ?? '').trim();
      if (!name || !message) {
        if (error) error.hidden = false;
        (name ? form.querySelector<HTMLElement>('#cf-message') : form.querySelector<HTMLElement>('#cf-name'))?.focus();
        return;
      }
      if (error) error.hidden = true;
      const body = `${message}\n\n${name}${email ? `\n${email}` : ''}`;
      window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(subject || name)}&body=${encodeURIComponent(body)}`;
    };

    const onClick = (e: Event): void => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
      if (!btn) return;
      navigator.clipboard
        ?.writeText(btn.dataset.copy ?? '')
        .then(() => {
          btn.textContent = t('contact.copied');
          window.setTimeout(() => (btn.textContent = t('contact.copy')), 1600);
        })
        .catch(() => {
          /* presse-papiers refusé : l'adresse reste lisible à l'écran */
        });
    };

    form?.addEventListener('submit', onSubmit);
    root.addEventListener('click', onClick);
    return () => {
      form?.removeEventListener('submit', onSubmit);
      root.removeEventListener('click', onClick);
    };
  },
};
