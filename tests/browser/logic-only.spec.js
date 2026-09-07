const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const candidate='http://127.0.0.1:4175',main='http://127.0.0.1:4174';
const views=[{width:1440,height:1000},{width:375,height:667},{width:390,height:844}];
for(const viewport of views){
 test.describe(`${viewport.width}x${viewport.height}`,()=>{
  test.use({viewport});
  test('visual parity with main outside requested footer',async({browser},info)=>{
   const context=await browser.newContext({viewport,reducedMotion:'reduce'});
   const original=await context.newPage(),updated=await context.newPage();
   for(const [page,url] of [[original,main],[updated,candidate]]){
    await page.goto(url);await page.evaluate(()=>document.fonts.ready);
    await expect(page.locator('#hero-preview-source')).toBeVisible();
   }
   const dimensions=await Promise.all([original,updated].map(page=>page.evaluate(()=>({width:document.documentElement.scrollWidth,footer:document.querySelector('#footer').getBoundingClientRect().top+scrollY,sections:[...document.querySelectorAll('main section')].map(el=>({class:el.className,top:el.getBoundingClientRect().top+scrollY,height:el.getBoundingClientRect().height}))}))));
   expect(dimensions[1]).toEqual(dimensions[0]);
   const options={clip:{x:0,y:0,width:viewport.width,height:Math.floor(dimensions[0].footer)},animations:'disabled'};
   const baseline=await original.screenshot(options);
   fs.mkdirSync(require('path').dirname(info.snapshotPath('main-content.png')),{recursive:true});fs.writeFileSync(info.snapshotPath('main-content.png'),baseline);
   expect(await updated.screenshot(options)).toMatchSnapshot('main-content.png',{maxDiffPixels:0,threshold:0});
   await updated.screenshot({path:info.outputPath('hero.png'),animations:'disabled'});
   await updated.locator('#footer').scrollIntoViewIfNeeded();
   const cookies=updated.getByRole('button',{name:'Tylko niezbędne',exact:true});
   if(await cookies.isVisible())await cookies.click();
   await updated.locator('#footer').screenshot({path:info.outputPath('footer.png'),style:'#top,.mobile-cta{visibility:hidden}'});
   await context.close();
  });
  for(const [label,target] of [['Dla kogo','#dla-kogo'],['Branże','#przyklady'],['Jak to działa','#jak-to-dziala'],['Cennik','.pricing .plans'],['FAQ','#faq']]){
   test(`navigation: ${label}`,async({page})=>{
    await page.goto(candidate);await page.evaluate(()=>document.fonts.ready);
    if(viewport.width<760)await page.getByRole('button',{name:'Otwórz menu',exact:true}).click();
    const menu=viewport.width<760?page.locator('#mobile-nav nav'):page.locator('#top .nav > nav');
    await menu.getByRole('link',{name:label,exact:true}).click();
    if(viewport.width<760){await expect(page.locator('#mobile-nav')).toBeHidden();await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded','false');}
    await expect.poll(()=>page.evaluate(selector=>{const rect=document.querySelector(selector).getBoundingClientRect(),header=document.querySelector('#top').getBoundingClientRect();return Math.round(rect.top-header.bottom);},target),{timeout:5000}).toBeGreaterThanOrEqual(0);
    await expect.poll(()=>page.evaluate(selector=>Math.round(document.querySelector(selector).getBoundingClientRect().top-document.querySelector('#top').getBoundingClientRect().bottom),target)).toBeLessThanOrEqual(32);
   });
  }
 });
}
test('main Hero: retained error data, one request in flight, stable request ID and success',async({page})=>{
 await page.goto(candidate);const form=page.locator('#hero-preview');
 await form.locator('[name=source]').fill('https://example.com');await form.locator('[data-next]').click();
 for(const [field,value]of Object.entries({company:'TEST Firma',business:'TEST usługi',city:'Warszawa',email:'test@example.com',message:'TEST zachowania danych'}))await form.locator(`[name=${field}]`).fill(value);
 await form.locator('[name=consent]').check();
 const requests=[];let release;
 await page.route('**/api/preview-request',async route=>{requests.push(route.request().postDataJSON());if(requests.length===1){await new Promise(resolve=>release=resolve);await route.fulfill({status:502,json:{error:'TEST błąd dostawcy'}});}else await route.fulfill({json:{ok:true,id:requests[0].requestId}});});
 await form.locator('[type=submit]').click();await expect(form.locator('[type=submit]')).toBeDisabled();release();
 await expect(form.getByRole('alert')).toHaveText('TEST błąd dostawcy');await expect(form.locator('[name=email]')).toHaveValue('test@example.com');await expect(form.locator('[name=message]')).toHaveValue('TEST zachowania danych');
 await form.locator('[type=submit]').click();await expect(form.getByRole('status')).toContainText(requests[0].requestId);
 expect(requests).toHaveLength(2);expect(requests[1].requestId).toBe(requests[0].requestId);expect(requests[0].startedAt).toBeTruthy();expect(requests[0].website).toBe('');
});
test('existing contact payload is accepted without a company URL',async({page})=>{
 await page.goto(candidate);const form=page.locator('#contact-form');
 await form.locator('[name=name]').fill('TEST');await form.locator('[name=email]').fill('test@example.com');await form.locator('[name=message]').fill('TEST kontakt bez linku');await form.locator('[name=consent]').check();
 await page.waitForTimeout(1600);await form.locator('[type=submit]').click();
 await expect(form.getByRole('alert')).toContainText('Nie udało się potwierdzić wysłania');
 await expect(form.locator('[name=name]')).toHaveValue('TEST');
});
test('industry forms use the same validated contact endpoint',async({page})=>{
 for(const route of ['strony-dla-beauty','strony-dla-fizjoterapeutow','strony-dla-gabinetow','strony-dla-warsztatow']){
  await page.goto(`${candidate}/${route}`);const form=page.locator('.contact-form');
  await form.locator('[name=name]').fill('TEST');await form.locator('[name=email]').fill('test@example.com');await form.locator('[name=message]').fill('TEST integracja formularza');await form.locator('[name=consent]').check();
  await page.waitForTimeout(1600);const reply=page.waitForResponse('**/api/preview-request');await form.locator('[type=submit]').click();
  expect((await reply).status()).toBe(503);await expect(form.getByRole('alert')).toContainText('Nie udało się potwierdzić wysłania');
 }
});
test('preview noindex headers, metadata, robots, empty sitemap and real 404',async({request,page})=>{
 for(const route of ['/','/cennik','/strony-dla-beauty','/strony-dla-fizjoterapeutow','/strony-dla-gabinetow','/strony-dla-warsztatow','/nieistniejaca-strona']){
  const response=await request.get(candidate+route);expect(response.status()).toBe(route==='/nieistniejaca-strona'?404:200);expect(response.headers()['x-robots-tag']).toContain('noindex');expect(await response.text()).toContain('content="noindex, nofollow"');
 }
 expect(await(await request.get(candidate+'/robots.txt')).text()).toContain('Disallow: /');expect(await(await request.get(candidate+'/sitemap.xml')).text()).not.toContain('<loc>');
 const errors=[],analytics=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/google-analytics|googletagmanager/.test(r.url()))analytics.push(r.url());});
 await page.addInitScript(()=>localStorage.setItem('znajdowalni-cookie-consent',JSON.stringify({analytics:true,advertising:true})));
 await page.goto(candidate);await expect(page.locator('#hero-preview-source')).toBeVisible();expect(errors).toEqual([]);expect(analytics).toEqual([]);
});
