import {bodyField, bodyGuide} from './article-body-schema.mjs';
import {z} from 'zod';

const slug=z.string().regex(/^[a-z0-9-]{1,200}$/);
const version=z.number().int().min(1).max(2147483646);
const key={slug,version};
const short=z.string().trim().max(500);
const text=z.string().trim().max(4000);
const section=z.enum(['local','politics','economy','sport','culture','entertainment','variety','travel']);
const url=z.string().max(4096).refine(value=>/^https?:\/\//i.test(value) || /^\/(?![\/\\])/.test(value),'Use an HTTP(S) or site-relative image URL');
const social=z.strictObject({title:short,description:text,image:url.nullable(),image_alt:short}).partial();
const seo=z.strictObject({title:short,description:text,keywords:z.array(short).max(80),
  open_graph:social,twitter:social,canonical_url:z.url({protocol:/^https?$/}).nullable(),
  index:z.boolean(),follow:z.boolean(),twitter_card:z.enum(['summary','summary_large_image'])}).partial();
const photo=z.strictObject({url,alt:short.optional(),title:short.optional(),description:text.optional(),caption:text.optional()});
const fields={title:short.min(1),body:bodyField,summary:text,
  category:section,secondary_categories:z.array(section).max(8),tags:z.array(short.min(1)).max(100),seo};
const changes=z.strictObject({...fields,new_slug:slug}).partial().refine(x=>Object.keys(x).length>0,'Provide at least one change');
const pos=z.number().int().nonnegative();
const filters={status:z.enum(['all','draft','published','scheduled','trash']).default('all'),category:section.optional(),
  offset:z.number().int().nonnegative().default(0),limit:z.number().int().min(1).max(100).default(20)};
export const contentTools=[
  ['list_articles','List all active articles, including older content. Filter by status or section; use trash for deleted articles.',filters,'browse'],
  ['search_articles','Search title, summary, body, slug and tags. Same filters and pagination as list_articles.',{...filters,query:short.min(1)},'browse'],
  ['get_article','Read a full article of any status, including ordered images, SEO, status and editorial_version.',{slug},'get'],
  ['create_article','Create a draft. The first image is the lead. Optional slug, otherwise generated. ' + bodyGuide,{...z.strictObject(fields).partial().shape,title:fields.title,body:fields.body,category:section,slug:slug.optional(),images:z.array(photo).optional()},'create'],
  ['update_article','Patch supplied fields. SEO and social overrides merge by field. Set changes.new_slug only for an intentional URL change. ' + bodyGuide,{...key,changes},'edit'],
  ['edit_article_images','Apply ordered operations atomically. Index 0 is the lead. update accepts a replacement URL or metadata; remove detaches the image. move.to is the final zero-based index.',{...key,operations:z.array(z.discriminatedUnion('op',[
    z.strictObject({op:z.literal('add'),image:photo,index:pos.optional()}),
    z.strictObject({op:z.literal('update'),index:pos,changes:photo.partial()}),
    z.strictObject({op:z.literal('remove'),index:pos}),
    z.strictObject({op:z.literal('move'),index:pos,to:pos})
  ])).min(1).max(200)},'images'],
  ['publish_article','Publish a draft and return its public URL. Optional published_at explicitly changes the publication timestamp; future dates schedule publication.',{...key,published_at:z.iso.datetime({offset:true}).optional()},'goLive'],
  ['unpublish_article','Return the article to draft, keeping its slug and content.',key,'unpublish'],
  ['delete_article','Move an article to trash. It disappears from public pages and listings.',key,'trash'],
  ['restore_article','Restore from trash with its prior publication date and status.',key,'restore']
];
