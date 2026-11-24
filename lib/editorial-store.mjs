import {createClient} from '@supabase/supabase-js';

export function editorialStore(url, secret) {
  const db = createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  const drafts = () => db.from('articles');
  const summary = 'slug,title,category,editorial_version,editorial_created_at,source_name';
  async function execute(query) {
    const {data,error} = await query;
    if (error) throw Error('تعذّر الاتصال بقاعدة المقالات.');
    return data;
  }
  async function change(slug,version,values,columns) {
    const row = await execute(drafts().update({...values,editorial_version:version+1})
      .eq('slug',slug).eq('editorial_version',version).is('published_at',null).select(columns).maybeSingle());
    if (!row) throw Error('تعذّر تعديل هذه النسخة. أعد قراءة حالة المقال وإصداره.');
    return row;
  }
  return {
    list: ({offset,limit}) => execute(drafts().select(summary).is('published_at',null)
      .order('editorial_created_at',{ascending:false}).order('slug').range(offset,offset+limit-1)),
    async read({slug}) {
      const row = await execute(drafts().select('*').eq('slug',slug).is('published_at',null).maybeSingle());
      if (!row) throw Error('المسودة غير موجودة.');
      return row;
    },
    save: ({slug,version,title,body,summary:excerpt,seo}) => change(slug,version,{
      title,body,summary:excerpt,seo_title:seo.title,seo_description:seo.description,
      seo_details:{keywords:seo.keywords,open_graph:seo.open_graph,twitter:seo.twitter}
    }, summary),
    async publish({slug,version}) {
      const fields='slug,published_at,editorial_version';
      const current=await execute(drafts().select(fields).eq('slug',slug).maybeSingle());
      if (!current) throw Error('المقال غير موجود.');
      const row=current.published_at ? current : await change(slug,version,{published_at:new Date().toISOString()},fields);
      if(Date.parse(row.published_at)>Date.now()) throw Error('المقال مجدول للنشر مستقبلاً.');
      return {status:'published',...row,url:'https://mshraq.com/news/'+row.slug};
    }
  };
}
