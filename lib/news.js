import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';

import {editionSamples} from './edition-samples';
export {sections} from './sections';
const samples = [
 ['riyadh','local','الرياض من الأعلى.. كيف تروي الأبراج قصة تحوّل المدينة؟','بين بيوت الطين وأفق الأبراج، تتغير ملامح العاصمة وتبقى الذاكرة جزءًا من مشهدها اليومي.','riyadh','من على مستوى الشارع تبدو المدينة مجموعة من الأحياء المتجاورة. لكن الصعود إلى نقطة مرتفعة يكشف كيف تصل الطرق بين نسيجها القديم وأبراجها الحديثة.\n\nفي هذه الجولة التحريرية نتتبع خط الأفق من الشمال إلى وسط الرياض، ونقرأ في اختلاف ارتفاعات المباني أثر الزمن على شكل العاصمة.'],
 ['market','economy','من المصنع إلى المتجر.. رحلة المنتج السعودي','قراءة في المراحل التي يمر بها المنتج المحلي قبل وصوله إلى المستهلك.','trade','تبدأ الرحلة باختيار المواد الخام، ثم تنتقل إلى خطوط التصنيع ومراكز التوزيع. وعند كل محطة تدخل عناصر جديدة في تحديد السعر النهائي.'],
 ['stadiums','sport','وراء صافرة البداية.. يوم في مدرجات الكرة السعودية','تفاصيل يوم المباراة كما يعيشه الجمهور من البوابات حتى صافرة النهاية.','stadium','قبل أن يخرج اللاعبون إلى أرض الملعب، تكون المدرجات قد بدأت حكايتها. يختار المشجع مكانه ويتبادل التوقعات مع من يجلس إلى جواره.'],
 ['ula','travel','العلا.. حكايات محفورة في صخور الصحراء','جولة بين تشكيلات الحجر الرملي وطرقات الواحة القديمة.','dunes','مع تبدل زاوية الضوء تتغير ظلال الصخور على الرمل. من هنا يبدأ الزائر رحلته بين الممرات الطبيعية قبل أن يعود إلى الواحة عند المساء.'],
 ['craft','culture','الحرف التقليدية تجد مكانها في بيوت اليوم','لقاء بين ذاكرة الصانع واحتياجات البيت المعاصر.','dunes','في الورشة تبدأ القطعة برسم بسيط على الورق. يختار الصانع مادته ويجرب أكثر من معالجة حتى تجمع القطعة بين الاستخدام اليومي والتفاصيل الموروثة.'],
 ['cities','local','كيف تعيد المدن تصميم شوارعها للمشاة؟','تجارب حضرية تنطلق من تفاصيل الرصيف والظل ومساحات العبور.','riyadh','يبدأ التخطيط أحيانًا من سؤال صغير عن المسافة التي يمكن قطعها سيرًا. يقارن هذا الملف بين عرض الأرصفة وتوزيع الظل واتصال الطرق بالمرافق العامة.']
 ,['walks','local','الرياض سيرًا على الأقدام.. تفاصيل لا تراها من السيارة','جولة في الشوارع التي تصل الأحياء بحدائقها.','riyadh','مع انخفاض حرارة المساء يعود المشاة إلى الأرصفة. يختصر ظل الأشجار المسافة التي يشعر بها العابر بين حيه والحديقة.']
 ,['training','sport','على حافة الملعب.. كيف يستعد الفريق للمباراة؟','من الإحماء إلى التمريرة الأولى.','stadium','يقسم المدرب مساحة التدريب إلى مربعات صغيرة. تتحرك الكرة بين اللاعبين فيما يراقب المدرب إيقاع التمرير والمسافة بين الخطوط.']
 ,['oasis','travel','بين النخيل والصخر.. مسارات الواحة في العلا','نظرة إلى تفاصيل رحلة تبدأ بين البساتين.','dunes','في ظلال النخيل تتفرع ممرات ضيقة بين البساتين، ومن فتحاتها تظهر الصخور المحيطة بالواحة.']
];
const demo=[...samples,...editionSamples].map(([slug,category,title,summary,art,body],i)=>({slug,category,title,summary,body,image:'/art/'+art+'.svg',author:'',published_at:new Date(Date.UTC(2026,10,4,10,42-i*17)).toISOString(),featured:i<5}));
export const isDemo=!process.env.SUPABASE_URL && !process.env.SUPABASE_PUBLISHABLE_KEY;
function client(){
 if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) throw new Error('إعدادات اتصال قاعدة البيانات غير مكتملة');
 return createClient(process.env.SUPABASE_URL,process.env.SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false}});
}
export const listNews=cache(async()=>{
 if(isDemo)return demo;
 const {data,error}=await client().from('articles').select('slug,category,title,summary,image,author,published_at,featured').order('published_at',{ascending:false}).limit(100);
 if(error)throw new Error('تعذّر تحميل الأخبار');
 return data;
});
export const findNews=cache(async(slug)=>{
 if(isDemo)return demo.find(a=>a.slug===slug);
 const {data,error}=await client().from('articles').select('*').eq('slug',slug).maybeSingle();
 if(error)throw new Error('تعذّر تحميل الخبر');
 return data;
});

export async function sitemapNews() {
  const articles = [];
  const size = 500;
  for (let offset = 0; ; offset += size) {
    const {data,error} = await client().from('articles').select('slug,published_at')
      .order('slug').range(offset, offset + size - 1);
    if (error) throw new Error('تعذّر تحميل خريطة الأخبار');
    articles.push(...data);
    if (data.length < size) return articles;
  }
}
export async function guideArticles() {
  if (isDemo) return [];
  const articles = [];
  const size = 500;
  const cutoff = new Date().toISOString();
  const db = client();
  for (let offset = 0; ; offset += size) {
    const {data, error} = await db.from('articles').select('slug,title,summary,seo_details')
      .is('deleted_at', null).lte('published_at', cutoff)
      .order('published_at', {ascending: false}).order('slug').range(offset, offset + size - 1);
    if (error) throw new Error('تعذّر تحميل دليل الأخبار');
    articles.push(...data.filter(article => article.seo_details?.index !== false));
    if (data.length < size) return articles;
  }
}
export function clock(date){return new Date(date).toLocaleTimeString('ar-SA',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Riyadh'});}

export async function articleViewCount(slug) {
  if (isDemo) return null;
  const {count,error} = await client().from('article_views')
    .select('article_slug', {count:'exact', head:true}).eq('article_slug',slug);
  return error ? null : count;
}

export async function addArticleView(slug) {
  if (isDemo || typeof slug !== 'string' || !/^[a-z0-9-]{1,200}$/.test(slug)) return null;
  const {error} = await client().from('article_views').insert({article_slug:slug});
  return error ? null : articleViewCount(slug);
}



export async function sectionNews(category, limit, offset = 0) {
  if (isDemo) return demo.filter(article => article.category === category).slice(offset, offset + limit);
  const {data, error} = await client().from('articles')
    .select('slug,category,title,summary,image,author,published_at')
    .or('category.eq.'+category+',secondary_categories.cs.{'+category+'}').order('published_at', {ascending:false}).range(offset, offset + limit - 1);
  if (error) throw new Error('تعذّر تحميل أخبار القسم');
  return data;
}
