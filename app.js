const q = (selector, scope = document) => scope.querySelector(selector);
const previewForm = (id, final = false) => `<form class="preview-form" id="${id}" data-compact-preview novalidate>
  <div class="preview-start"><label class="sr-only" for="${id}-source">Link do obecnej strony</label><input id="${id}-source" name="source" type="url" inputmode="url" placeholder="Wklej link do obecnej strony" required><button type="button" class="button ink" data-next>Zobacz bezpłatny podgląd <span>→</span></button></div>
  <div class="form-details" hidden></div>
  <button class="text-action" type="button" data-no-site>Nie masz jeszcze strony? Wklej wizytówkę Google, profil Booksy lub informacje o firmie.</button>
  <p class="form-note">Prywatny podgląd. Bez opłat. Niczego nie publikujemy bez Twojej zgody.</p></form>`;

const fields = (noSite) => `<div class="detail-grid"><label>Nazwa firmy<input name="company" required placeholder="np. Klinika Ruchu"></label><label>Branża<input name="business" required placeholder="np. fizjoterapia"></label><label>Miasto<input name="city" required placeholder="np. Kraków"></label>${noSite ? '<label>Wizytówka Google, Booksy lub profil <small>(opcjonalnie)</small><input name="source" placeholder="wklej link, jeśli masz"></label>' : ''}</div>`;

function openForm(form, noSite = false) {
  const details = q('.form-details', form); const start = q('.preview-start', form);
  const source = (q('[name="source"]', start)?.value || "").trim();
  start.hidden = true; q('[name="source"]', start).disabled = true; details.hidden = false;
  details.innerHTML = `${!noSite && source ? `<input type="hidden" name="source" value="${source.replace(/"/g, '&quot;')}">` : ''}${fields(noSite)}<div class="detail-grid"><label>E-mail<input name="email" type="email" required placeholder="twoj@email.pl"></label><label>Telefon <small>(opcjonalnie)</small><input name="phone" type="tel"></label></div><label>Co chcemy poprawić w pierwszej kolejności? <small>(opcjonalnie)</small><textarea name="message" rows="3" placeholder="np. klienci nie mogą znaleźć cennika, nikt nie dzwoni z telefonu"></textarea></label><div class="consent"><label><input name="consent" type="checkbox" required><span>Zgadzam się na kontakt w sprawie prywatnego podglądu.</span></label><a href="/polityka-prywatnosci">Polityka prywatności</a></div><button class="button coral" type="submit">Wyślij prośbę o podgląd <span>→</span></button><button class="back" type="button" data-back>← Wróć</button>`;
  q('input', details)?.focus();
}

function showStatus(form, type, title, text) {
  form.innerHTML = `<div class="form-status ${type}" role="${type === 'success' ? 'status' : 'alert'}" aria-live="${type === 'success' ? 'polite' : 'assertive'}" tabindex="-1"><span>${type === 'success' ? '✓' : '!'}</span><h3>${title}</h3><p>${text}</p></div>`;
  form.querySelector('.form-status')?.focus();
}

async function sendPreview(data) {
  const response = await fetch(SITE.contact.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Nie udało się wysłać formularza.');
  return result;
}

function initForm(form) {
  form.addEventListener('click', (event) => {
        if (event.target.closest('[data-next]')) { const input = q('[name="source"]', form); if (input && !input.checkValidity()) { input.reportValidity(); return; } openForm(form, false); return; }
    if (event.target.closest('[data-no-site]')) { openForm(form, true); return; }
    if (event.target.closest('[data-back]')) { q('.preview-start', form).hidden = false; q('[name="source"]', q('.preview-start', form)).disabled = false; q('.form-details', form).hidden = true; }
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const button = q('[type="submit"]', form); button.disabled = true; button.textContent = 'Wysyłamy…';
    try { const result = await sendPreview(Object.fromEntries(new FormData(form))); showStatus(form, 'success', 'Dzięki. Sprawdzimy Twoją firmę i przygotujemy prywatny podgląd.', result.demo ? 'Formularz działa obecnie w trybie demonstracyjnym. Dane nie zostały jeszcze przekazane. Skonfigurujemy wysyłkę przed publikacją.' : 'Odezwemy się na podany e-mail. To nie jest automatyczna publikacja. To tylko pierwszy krok.'); }
    catch (error) { showStatus(form, 'demo', 'Formularz jest gotowy, ale działa jeszcze w trybie demonstracyjnym.', 'Nie wysłaliśmy Twoich danych, ponieważ produkcyjna wysyłka nie została jeszcze skonfigurowana. Napisz na ' + SITE.contact.email + '.'); }
  });
}

function initContactForm(form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const button = q('[type="submit"]', form); button.disabled = true; button.textContent = 'Wysyłamy…';
    try { const result = await sendPreview({ type: 'contact-request', ...Object.fromEntries(new FormData(form)) }); showStatus(form, 'success', 'Dzięki za wiadomość.', result.demo ? 'Formularz działa obecnie w trybie demonstracyjnym. Dane nie zostały jeszcze przekazane. Skonfigurujemy wysyłkę przed publikacją.' : 'Odezwemy się na podany e-mail.'); }
    catch { showStatus(form, 'demo', 'Formularz jest gotowy, ale działa jeszcze w trybie demonstracyjnym.', 'Nie wysłaliśmy Twoich danych, ponieważ produkcyjna wysyłka nie została jeszcze skonfigurowana. Napisz na ' + SITE.contact.email + '.'); }
  });
}

function init() {
  const evoHeadline = q('.evo-headline');
  if (evoHeadline && evoHeadline.tagName === 'H3') {
    const replacement = document.createElement('p');
    replacement.className = evoHeadline.className;
    replacement.innerHTML = evoHeadline.innerHTML;
    evoHeadline.replaceWith(replacement);
  }

  const industry = new URLSearchParams(window.location.search).get('branza');
  if (industry) {
    const contactMessage = q('#contact-message');
    const contactSource = q('#contact-source');
    if (contactMessage && !contactMessage.value) contactMessage.value = `Interesuje mnie strona dla branży: ${industry}.`;
    if (contactSource && !contactSource.value) contactSource.value = `Landing branżowy: ${industry}`;
  }

  document.querySelectorAll('.preview-form').forEach(initForm);
  const contactForm = q('#contact-form');
  if (contactForm) initContactForm(contactForm);

  document.querySelectorAll('[data-scroll-preview],[data-scroll-contact]').forEach(button => {
    button.addEventListener('click', () => {
      q('#kontakt')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => q('#contact-name')?.focus(), 450);
    });
  });
}
document.addEventListener('DOMContentLoaded', init);
