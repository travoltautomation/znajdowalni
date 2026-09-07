const fs=require('node:fs'),path=require('node:path');
const root=__dirname,config=JSON.parse(fs.readFileSync(path.join(root,'site.json'))),content=JSON.parse(fs.readFileSync(path.join(root,'content.json')));
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=s=>{try{const u=new URL(s);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?esc(u.href):'';}catch{return '';}};
const production=process.env.VERCEL_ENV==='production';
if(production&&(!config.approved||!config.domain||!config.email||!config.privacyText||JSON.stringify({config,content}).includes('[DO POTWIERDZENIA]')))throw new Error('Publikacja zablokowana: zatwierdź dane, domenę, politykę i treści.');
const out=path.join(root,'dist');fs.mkdirSync(out,{recursive:true});
const theme=['calm','editorial','workshop'].includes(config.theme)?config.theme:'calm';
const domain=url(config.domain),phone=/^\+?[0-9 ()-]{7,22}$/.test(config.phone||'')?config.phone:'';
const booking=url(config.bookingUrl),map=url(config.mapUrl),image=url(config.imageUrl);
const cta=booking?`<a class="button" href="${booking}" rel="noopener noreferrer">${esc(config.cta||'Umów termin')} →</a>`:phone?`<a class="button" href="tel:${phone.replace(/[^+0-9]/g,'')}">${esc(config.cta||'Zadzwoń')} →</a>`:'<a class="button" href="#kontakt">Napisz do nas →</a>';
const blocks={
  services:`<section id="uslugi"><p class="eyebrow">OFERTA</p><h2>${esc(content.servicesTitle||'W czym możemy pomóc')}</h2><div class="services">${(content.services||[]).map(s=>`<article><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p>${s.price?`<p class="price">${esc(s.price)}</p>`:''}</article>`).join('')}</div></section>`,
  about:`<section id="o-nas" class="about"><p class="eyebrow">POZNAJ NAS</p><h2>${esc(content.aboutTitle)}</h2><p>${esc(content.about)}</p></section>`,
  trust:(content.trust||[]).length?`<section><h2>${esc(content.trustTitle||'Dlaczego warto nas poznać')}</h2>${content.trust.map(item=>`<p>${esc(item)}</p>`).join('')}</section>`:'',
  faq:(content.faq||[]).length?`<section id="faq"><h2>Przed pierwszym kontaktem</h2>${content.faq.map(f=>`<details><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`).join('')}</section>`:'',
  news:(content.news||[]).length?`<section id="aktualnosci"><h2>Aktualności</h2>${content.news.map(n=>`<article><time>${esc(n.date)}</time><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p></article>`).join('')}</section>`:'',
  contact:`<section id="kontakt"><p class="eyebrow">KONTAKT</p><h2>${esc(config.name)}</h2><p>${esc(config.address)} ${esc(config.city)}</p><p>${esc(content.hours)}</p>${phone?`<p><a href="tel:${phone.replace(/[^+0-9]/g,'')}">${esc(phone)}</a></p>`:''}${config.email?`<p><a href="mailto:${esc(config.email)}">${esc(config.email)}</a></p>`:''}${map?`<p><a href="${map}" rel="noopener noreferrer">Pokaż dojazd w Mapach Google →</a></p>`:''}${booking?cta:''}<form id="contact-form"><label>Twój e-mail *<input name="email" type="email" autocomplete="email" maxlength="254" required></label><label>Wiadomość *<textarea name="message" rows="4" maxlength="3000" required></textarea></label><div class="trap" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div><label class="check"><input name="consent" type="checkbox" required> Proszę o odpowiedź na moje zapytanie. *</label><p><a href="/polityka-prywatnosci.html">Polityka prywatności</a>. Nie podawaj danych wrażliwych.</p><p role="status" tabindex="-1"></p><button class="button" type="submit">Wyślij wiadomość →</button></form></section>`
};
const schema={'@context':'https://schema.org','@type':'LocalBusiness',name:config.name,url:config.domain,telephone:phone||undefined,address:config.address?{'@type':'PostalAddress',streetAddress:config.address,addressLocality:config.city,addressCountry:'PL'}:undefined};
const canonical=domain?`<link rel="canonical" href="${domain}">`:'';
const shell=(title,body)=>`<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${production?'index,follow':'noindex,nofollow'}"><title>${esc(title)}</title><meta name="description" content="${esc(content.description)}">${canonical}<link rel="stylesheet" href="/style.css"></head><body class="${theme}"><a class="skip" href="#main">Przejdź do treści</a>${production?'':'<aside class="draft">Prywatny kierunek do akceptacji · informacje wymagają potwierdzenia</aside>'}<header><a class="brand" href="/">${esc(config.name)}</a><nav><a href="/#uslugi">Oferta</a><a href="/#kontakt">Kontakt</a></nav></header><main id="main">${body}</main><footer>© ${new Date().getFullYear()} ${esc(config.name)} · <a href="/polityka-prywatnosci.html">Prywatność</a></footer></body></html>`;
const hero=`<section class="hero"><div><p class="eyebrow">${esc(config.city)} · ${esc(config.industry)}</p><h1>${esc(content.headline)}</h1><p class="intro">${esc(content.description)}</p>${cta}</div>${image?`<img src="${image}" alt="${esc(config.imageAlt)}" width="900" height="1000">`:''}</section>`;
const sections=(config.sections||['services','about','faq','contact']).filter((s,i,a)=>a.indexOf(s)===i&&blocks[s]);
let html=shell(config.name+' — '+config.city,hero+sections.map(s=>blocks[s]).join(''));
if(production)html=html.replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head>`);
html=html.replace('</body>','<script src="/contact.js" defer></script></body>');
fs.writeFileSync(path.join(out,'index.html'),html);
fs.writeFileSync(path.join(out,'polityka-prywatnosci.html'),shell('Polityka prywatności',`<section><h1>Polityka prywatności</h1><p>${esc(config.privacyText||'[DO POTWIERDZENIA] Administrator, cele, podstawy, odbiorcy, retencja i prawa osoby. Uzupełnij przed zbieraniem prawdziwych zapytań.')}</p></section>`).replace('content="index,follow"','content="noindex,follow"'));
fs.writeFileSync(path.join(out,'404.html'),shell('Nie znaleziono strony','<section><h1>Nie ma takiej strony</h1><a href="/">Wróć na stronę główną</a></section>').replace('content="index,follow"','content="noindex,follow"'));
for(const name of ['style.css','contact.js'])fs.copyFileSync(path.join(root,name),path.join(out,name));
fs.writeFileSync(path.join(out,'robots.txt'),production?`User-agent: *\nAllow: /\nSitemap: ${config.domain.replace(/\/$/,'')}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production?`<url><loc>${domain}</loc></url>`:''}</urlset>`);
console.log(`Built ${config.name}; ${production?'production':'private direction'}; theme ${theme}`);
