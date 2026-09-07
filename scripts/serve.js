const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=process.env.STATIC_ROOT || path.resolve(__dirname,'../dist');
const handler=require('../api/preview-request');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
  res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('X-Content-Type-Options','nosniff');
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/preview-request'){
    let body='';for await(const chunk of req){body+=chunk;if(body.length>16000){res.writeHead(413);res.end();return;}}
    try{req.body=JSON.parse(body||'{}');}catch{res.writeHead(400);res.end('{}');return;}
    res.status=code=>{res.statusCode=code;return res;};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};
    return handler(req,res);
  }
  let decoded;try{decoded=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
  let file=path.resolve(root,'.'+decoded);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(url.pathname==='/')file=path.join(root,'index.html');
  else if(!path.extname(file)&&fs.existsSync(file+'.html'))file+='.html';
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;file=path.join(root,'404.html');}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
}).listen(Number(process.env.PORT || 4173),'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
