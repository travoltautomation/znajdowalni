const fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const form=require('../lib/form');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
const preview=process.env.VERCEL_ENV!=='production';
fs.mkdirSync(out,{recursive:true});
// Only publish website assets. Operational data, docs, code and credentials stay out.
for(const name of fs.readdirSync(root)) if(/\.(css|js|html)$/.test(name)) fs.copyFileSync(path.join(root,name),path.join(out,name));
for(const name of ['assets','szablony']) fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true,filter:src=>!src.endsWith('.md')});
const index=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://znajdowalni.pl/',runScripts:'outside-only'});
index.window.eval(fs.readFileSync(path.join(root,'content.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8')+'\ninit();');
const d=index.window.document;
d.querySelector('#hero-preview').outerHTML='<div class="hero-actions"><a class="button ink" href="#kontakt">Zobacz bezpłatny kierunek <span aria-hidden="true">→</span></a><p class="form-note">Wystarczy link do Google, Booksy lub profilu firmy. Nie masz linku? Podasz nazwę i miejscowość.</p></div>';
d.querySelector('.hero-art').insertAdjacentHTML('beforeend','<p class="demo-caption">Ilustracja przykładowego układu strony</p>');
d.querySelector('.hero-art').setAttribute('aria-label','Przykładowy układ strony fizjoterapeuty z widoczną ofertą i rezerwacją.');
d.querySelector('.hero-reassurance').textContent='Bezpłatnie i prywatnie. Najpierw oglądasz kierunek, potem decydujesz o współpracy.';
// Remove repeated persuasion sections; keep offer, real work, process, owner and examples.
d.querySelector('.positioning')?.remove();d.querySelector('.compare')?.remove();
for(const node of d.querySelectorAll('.nav-cta,.mobile-nav-cta,.mobile-cta')) node.innerHTML='Bezpłatny kierunek <span aria-hidden="true">→</span>';
const mainHTML=index.serialize();index.window.close();
fs.writeFileSync(path.join(out,'index.html'),mainHTML);
const pages=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,ent.name);if(ent.isDirectory())walk(full);else if(ent.name.endsWith('.html'))pages.push(full);}}walk(out);
for(const file of pages){
  const rel=path.relative(out,file).replaceAll('\\','/'),dom=new JSDOM(fs.readFileSync(file,'utf8')),doc=dom.window.document;
  const demo=rel.startsWith('szablony/')||rel.startsWith('assets/');
  const legal=/^(polityka-prywatnosci|pliki-cookie|404)\.html$/.test(rel);
  const canonical='https://znajdowalni.pl/'+(rel==='index.html'?'':rel.replace(/\.html$/,''));
  let canon=doc.querySelector('link[rel=canonical]');if(!canon){canon=doc.createElement('link');canon.rel='canonical';doc.head.append(canon);}canon.href=canonical;
  let robots=doc.querySelector('meta[name=robots]');if(!robots){robots=doc.createElement('meta');robots.name='robots';doc.head.append(robots);}robots.content=preview||demo||legal?'noindex, nofollow':'index, follow';
  for(const el of doc.querySelectorAll('script[src]')) if(/^(app|content|landing)\.js/.test(el.getAttribute('src')))el.remove();
  const style=doc.createElement('link');style.rel='stylesheet';style.href='/journey.css';doc.head.append(style);
  if(preview){doc.body.dataset.preview='true';doc.body.insertAdjacentHTML('afterbegin','<div class="preview-notice">Podgląd do akceptacji · formularz wysyła wiadomości oznaczone TEST</div>');}
  for(const a of doc.querySelectorAll('a[href]')){
    let href=a.getAttribute('href');
    if(!/^(https?:|mailto:|tel:|#)/.test(href))href=href.replace(/^index\.html/,'/').replace(/\.\.\/index\.html/,'../').replace(/\.html(?=[?#]|$)/,'');
    if(href==='')href='/';a.setAttribute('href',href);
  }
  if(!demo&&!legal){
    let contact=doc.querySelector('#kontakt');
    if(!contact){contact=doc.createElement('section');contact.id='kontakt';(doc.querySelector('main')||doc.body).append(contact);}
    contact.className='contact-section';
    contact.innerHTML=`<div class="wrap contact-grid"><div><p class="eyebrow">TWÓJ PIERWSZY KROK</p><h2>Zobacz, jak może wyglądać <em>Twoja strona.</em></h2><p>Podaj namiar na firmę. Sprawdzimy dostępne informacje i wrócimy z prywatną propozycją.</p><ol class="journey-list"><li><b>1. Podajesz link i e-mail</b>Bez przepisywania usług, cennika i całego briefu.</li><li><b>2. Oglądasz bezpłatny kierunek</b>Pierwszy ekran, pierwsza sekcja i widok na telefonie.</li><li><b>3. Decydujesz, czy idziemy dalej</b>Dopiero wtedy wybieramy pakiet i zbieramy resztę materiałów.</li></ol><p class="contact-email">Wolisz najpierw zapytać?<br><a href="mailto:kontakt@znajdowalni.pl">kontakt@znajdowalni.pl</a></p></div>${form()}</div>`;
    for(const a of doc.querySelectorAll('a[href]'))if(/#kontakt$/.test(a.getAttribute('href')))a.setAttribute('href','#kontakt');
    doc.body.dataset.industry=rel==='index.html'?'home':rel.replace('strony-dla-','').replace('.html','');
    doc.body.insertAdjacentHTML('beforeend','<script src="/lead-form.js" defer></script><script src="/ui.js" defer></script>');
  }
  const footer=doc.querySelector('footer');
  for(const table of doc.querySelectorAll('.plan-table-wrap')){table.tabIndex=0;table.setAttribute('role','region');table.setAttribute('aria-label','Porównanie pakietów — przewiń tabelę w poziomie');}
  if(footer&&!demo&&!footer.querySelector('.cookie-settings'))footer.insertAdjacentHTML('beforeend','<button type="button" class="cookie-settings link-like">Ustawienia cookies</button>');
  if(!doc.querySelector('meta[name=description]')){const meta=doc.createElement('meta');meta.name='description';meta.content=doc.querySelector('h1')?.textContent||'Znajdowalni — strony lokalnych firm';doc.head.append(meta);}
  // Demo contact details must not route visitors to an unrelated real number.
  if(demo){for(const a of doc.querySelectorAll('a[href^="tel:"],a[href^="mailto:"]')){a.removeAttribute('href');a.textContent='Dane kontaktowe — przykład';}for(const iframe of doc.querySelectorAll('iframe')){const p=doc.createElement('p');p.textContent='Miejsce na mapę Twojej firmy — dane potwierdzamy przed publikacją.';iframe.replaceWith(p);}}
  fs.writeFileSync(file,dom.serialize());dom.window.close();
}
fs.writeFileSync(path.join(out,'robots.txt'),preview?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /szablony/\nDisallow: /assets/brand/\nSitemap: https://znajdowalni.pl/sitemap.xml\n');
const routes=['','cennik','strony-dla-fizjoterapeutow','strony-dla-gabinetow','strony-dla-beauty','strony-dla-warsztatow'];
fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${preview?'':routes.map(r=>`<url><loc>https://znajdowalni.pl/${r}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${pages.length} pages for ${preview?'PREVIEW (noindex)':'PRODUCTION'}.`);

