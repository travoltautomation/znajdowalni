(() => {
  const contact = 'kontakt@znajdowalni.pl';
  const industryByPath = {
    '/strony-dla-fizjoterapeutow': 'fizjoterapia',
    '/strony-dla-gabinetow': 'gabinety',
    '/strony-dla-beauty': 'beauty',
    '/strony-dla-warsztatow': 'warsztaty',
    '/cennik': 'cennik',
  };
  const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const industry = industryByPath[path] || document.body.dataset.industry || 'home';
  const formId = `contact-form-${industry}`;

  const status = (form, type, title, message) => {
    form.innerHTML = `<div class="form-status ${type}" role="${type === 'success' ? 'status' : 'alert'}" aria-live="polite" tabindex="-1"><span>${type === 'success' ? '✓' : '!'}</span><h3>${title}</h3><p>${message}</p></div>`;
    form.querySelector('.form-status')?.focus();
  };

  const renderContact = () => `<section class="contact-section landing-contact" id="kontakt"><div class="wrap contact-grid"><div><p class="eyebrow">KONTAKT</p><h2>Chcesz zobaczyć<br><em>bezpłatny podgląd?</em></h2><p>Napisz, czym zajmuje się Twoja firma. Wrócimy z informacją, czy możemy pomóc.</p><p class="contact-email">Możesz też napisać: <a href="mailto:${contact}">${contact}</a></p></div><form class="contact-form" id="${formId}" novalidate><div class="detail-grid"><label>Imię *<input name="name" autocomplete="given-name" required placeholder="Jak masz na imię?"></label><label>Adres e-mail *<input name="email" type="email" autocomplete="email" required placeholder="twoj@email.pl"></label><label>Strona, Google lub Booksy <small>(opcjonalnie)</small><input name="source" type="url" inputmode="url" placeholder="Wklej link, jeśli masz"></label></div><label>Wiadomość *<textarea name="message" required rows="3" placeholder="Czym zajmuje się Twoja firma i czego potrzebujesz?"></textarea></label><div class="consent-row"><input id="${formId}-consent" name="consent" type="checkbox" required><label for="${formId}-consent">Zgadzam się na kontakt w sprawie tego zapytania.</label><a href="polityka-prywatnosci.html">Szczegóły w polityce prywatności.</a></div><button class="button ink" type="submit">Napisz wiadomość <span>→</span></button></form></div></section>`;

  const mount = () => {
    const footer = document.querySelector('footer');
    if (footer && !document.querySelector('.landing-contact')) footer.insertAdjacentHTML('beforebegin', renderContact());
    const form = document.getElementById(formId);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type=submit]');
      button.disabled = true;
      button.textContent = 'Wysyłamy…';
      try {
        const response = await fetch('/api/preview-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'contact-request', industry, ...Object.fromEntries(new FormData(form)) }) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error);
        document.dispatchEvent(new CustomEvent('znajdowalni:lead', { detail: { formId, type: 'contact', industry } }));
        status(form, 'success', 'Dzięki za wiadomość.', result.demo ? 'Formularz działa w trybie demonstracyjnym. Dane nie zostały przekazane.' : 'Odezwemy się na podany e-mail.');
      } catch {
        status(form, 'demo', 'Nie udało się wysłać wiadomości.', `Spróbuj ponownie lub napisz na ${contact}.`);
      }
    });
    document.querySelectorAll('a.button[href*="#kontakt"], [data-scroll-contact]').forEach((cta) => cta.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('znajdowalni:cta', { detail: { industry, label: cta.textContent.trim(), location: 'landing' } }));
    }));
    if (!document.querySelector('.footer-company')) {
      document.querySelector('.footer-inner')?.insertAdjacentHTML('beforeend', `<p class="footer-company">Krzysztof Stramski Marketing Solutions · NIP 8982136359 · REGON 527734808<br><a href="mailto:${contact}">${contact}</a></p>`);
    }
  };
  document.addEventListener('DOMContentLoaded', mount);
})();
