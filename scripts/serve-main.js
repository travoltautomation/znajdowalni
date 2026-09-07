// Read-only reference server for visual comparison with the current main commit.
const http=require('node:http'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),cache=new Map();
const revision=execFileSync('git',['rev-parse','main'],{cwd:root,encoding:'utf8'}).trim();
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
http.createServer((req,res)=>{
 let file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
 if(!path.extname(file))file+='.html';
 try{if(!cache.has(file))cache.set(file,execFileSync('git',['show',`${revision}:${file}`],{cwd:root,maxBuffer:15e6,stdio:['ignore','pipe','ignore']}));res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(cache.get(file));}catch{res.writeHead(404);res.end('Not found');}
}).listen(4174,'127.0.0.1',()=>console.log('Read-only main reference: http://127.0.0.1:4174'));
