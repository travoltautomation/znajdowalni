const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'dist');
const preview = process.env.VERCEL_ENV !== 'production';
// Rebuild only the generated dist directory; never publish client/private files.
if (out !== path.resolve(root, 'dist')) throw new Error('Invalid build directory');
fs.rmSync(out, {recursive:true, force:true}); fs.mkdirSync(out);
for (const name of fs.readdirSync(root)) if (/\.(html|css|js|txt|xml|ico)$/.test(name)) fs.copyFileSync(path.join(root,name),path.join(out,name));
for (const name of ['assets','szablony']) fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true,filter:p=>!p.endsWith('.md')});
let pages = 0;
function processDirectory(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) { processDirectory(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let html = fs.readFileSync(file,'utf8');
    if (preview) {
      html = html.replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'');
      html = html.replace('</head>','<meta name="robots" content="noindex, nofollow"></head>');
      html = html.replace(/<body\b/,'<body data-preview="true"');
    }
    if (/<script src="(?:app|landing)\.js"/.test(html)) html = html.replace(/<script src="(?:app|landing)\.js"/, '<script src="form-submit.js"></script>$&');
    if (file === path.join(out,'index.html')) html = html.replace('</head>','<link rel="stylesheet" href="footer.css"></head>').replace('</body>','<script src="footer.js"></script></body>');
    fs.writeFileSync(file,html); pages++;
  }
}
processDirectory(out);
if (preview) {
  fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
  fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
}
console.log(`Built ${pages} pages; main frontend; ${preview?'preview noindex':'production'}.`);
