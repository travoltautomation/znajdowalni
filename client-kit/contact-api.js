const config=require('./site.json');
const crypto=require('node:crypto');
const quota=new Map();
module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false});}
  const p=req.body;
  if(!(req.headers['content-type']||'').includes('application/json')||!p||typeof p!=='object'||Array.isArray(p))return res.status(400).json({ok:false});
  if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({ok:false});}catch{return res.status(403).json({ok:false});}}
  if(typeof p.email!=='string'||p.email.length>254||!/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(p.email)||typeof p.message!=='string'||!p.message.trim()||p.message.length>3000||p.website||!['on',true].includes(p.consent)||!Number.isFinite(p.startedAt)||Date.now()-p.startedAt<1500||Date.now()-p.startedAt>86400000)return res.status(400).json({ok:false});
  const key=crypto.createHash('sha256').update(req.headers['x-real-ip']||'unknown').digest('hex'),now=Date.now();for(const[k,v]of quota)if(now-v.time>900000)quota.delete(k);const previous=quota.get(key)||{count:0,time:now};if(previous.count>=8||quota.size>10000)return res.status(429).json({ok:false});quota.set(key,{count:previous.count+1,time:previous.time});
  if(!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASS||!process.env.SMTP_RECIPIENT_EMAIL)return res.status(503).json({ok:false});
  try{const transport=require('nodemailer').createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||465),secure:process.env.SMTP_SECURE!=='false',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:8000,greetingTimeout:8000,socketTimeout:10000});const result=await transport.sendMail({from:process.env.SMTP_FROM_EMAIL||process.env.SMTP_USER,to:process.env.SMTP_RECIPIENT_EMAIL,replyTo:p.email,subject:`${process.env.VERCEL_ENV==='production'?'':'[TEST] '}Zapytanie ze strony ${config.name}`.replace(/[\r\n]/g,' '),text:`E-mail: ${p.email}\n\n${p.message}\n\nZgoda na odpowiedź: ${new Date().toISOString()}`});if(!result.accepted?.length)throw new Error();return res.status(200).json({ok:true});}catch{return res.status(502).json({ok:false});}
};
