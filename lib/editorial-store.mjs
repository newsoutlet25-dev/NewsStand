import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';

const columns='slug,title,category,tags,secondary_categories,published_at,deleted_at,editorial_version,editorial_created_at,source_name';
function status(row) {
  if (row.deleted_at) return 'trash';
  if (!row.published_at) return 'draft';
  return Date.parse(row.published_at)>Date.now()?'scheduled':'published';
}
function describe(row) {
  const state=status(row);
  return {...row,status:state,url:state==='published'?'https://mshraq.com/news/'+row.slug:null};
}
function publication(row) {
  const {slug,published_at,editorial_version,status,url}=describe(row);
  return {slug,published_at,editorial_version,status,url};
}
function photos(row) {
  return [...(row.image?[{...row.lead_image_details,url:row.image}]:[]),...(row.additional_images || [])];
}
function photoColumns(items) {
  const [lead,...additional_images]=items;
  const {url:image='',...lead_image_details}=lead || {};
  return {image,lead_image_details,additional_images};
}
function patch(row,changes) {
  const {seo,...out}=changes;
  if (!seo) return out;
  const {title,description,open_graph,twitter,...details}=seo;
  if(title!==undefined) out.seo_title=title;
  if(description!==undefined) out.seo_description=description;
  out.seo_details={...row.seo_details,...details};
  for (const [name,values] of Object.entries({open_graph,twitter})) {
    if(values) out.seo_details[name]={...out.seo_details[name],...values};
  }
  return out;
}

export function editorialStore(url,secret) {
  const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  const articles=()=>db.from('articles');
  async function execute(query) {
    const {data,error}=await query;
    if(error) throw Error(error.code==='23505'?'رابط المقال مستخدم.':'تعذّر تنفيذ العملية على المقالات.');
    return data;
  }
  async function get({slug}) {
    const row=await execute(articles().select('*').eq('slug',slug).maybeSingle());
    if(!row) throw Error('المقال غير موجود.');
    return {...describe(row),images:photos(row)};
  }
  async function write(row,version,values) {
    if(row.editorial_version!==version) throw Error('نسخة قديمة. اقرأ المقال مجددًا.');
    const saved=await execute(articles().update({...values,editorial_version:version+1})
      .eq('slug',row.slug).eq('editorial_version',version).select(columns).maybeSingle());
    if(!saved) throw Error('تغيّرت نسخة المقال. اقرأ المقال مجددًا.');
    return describe(saved);
  }
  async function active(args) {
    const row=await get(args);
    if(row.deleted_at) throw Error('استعد المقال من السلة أولًا.');
    return row;
  }
  async function browse({status:state='all',category,query,limit=20,offset=0}) {
    let q=articles().select(columns);
    q=state==='trash'?q.not('deleted_at','is',null):q.is('deleted_at',null);
    if(state==='draft') q=q.is('published_at',null);
    if(state==='published') q=q.lte('published_at',new Date().toISOString());
    if(state==='scheduled') q=q.gt('published_at',new Date().toISOString());
    if(category) q=q.or('category.eq.'+category+',secondary_categories.cs.{'+category+'}');
    if(query) q=q.ilike('editorial_search','%'+query.replace(/[\\%_]/g,'\\$&')+'%');
    return (await execute(q.order('editorial_created_at',{ascending:false}).order('slug').range(offset,offset+limit-1))).map(describe);
  }
  async function read(args) {
    const row=await active(args);
    if(row.published_at) throw Error('المقال ليس مسودة.');
    return row;
  }
  async function goLive(args) {
    const row=await active(args);
    if(row.status==='published' && !args.published_at) return publication(row);
    return publication(await write(row,args.version,{published_at:args.published_at || new Date().toISOString()}));
  }
  return {get,browse,read,goLive,list:args=>browse({...args,status:'draft'}),
    async publish(args) {
      const row=await active(args);
      if(row.status==='scheduled') throw Error('المقال مجدول للنشر مستقبلاً.');
      if(row.status==='published') return publication(row);
      return publication(await write(row,args.version,{published_at:new Date().toISOString()}));
    },
    async save({slug,version,...changes}) {
      const row=await read({slug});
      return write(row,version,patch(row,changes));
    },
    async create({slug,images=[],...fields}) {
      const row=await execute(articles().insert({slug:slug || randomUUID(),summary:'',...patch({},fields),...photoColumns(images)}).select(columns).single());
      return describe(row);
    },
    async edit({slug,version,changes:{new_slug,...changes}}) {
      const row=await active({slug});
      const values=patch(row,changes);
      if(new_slug) values.slug=new_slug;
      return write(row,version,values);
    },
    async images({slug,version,operations}) {
      const row=await active({slug});
      const items=photos(row);
      for(const op of operations) {
        const i=op.index ?? items.length;
        if(i>items.length || (op.op!=='add' && i===items.length) || (op.op==='move' && op.to>=items.length)) throw Error('موضع الصورة خارج نطاق القائمة.');
        if(op.op==='add') items.splice(i,0,op.image);
        if(op.op==='update') items[i]={...items[i],...op.changes};
        if(op.op==='remove') items.splice(i,1);
        if(op.op==='move') items.splice(op.to,0,items.splice(i,1)[0]);
      }
      return write(row,version,photoColumns(items));
    },
    async unpublish(args) {return write(await active(args),args.version,{published_at:null});},
    async trash(args) {return write(await active(args),args.version,{deleted_at:new Date().toISOString()});},
    async restore(args) {
      const row=await get(args);
      if(!row.deleted_at) throw Error('المقال خارج السلة.');
      return write(row,args.version,{deleted_at:null});
    }
  };
}
