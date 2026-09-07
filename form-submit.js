/* Transport and submission states for the original main forms. No layout changes. */
window.bindLeadForm = (form, options = {}) => {
  if (!form || form.dataset.leadBound) return;
  form.dataset.leadBound = 'true';
  const startedAt = Date.now(), requestId = crypto.randomUUID();
  let sending = false;
  const trap = document.createElement('input');
  trap.name = 'website'; trap.type = 'text'; trap.hidden = true; trap.tabIndex = -1; trap.autocomplete = 'off';
  form.append(trap);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const button = form.querySelector('[type="submit"]');
    if (!button) return;
    let status = form.querySelector('[data-submit-status]');
    if (!status) { status = document.createElement('p'); status.dataset.submitStatus = ''; status.setAttribute('role', 'alert'); status.tabIndex = -1; form.append(status); }
    status.textContent = '';
    sending = true; button.disabled = true; button.textContent = 'Wysyłamy…'; form.setAttribute('aria-busy', 'true');
    const data = {...Object.fromEntries(new FormData(form)), type:options.type || 'preview', startedAt, requestId};
    data.industry = data.business || options.industry || new URLSearchParams(location.search).get('branza') || 'home';
    try { if (JSON.parse(localStorage.getItem('znajdowalni-cookie-consent'))?.analytics) for (const key of ['utm_source','utm_medium','utm_campaign']) data[key] = new URLSearchParams(location.search).get(key) || ''; } catch {}
    try {
      const response = await fetch('/api/preview-request', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(20000)});
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error(result.error || 'Nie udało się potwierdzić wysłania. Spróbuj ponownie.');
      form.innerHTML = '<div class="form-status success" role="status" tabindex="-1"><span>✓</span><h3>Dzięki za zgłoszenie.</h3><p>Odezwemy się na podany e-mail.</p><p data-reference></p></div>';
      form.querySelector('[data-reference]').textContent = 'Numer zgłoszenia: ' + result.id;
      form.querySelector('.form-status').focus();
      document.dispatchEvent(new CustomEvent('znajdowalni:lead', {detail:{formId:form.id,type:data.type,industry:data.industry}}));
    } catch (error) {
      status.textContent = error.name === 'TimeoutError' ? 'Nie możemy jeszcze potwierdzić doręczenia. Spróbuj ponownie — zachowamy numer zgłoszenia.' : error.message === 'Failed to fetch' ? 'Brak połączenia. Spróbuj ponownie lub napisz na kontakt@znajdowalni.pl.' : error.message;
      status.focus(); button.disabled = false; button.textContent = 'Spróbuj wysłać ponownie';
    } finally { sending = false; form.removeAttribute('aria-busy'); }
  });
};
