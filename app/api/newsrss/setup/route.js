import {createHash, createHmac, timingSafeEqual} from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const endpoint = 'https://srv2038574.hstgr.cloud/news-service/mcp';
const receiver = 'https://mshraq.com/api/newsrss';
const verifier = "4b16487b5fdb1c958c88d9589eb5fe28b42aecf9c6a3e1f413e1a76fcf045533";
const expires = Date.parse('2026-11-24T14:47:00Z');

async function client(token) {
  const headers = {Authorization:'Bearer '+token, 'Content-Type':'application/json', Accept:'application/json, text/event-stream'};
  let id = 0;
  async function rpc(method, params, notification = false) {
    const body = {jsonrpc:'2.0', method, params};
    if (!notification) body.id = ++id;
    const res = await fetch(endpoint, {method:'POST', headers, body:JSON.stringify(body), redirect:'error', cache:'no-store', signal:AbortSignal.timeout(30000)});
    if (!res.ok) throw Error('MCP HTTP '+res.status);
    if (res.headers.has('mcp-session-id')) headers['mcp-session-id'] = res.headers.get('mcp-session-id');
    if (notification) return;
    const raw = await res.text();
    const data = res.headers.get('content-type')?.includes('text/event-stream')
      ? raw.split(/\r?\n/).filter(s=>s.startsWith('data:')).map(s=>JSON.parse(s.slice(5))).find(x=>x.id===body.id)
      : JSON.parse(raw);
    if (!data || data.error) throw Error('MCP '+method+' error '+(data?.error?.code || 'response'));
    return data.result;
  }
  const info = await rpc('initialize', {protocolVersion:'2025-03-26', capabilities:{},clientInfo:{name:'mshraq',version:'1.0'}});
  headers['MCP-Protocol-Version'] = info.protocolVersion;
  await rpc('notifications/initialized',{},true);
  return rpc;
}

export async function POST(req) {
  const secret = req.headers.get('x-setup-key') || '';
  if (Date.now()>expires || !timingSafeEqual(createHash('sha256').update(secret).digest(),Buffer.from(verifier,'hex'))) return new Response(null,{status:404});
  const token = process.env.NEWSRSS_TOKEN;
  if (!token) return Response.json({error:'NEWSRSS_TOKEN missing'},{status:503});
  try {
    const {op,field} = await req.json();
    const rpc = await client(token);
    const call = (name,args={})=>rpc('tools/call',{name,arguments:args});
    let result;
    if (op==='inspect') {
      const tools = (await rpc('tools/list',{})).tools;
      const writer = createHmac('sha256',token).update('mshraq.com draft storage v1').digest('hex');
      result = {writerFingerprint:createHash('sha256').update(writer).digest('hex'),hasServerKey:Boolean(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY),tools:tools.map(({name,description,inputSchema})=>({name,description,inputSchema})),subscription:await call('get_my_subscription'),webhook:await call('get_my_webhook')};
    } else if (op==='sample') {
      const unpack = res => JSON.parse(res.content[0].text);
      const list = unpack(await call('list_articles',{limit:1}));
      const item = (Array.isArray(list) ? list : list.items || list.articles || [])[0];
      result = item?.id ? unpack(await call('get_article',{id:item.id})) : list;
    } else if (op==='register' && field==='url') {
      result = {registered:await call('register_my_webhook',{[field]:receiver}),webhook:await call('get_my_webhook')};
    } else if (op==='verify') result=await call('get_my_webhook');
    else return new Response(null,{status:400});
    const safe = JSON.stringify(result).replaceAll(token,'[redacted]');
    return new Response(safe,{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  } catch(err) {return Response.json({error:err.message?.startsWith('MCP ')?err.message:'Setup request failed'},{status:502});}
}
