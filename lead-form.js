(() => {
  const form=document.querySelector('.lead-form'); if (!form) return;
  let startedAt=Date.now(), requestId=crypto.randomUUID(), sending=false;
  const source=form.elements.source, fields=form.querySelector('#business-fields'), toggle=form.querySelector('.identity-toggle'), status=form.querySelector('.lead-status'), button=form.querySelector('[type=submit]');
  function identify(noLink) {fields.hidden=!noLink;fields.disabled=!noLink;source.disabled=noLink;toggle.setAttribute('aria-expanded',String(noLink));toggle.textContent=noLink?'Mam jednak link do firmy':'Nie mam linku — podam nazwę firmy';(noLink?form.elements.company:source).focus();}
  toggle.addEventListener('click',()=>identify(fields.hidden));
  form.addEventListener('input',()=>{source.setCustomValidity('');form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));});
  form.addEventListener('submit',async event=>{
    event.preventDefault(); if(sending) return;
    status.textContent='';status.classList.remove('is-error');
    if (!source.disabled && !source.value.trim()) source.setCustomValidity('Wklej link albo wybierz opcję podania nazwy firmy.');
    if(!form.reportValidity()) return;
    sending=true;button.disabled=true;button.textContent='Wysyłamy…';form.setAttribute('aria-busy','true');
    const data={...Object.fromEntries(new FormData(form)),startedAt,requestId,industry:document.body.dataset.industry||new URLSearchParams(location.search).get('branza')||'home'};
    try {const c=JSON.parse(localStorage.getItem('znajdowalni-cookie-consent'));if(c?.analytics) for(const key of ['utm_source','utm_medium','utm_campaign']) data[key]=new URLSearchParams(location.search).get(key)||'';} catch {}
    try {
      const response=await fetch('/api/preview-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(20000)});
      const result=await response.json();
      if(!response.ok||result.ok!==true) {if(result.field && form.elements[result.field]) form.elements[result.field].setAttribute('aria-invalid','true');throw new Error(result.error||'Nie udało się potwierdzić wysłania.');}
      form.innerHTML='<div class="lead-success" role="status" tabindex="-1"><span class="success-mark" aria-hidden="true">✓</span><h3>Dziękujemy. Mamy Twoje zgłoszenie.</h3><p>Sprawdzimy informacje o firmie i odezwiemy się na podany e-mail. Przygotujemy jeden prywatny kierunek: pierwszy ekran, pierwszą sekcję i widok mobilny.</p><p>Jeśli kierunek będzie Ci odpowiadał, wspólnie ustalimy zakres i wybierzemy Standard lub Pro.</p><p class="field-hint lead-reference"></p></div>';
      form.querySelector('.lead-reference').textContent='Numer zgłoszenia: '+result.id;
      form.querySelector('.lead-success').focus();
      document.dispatchEvent(new CustomEvent('znajdowalni:lead',{detail:{formId:form.id,type:'preview',industry:data.industry}}));
    } catch(error) {
      status.textContent=error.name==='TimeoutError'?'Wysyłka trwała zbyt długo. Nie możemy potwierdzić doręczenia. Spróbuj ponownie lub napisz na kontakt@znajdowalni.pl.':(error.message==='Failed to fetch'?'Brak połączenia. Sprawdź internet i spróbuj ponownie.':error.message);
      status.classList.add('is-error');status.focus();button.disabled=false;button.textContent='Spróbuj wysłać ponownie';
    } finally {sending=false;form.removeAttribute('aria-busy');}
  });
})();
