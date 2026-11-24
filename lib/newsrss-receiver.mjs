import {createHmac, timingSafeEqual} from 'node:crypto';

const maxBytes = 16 * 1024 * 1024;
const hmac = (key, value) => createHmac('sha256', key).update(value).digest('hex');

export function storageCredential(token) {
  return hmac(token, 'mshraq.com draft storage v1');
}

export async function receiveNews(request, token, save) {
  if (!token) return new Response(null, {status:503});
  const stamp = request.headers.get('x-newsrss-timestamp') || '';
  const signature = request.headers.get('x-newsrss-signature') || '';
  if (!/^\d{10}$/.test(stamp) || Math.abs(Date.now()/1000 - Number(stamp)) > 300 ||
      !/^sha256=[a-f0-9]{64}$/.test(signature)) return new Response(null, {status:401});
  if (Number(request.headers.get('content-length')) > maxBytes) return new Response(null, {status:413});
  const reader = request.body?.getReader();
  if (!reader) return new Response(null, {status:400});
  const chunks = [];
  let bytes = 0;
  const key = hmac(token, 'NewsRSS webhook v1');
  const digest = createHmac('sha256',key).update(stamp+'.');
  try {
    while (true) {
      const {value,done} = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > maxBytes) { await reader.cancel(); return new Response(null, {status:413}); }
      digest.update(value);
      chunks.push(value);
    }
  } catch { return new Response(null,{status:400}); }
  if (!timingSafeEqual(Buffer.from(signature),Buffer.from('sha256='+digest.digest('hex')))) return new Response(null,{status:401});
  let data;
  try { data = JSON.parse(Buffer.concat(chunks,bytes).toString('utf8')); }
  catch { return new Response(null,{status:400}); }
  if (data?.type==='newsrss.verify' && typeof data.challenge==='string')
    return Response.json({proof:hmac(key,'verify.'+data.challenge)});
  if (data?.type!=='newsrss.articles' || !Array.isArray(data.items)) return new Response(null,{status:400});
  try {
    await save(data.items);
    return Response.json({saved_ids:data.items.map(item=>item.id)});
  } catch { return new Response(null,{status:503}); }
}
