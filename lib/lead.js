const { randomUUID } = require('node:crypto');
const EMAIL = /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/;
const escape = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function publicUrl(value) {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || !url.hostname.includes('.') || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.)/i.test(url.hostname)) return null;
    return url.href;
  } catch { return null; }
}
function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {error:'Nieprawidłowe dane formularza.'};
  const limits = {name:150,phone:50,type:30,email:254,source:1500,company:150,city:100,message:3000,website:200,industry:100,requestId:36,utm_source:100,utm_medium:100,utm_campaign:200};
  const data = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (body[key] != null && typeof body[key] !== 'string') return {error:'Nieprawidłowy format danych.'};
    const value = (body[key] || '').trim();
    if (value.length > limit || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) return {error:'Podana treść jest zbyt długa lub nieprawidłowa.'};
    data[key] = value;
  }
  if (!EMAIL.test(data.email) || /[\r\n]/.test(data.email)) return {error:'Wpisz poprawny adres e-mail.',field:'email'};
  if (![true,'on'].includes(body.consent)) return {error:'Potwierdź zgodę na kontakt w sprawie zgłoszenia.',field:'consent'};
  if (data.type === 'contact-request' && (!data.name || !data.message)) return {error:'Podaj imię i wiadomość.',field:!data.name?'name':'message'};
  if (data.source) {
    const normalized = publicUrl(data.source);
    if (!normalized) return {error:'Wklej poprawny link do strony lub profilu firmy.',field:'source'};
    data.source = normalized;
  } else if (data.type !== 'contact-request' && (!data.company || !data.city)) return {error:'Podaj link albo nazwę firmy i miejscowość.',field:!data.company?'company':'city'};
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId)) data.requestId = randomUUID();
  const elapsed = Date.now() - Number(body.startedAt);
  if (!Number.isFinite(elapsed) || elapsed < 1500 || elapsed > 86400000) return {error:'Odśwież stronę i spróbuj ponownie.'};
  return {data};
}
function record(data, test = false) {
  return {schemaVersion:1,id:data.requestId,status:'new',test,submittedAt:new Date().toISOString(),contact:{email:data.email,name:data.name,phone:data.phone},business:{source:data.source,company:data.company,city:data.city,industry:data.industry},message:data.message,campaign:{source:data.utm_source,medium:data.utm_medium,name:data.utm_campaign},consent:{contact:true,policyVersion:'2026-09-07'},research:{sources:[],facts:[],toConfirm:[],direction:null}};
}
function message(lead) {
  const title = `${lead.test ? '[TEST] ' : ''}[Znajdowalni] Nowy kierunek · ${lead.business.company || 'firma z linku'} · ${lead.id.slice(0,8)}`.replace(/[\r\n]/g,' ');
  const rows = [['Numer zgłoszenia',lead.id],['Imię',lead.contact.name],['E-mail',lead.contact.email],['Telefon',lead.contact.phone],['Firma',lead.business.company],['Miejscowość',lead.business.city],['Link do firmy',lead.business.source],['Branża',lead.business.industry],['Dodatkowe informacje',lead.message],['Kampania',Object.values(lead.campaign).filter(Boolean).join(' / ')],['Zgoda na kontakt',`${lead.submittedAt}; polityka ${lead.consent.policyVersion}`]].filter(([,value])=>value);
  const next = 'Następny krok: sprawdź źródła, zapisz potwierdzone fakty i pytania, przygotuj jeden prywatny kierunek (pierwszy ekran, pierwsza sekcja, widok mobilny). Nie publikuj bez akceptacji klienta.';
  return {title,text:rows.map(([k,v])=>`${k}: ${v}`).join('\n')+'\n\n'+next,html:`<!doctype html><html lang="pl"><body style="font:16px/1.6 Arial,sans-serif;color:#121416;background:#f7f3ea;padding:24px"><h1 style="font-size:24px">${escape(title)}</h1><table>${rows.map(([k,v])=>`<tr><th align="left" style="padding:8px 20px 8px 0;vertical-align:top">${escape(k)}</th><td style="white-space:pre-wrap">${k==='Link do firmy'?`<a href="${escape(v)}">${escape(v)}</a>`:escape(v)}</td></tr>`).join('')}</table><p>${escape(next)}</p><p>Odpowiedz na tę wiadomość, aby napisać do zgłaszającego. Załącznik JSON służy do utworzenia projektu klienta.</p></body></html>`};
}
module.exports = {validate,record,message,escape,publicUrl,EMAIL};
