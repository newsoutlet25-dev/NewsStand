import {guideArticles} from '../../lib/news';
import {pageMetadata} from '../../lib/page-metadata';
import {sections} from '../../lib/sections';
import {absoluteUrl, siteDescription, siteName} from '../../lib/site';

export const dynamic = 'force-dynamic';

function inline(text) {
  return (text || '').replace(/\s+/g, ' ').trim().replace(/[\\[\]*_`<>]/g, '\\$&');
}

function entry(title, path, summary) {
  return `- [${inline(title)}](${absoluteUrl(path)})${summary ? ' — ' + inline(summary) : ''}`;
}

export async function GET() {
  const articles = await guideArticles();
  const lines = [
    '# ' + siteName, '', '> صحيفة رقمية باللغة العربية. ' + siteDescription, '',
    '## عن الصحيفة', '',
    entry('الرئيسية', '/'), entry('من نحن', '/about'), entry('فريق التحرير', '/authors/editorial-team'),
    entry('البحث في الأخبار', '/?search=1'), entry('سياسة الخصوصية', '/privacy'),
    entry('خريطة الموقع', '/sitemap.xml'), '', '## التصنيفات', '',
    ...Object.entries(sections).map(([key, name]) => entry(name, '/' + key, pageMetadata(key, '/' + key).description)),
    '', '## أرشيف الأخبار من الأحدث إلى الأقدم', '',
    ...articles.map(article => entry(article.title, '/news/' + encodeURIComponent(article.slug), article.summary)), ''
  ];
  return new Response(lines.join('\n'), {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}
