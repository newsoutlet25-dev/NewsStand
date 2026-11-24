import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import ArticleBody from '../app/news/article-body.mjs';
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
  const matches=['slug','editorial_version','published_at','deleted_at'].every(k=>{
    const filter=url.searchParams.get(k);
    return !filter || (filter==='is.null'?row[k]==null:filter==='eq.'+row[k]);
  });
  const single=req.headers.get('accept')?.includes('vnd.pgrst.object');
  if(req.method==='POST') {
    const created=await req.json();
    return Response.json({...created,editorial_version:1,published_at:null},{status:201});
  }
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
  assert.equal((await client.listTools()).tools.length,14);
  assert.equal(data(await call('list_drafts',{})).length,1);
  assert.equal(data(await call('get_draft',{slug:'fixture'})).additional_images.length,1);
  const rewrite={slug:'fixture',version:1,title:'عنوان محرر',body:'النص بعد التحرير',summary:'الملخص',seo:{title:'عنوان البحث',description:'وصف البحث',keywords:['اختبار'],open_graph:{title:'عنوان المشاركة'},twitter:{description:'وصف المشاركة'}}};
  rewrite.body='مقدمة\\n\\n## عنوان رئيسي فرعي\r\nفقرة\n### تفاصيل\n<script>alert(1)</script>';
  assert.equal(data(await call('save_draft',rewrite)).editorial_version,2);
  assert.equal(row.seo_details.open_graph.title,rewrite.seo.open_graph.title);
  assert.equal((await call('save_draft',rewrite)).isError,true);
  assert.equal(row.published_at,null);
  assert.equal((await call('publish_draft',{slug:'fixture',version:1})).isError,true);
  const pub=data(await call('publish_draft',{slug:'fixture',version:2}));
  assert.equal(pub.status,'published');assert.equal(pub.url,'https://mshraq.com/news/fixture');
  const stored=data(await call('get_article',{slug:'fixture'})).body;
  assert.equal(stored,'مقدمة\n\n## عنوان رئيسي فرعي\nفقرة\n### تفاصيل\n<script>alert(1)</script>');
  const render=body=>renderToStaticMarkup(createElement(ArticleBody,{body}));
  assert.equal(render(stored),'<div class="reader-body"><p>مقدمة</p><h2>عنوان رئيسي فرعي</h2><p>فقرة</p><h3>تفاصيل</h3><p>&lt;script&gt;alert(1)&lt;/script&gt;</p></div>');
  assert.equal(render('قديم\r\nفقرة\\n\\nأخرى'),'<div class="reader-body"><p>قديم</p><p>فقرة</p><p>أخرى</p></div>');
  assert.deepEqual(data(await call('publish_draft',{slug:'fixture',version:2})),pub);
  assert.deepEqual(data(await call('list_drafts',{})),[]);
  const ref=()=>({slug:row.slug,version:row.editorial_version});
  const date=row.published_at;
  data(await call('update_article',{...ref(),changes:{tags:['محلي'],seo:{open_graph:{description:'مشاركة'}}}}));
  assert.equal(row.seo_details.open_graph.title,rewrite.seo.open_graph.title);
  assert.equal(row.seo_details.twitter.description,rewrite.seo.twitter.description);
  assert.equal(row.title,rewrite.title);
  data(await call('edit_article_images',{...ref(),operations:[
    {op:'add',image:{url:'https://example.org/new.jpg',alt:'جديدة'}},
    {op:'move',index:2,to:0},{op:'update',index:0,changes:{caption:'تعليق'}},{op:'remove',index:1}
  ]}));
  assert.equal(row.lead_image_details.alt,'جديدة');
  assert.equal(row.lead_image_details.caption,'تعليق');
  assert.equal(row.published_at,date);
  assert.equal(row.slug,'fixture');
  assert.equal(data(await call('delete_article',ref())).status,'trash');
  assert.equal(data(await call('list_articles',{})).length,0);
  assert.equal(data(await call('restore_article',ref())).published_at,date);
  assert.equal(data(await call('unpublish_article',ref())).status,'draft');
  assert.equal(data(await call('create_article',{title:'مقال اختباري',body:'نص',category:'sport',images:[]})).status,'draft');
  assert.equal(data(await call('search_articles',{query:row.title}))[0].slug,'fixture');
  console.log('PASS: authenticated MCP handshake, discovery, read, edit, version conflict, publish, retry and list filtering');
} finally {await client.close();globalThis.fetch=originalFetch}
