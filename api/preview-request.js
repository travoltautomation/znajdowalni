const {createHash} = require('node:crypto');
const {validate,record,message,EMAIL} = require('../lib/lead');
// Per-instance guard; use Vercel Firewall for durable edge rate limiting.
const attempts = new Map(), delivered = new Map(), inFlight = new Map();
const WINDOW = 15 * 60 * 1000;
function prune(map, now) { for (const [key,value] of map) if (now-value.time>WINDOW) map.delete(key); }
async function deliver(lead) {
  const env = process.env, mail = message(lead);
  const recipient = env.SMTP_RECIPIENT_EMAIL || env.PREVIEW_RECIPIENT_EMAIL || '';
  const recipients = [...new Set([recipient, env.SMTP_USER || ''].join(',').split(',').map(v=>v.trim()).filter(v=>EMAIL.test(v)))];
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && recipients.length) {
    const transporter = require('nodemailer').createTransport({host:env.SMTP_HOST,port:Number(env.SMTP_PORT||465),secure:env.SMTP_SECURE!=='false',auth:{user:env.SMTP_USER,pass:env.SMTP_PASS},connectionTimeout:8000,greetingTimeout:8000,socketTimeout:10000});
    const result = await transporter.sendMail({from:env.SMTP_FROM_EMAIL||env.SMTP_USER,to:recipients,replyTo:lead.contact.email,subject:mail.title,text:mail.text,html:mail.html,headers:{'X-Znajdowalni-Lead-ID':lead.id},attachments:[{filename:`lead-${lead.id}.json`,content:JSON.stringify(lead,null,2),contentType:'application/json'}]});
    if (!result.accepted?.length) throw new Error('No accepted recipient');
    return;
  }
  if (env.PREVIEW_WEBHOOK_URL) {
    const response = await fetch(env.PREVIEW_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':lead.id},body:JSON.stringify(lead),signal:AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error('Webhook failed');
    return;
  }
  if (env.RESEND_API_KEY && env.PREVIEW_RECIPIENT_EMAIL) {
    const response = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':lead.id},body:JSON.stringify({from:env.RESEND_FROM_EMAIL||'Znajdowalni <onboarding@resend.dev>',to:env.PREVIEW_RECIPIENT_EMAIL.split(',').map(v=>v.trim()),reply_to:lead.contact.email,subject:mail.title,text:mail.text,html:mail.html}),signal:AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error('Mail failed');
    return;
  }
  const error = new Error('Not configured'); error.code='CONFIG'; throw error;
}
function createHandler(send = deliver) {
  return async (request,response) => {
    response.setHeader('Cache-Control','no-store');
    if (request.method !== 'POST') { response.setHeader('Allow','POST'); return response.status(405).json({error:'Użyj formularza na stronie.'}); }
    if (!(request.headers['content-type']||'').includes('application/json')) return response.status(415).json({error:'Nieprawidłowy format żądania.'});
    const origin = request.headers.origin, host = request.headers.host;
    if (origin) {try {if (new URL(origin).host!==host) return response.status(403).json({error:'Wyślij formularz z naszej strony.'});} catch {return response.status(403).json({error:'Nieprawidłowe źródło żądania.'});}}
    if (Number(request.headers['content-length']||0)>12000 || Buffer.byteLength(JSON.stringify(request.body||{}))>12000) return response.status(413).json({error:'Zgłoszenie jest zbyt duże.'});
    const {data,error,field} = validate(request.body);
    if (error) return response.status(400).json({error,field});
    if (data.website) return response.status(400).json({error:'Nie udało się zweryfikować formularza.'});
    const now = Date.now(); prune(attempts,now); prune(delivered,now);
    const fingerprint = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const cached = delivered.get(data.requestId);
    if (cached?.fingerprint===fingerprint) return response.status(200).json({ok:true,id:data.requestId});
    const key = createHash('sha256').update(`${request.headers['x-real-ip']||request.socket?.remoteAddress||'unknown'}`).digest('hex');
    const quota = attempts.get(key)||{count:0,time:now};
    if (quota.count>=8 || attempts.size>10000) {response.setHeader('Retry-After','900');return response.status(429).json({error:'Za dużo prób. Spróbuj za 15 minut lub napisz na kontakt@znajdowalni.pl.'});}
    attempts.set(key,{count:quota.count+1,time:quota.time});
    const lead = record(data,process.env.VERCEL_ENV!=='production');
    if (inFlight.has(data.requestId)) return response.status(409).json({error:'Zgłoszenie jest właśnie wysyłane. Poczekaj chwilę.'});
    try {
      inFlight.set(data.requestId,true); await send(lead);
      delivered.set(data.requestId,{time:now,fingerprint});
      return response.status(200).json({ok:true,id:lead.id});
    } catch (error) {return response.status(error.code==='CONFIG'?503:502).json({error:'Nie udało się potwierdzić wysłania. Spróbuj ponownie lub napisz na kontakt@znajdowalni.pl.'});}
    finally {inFlight.delete(data.requestId);}
  };
}
module.exports = createHandler();
module.exports.createHandler = createHandler;
