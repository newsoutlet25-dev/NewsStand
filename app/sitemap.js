import {isDemo, listNews} from '../lib/news';
import {sections} from '../lib/sections';
import {absoluteUrl, siteUrl} from '../lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  if (!siteUrl || isDemo) return [];
  const articles = await listNews();
  return [
    {url:siteUrl},
    {url:absoluteUrl('/about')},
    {url:absoluteUrl('/privacy')},
    ...Object.keys(sections).map(section => ({url:absoluteUrl('/?section='+section)})),
    ...articles.map(article => ({url:absoluteUrl('/news/'+article.slug),lastModified:article.published_at}))
  ];
}
