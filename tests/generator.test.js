const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process'),{randomUUID}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const run=(file,args=[],env={})=>spawnSync(process.execPath,[file,...args],{cwd:root,env:{...process.env,VERCEL_ENV:'preview',...env},encoding:'utf8'});
test('client generator: isolation, build, CMS edit, variants, safe publication',()=>{
 const slug='qa-'+randomUUID().slice(0,8),dir=path.join(root,'clients',slug);
 const fixture=path.join(root,'clients','qa-lead.private.json');fs.mkdirSync(path.dirname(fixture),{recursive:true});fs.writeFileSync(fixture,JSON.stringify({schemaVersion:1,business:{company:'TEST Firma',city:'Wrocław',source:'https://example.com'},contact:{email:'test@example.com'}}));
 let result=run('scripts/new-client.js',[slug,fixture,'pro']);assert.equal(result.status,0,result.stderr);
 assert.ok(fs.existsSync(path.join(dir,'.pages.yml')));assert.ok(!fs.readFileSync(path.join(dir,'.pages.yml'),'utf8').includes('site.json'));
 assert.notEqual(run('scripts/new-client.js',[slug]).status,0,'must not overwrite an existing client');
 let config=JSON.parse(fs.readFileSync(path.join(dir,'site.json'))),content=JSON.parse(fs.readFileSync(path.join(dir,'content.json')));
 config={...config,domain:'https://example.com',name:'TEST Firma',city:'Wrocław',email:'test@example.com',privacyText:'TEST polityka',sections:['news','services','faq','contact']};
 content={...content,headline:'TEST oferta',description:'TEST opis',about:'TEST o firmie',services:[{name:'Konsultacja <script>alert(1)</script>',description:'TEST usługa',price:'100 zł'}],news:[{title:'Nowa usługa',body:'Treść z panelu CMS',date:'2026-09-07'}],imageUrl:'/media/test.svg'};
 fs.mkdirSync(path.join(dir,'public/media'),{recursive:true});fs.writeFileSync(path.join(dir,'public/media/test.svg'),'<svg xmlns="http://www.w3.org/2000/svg"/>');
 for(const theme of ['calm','editorial','workshop']){config.theme=theme;fs.writeFileSync(path.join(dir,'site.json'),JSON.stringify(config));fs.writeFileSync(path.join(dir,'content.json'),JSON.stringify(content));result=run(path.join(dir,'build.js'));assert.equal(result.status,0,result.stderr);const html=fs.readFileSync(path.join(dir,'dist/index.html'),'utf8');assert.ok(html.includes(`class="${theme}"`));assert.ok(html.includes('Treść z panelu CMS'));assert.ok(html.includes('noindex,nofollow'));assert.ok(!html.includes('<script>alert(1)</script>'));assert.ok(!html.includes('test@example.com"}'));assert.ok(!fs.existsSync(path.join(dir,'dist/lead.private.json')));assert.ok(fs.existsSync(path.join(dir,'dist/media/test.svg')));}
 assert.notEqual(run(path.join(dir,'build.js'),[],{VERCEL_ENV:'production'}).status,0,'production requires approval');
 config.approved=true;fs.writeFileSync(path.join(dir,'site.json'),JSON.stringify(config));result=run(path.join(dir,'build.js'),[],{VERCEL_ENV:'production'});assert.equal(result.status,0,result.stderr);assert.ok(fs.readFileSync(path.join(dir,'dist/index.html'),'utf8').includes('LocalBusiness'));assert.ok(fs.readFileSync(path.join(dir,'dist/polityka-prywatnosci.html'),'utf8').includes('https://example.com/polityka-prywatnosci.html'));
 console.log('Client fixture: '+dir);
});
