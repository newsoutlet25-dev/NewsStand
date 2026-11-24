const categoryMap = new Map([
  ['local','local'], ['politics','politics'], ['world','politics'],
  ['economy','economy'], ['sport','sport'], ['sports','sport'], ['culture','culture'],
  ['entertainment','entertainment'], ['variety','variety'], ['technology','variety'],
  ['tourism','travel'], ['travel','travel'], ['سياحة','travel'], ['سياحة وسفر','travel'],
  ['الأخبار - العالم','politics'], ['الأخبار - المملكة اليوم','local'], ['الأخبار - منوعات','variety'],
  ['الاقتصاد','economy'], ['الثقافة والفن','culture'], ['الحياة - تكنولوجيا','variety'], ['الرياضة','sport']
]);

const strings = value => Array.isArray(value) ? value.filter(s=>typeof s==='string' && s.trim()) : [];
function webUrl(value) {
  if (typeof value !== 'string') return '';
  try { const url = new URL(value); return ['https:','http:'].includes(url.protocol) ? value : ''; }
  catch { return ''; }
}

export function toDraft(item) {
  if (!item || !(typeof item.id==='string' || Number.isSafeInteger(item.id)) || !String(item.id).trim())
    throw Error('Missing NewsRSS ID');
  const title = item.title;
  const body = [item.content_text,item.body,item.text,item.content_html].find(s=>typeof s==='string' && s.trim());
  const source = webUrl(item.source_link || item.source_url || item.link);
  if (typeof title!=='string' || !title.trim() || !body || !source) throw Error('Incomplete article');
  const sourceTags = Array.isArray(item.categories) ? item.categories : [];
  const targets = strings(item.target_categories);
  const categories = [...new Set([...targets,...sourceTags.map(t=>typeof t==='string'?t:t?.name).filter(Boolean),...strings(item.page_categories)])];
  const keys = [...targets,...sourceTags.map(t=>typeof t==='string'?t:t?.slug),...categories];
  const category = keys.map(k=>categoryMap.get(k)).find(Boolean) || 'variety';
  const images = [...new Set([...(Array.isArray(item.images)?item.images:[]),item.image_url,item.image].map(i=>webUrl(typeof i==='string'?i:i?.url || i?.src)).filter(Boolean))];
  const sourceDate = Date.parse(item.published_at);
  return {original:item,title,body,summary:typeof item.summary==='string' ? item.summary : body.slice(0,240),
    image:images[0] || '',additional_images:images.slice(1).map(url=>({url})),
    category,categories,source_url:source,source_name:typeof item.publisher==='string'?item.publisher:'',
    source_date:Number.isFinite(sourceDate)?new Date(sourceDate).toISOString():null};
}
