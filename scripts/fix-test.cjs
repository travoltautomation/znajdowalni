const fs=require('node:fs');
const file='tests/browser/journey.spec.js';
let s=fs.readFileSync(file,'utf8');
s=s.replace("await page.goto('/');await page.getByRole('button',{name:'Ustawienia cookies',exact:true}).click();", "await page.goto('/');await page.locator('#kontakt').scrollIntoViewIfNeeded();await page.getByRole('button',{name:'Tylko niezbędne',exact:true}).click();await page.getByRole('button',{name:'Ustawienia cookies',exact:true}).click();");
fs.writeFileSync(file,s);
