import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {editorialEndpoint} from '../lib/editorial-mcp.mjs';
import {editorialStore} from '../lib/editorial-store.mjs';

const token=randomBytes(32).toString('hex');
const row={slug:'fixture',editorial_version:1,published_at:null,title:'اختبار',body:'نص تجريبي',category:'local',image:'https://example.org/lead.jpg',additional_images:[{url:'https://example.org/gallery.jpg'}]};
const originalFetch=globalThis.fetch;
globalThis.fetch=async (input,init)=>{
  const req=new Request(input,init),url=new URL(req.url);
  assert.equal(url.origin,'https://db.invalid');
  assert.equal(url.pathname,'/rest/v1/articles');
  const matches=['slug','editorial_version','published_at'].every(k=>{
    const filter=url.searchParams.get(k);
    return !filter || (filter==='is.null'?row[k]===null:filter==='eq.'+row[k]);
  });
  const single=req.headers.get('accept')?.includes('vnd.pgrst.object');
  if(req.method==='PATCH' && matches) Object.assign(row,await req.json());
  return Response.json(single ? (matches?row:null) : (matches?[row]:[]));
};
const url=new URL('https://mshraq.com/api/mcp');
const endpoint=editorialEndpoint({token,store:editorialStore('https://db.invalid','test-server-key')});
const client=new Client({name:'isolated-editorial-test',version:'1'});
try {
  assert.equal((await endpoint(new Request(url,{method:'POST'}))).status,401);
  const transport=new StreamableHTTPClientTransport(url,{requestInit:{headers:{Authorization:'Bearer '+token}},
    fetch:async (input,init)=>endpoint(new Request(input,init))});
  await client.connect(transport);
  const call=async(name,args)=>(await client.callTool({name,arguments:args}));
  const data=r=>{assert.ok(!r.isError,r.content[0].text);return JSON.parse(r.content[0].text)};
  assert.equal((await client.listTools()).tools.length,4);
  assert.equal(data(await call('list_drafts',{})).length,1);
  assert.equal(data(await call('get_draft',{slug:'fixture'})).additional_images.length,1);
  const rewrite={slug:'fixture',version:1,title:'عنوان محرر',body:'النص بعد التحرير',summary:'الملخص',seo:{title:'عنوان البحث',description:'وصف البحث',keywords:['اختبار'],open_graph:{title:'عنوان المشاركة'},twitter:{description:'وصف المشاركة'}}};
  assert.equal(data(await call('save_draft',rewrite)).editorial_version,2);
  assert.equal(row.seo_details.open_graph.title,rewrite.seo.open_graph.title);
  assert.equal((await call('save_draft',rewrite)).isError,true);
  assert.equal(row.published_at,null);
  assert.equal((await call('publish_draft',{slug:'fixture',version:1})).isError,true);
  const pub=data(await call('publish_draft',{slug:'fixture',version:2}));
  assert.equal(pub.status,'published');assert.equal(pub.url,'https://mshraq.com/news/fixture');
  assert.deepEqual(data(await call('publish_draft',{slug:'fixture',version:2})),pub);
  assert.deepEqual(data(await call('list_drafts',{})),[]);
  console.log('PASS: authenticated MCP handshake, discovery, read, edit, version conflict, publish, retry and list filtering');
} finally {await client.close();globalThis.fetch=originalFetch}
