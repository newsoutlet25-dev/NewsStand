import {permanentRedirect} from 'next/navigation';
import {PageSchema} from './page-schema';
import Newsstand from './newsstand';
import {listNews, sections} from '../lib/news';
import {Shelf} from './shelf';
import './front.css';
import CategoryPage from './category-page';
import HomeSections from './home-sections';
import {absoluteUrl, siteName} from '../lib/site';

export async function generateMetadata({searchParams}) {
  const query = await searchParams;
  const category = !query.search && Object.hasOwn(sections, query.section) ? sections[query.section] : null;
  const title = category ? 'أخبار ' + category : query.search ? 'البحث في الأخبار' : query.latest ? 'آخر الأخبار' : siteName;
  const description = category ? 'آخر أخبار ' + category + ' وتقاريرها في ' + siteName + '.' : 'أخبار السعودية والعالم وتغطيات السياسة والاقتصاد والرياضة والثقافة.';
  const canonical = new URLSearchParams();
  if (category) canonical.set('section', query.section);
  if (query.search) canonical.set('search','1');
  else if (!category && query.latest) canonical.set('latest','1');
  if (category && /^[1-9]\d*$/.test(query.page) && Number(query.page)>1) canonical.set('page',query.page);
  const path = canonical.size ? '/?' + canonical.toString() : '/';
  return {
    title:title === siteName ? {absolute:siteName} : title, description,
    alternates: {canonical:absoluteUrl(path)},
    openGraph: {siteName, title, description, url:absoluteUrl(path)},
    ...(query.search && {robots:{index:false, follow:true}})
  };
}
export default async function Page({searchParams}) {
  const q = await searchParams;
  if (q.saved) permanentRedirect('/?latest=1');
  if (q.section && !q.search) return <CategoryPage category={q.section} page={q.page}/>;
  const articles = await listNews();
  const home = !(q.section || q.search || q.latest);
  const featured = articles.filter(article => article.featured).slice(0, 5);
  const highlights = [...featured, ...articles.filter(article => !featured.some(item => item.slug === article.slug))].slice(0, 4);
  const excluded = new Set(highlights.map(article => article.slug));
  const shelf = home ? articles.filter(article => !excluded.has(article.slug)) : articles;
  return <div className={home ? "news-home" : undefined}>
    <PageSchema path={q.search?'/?search=1':q.latest?'/?latest=1':'/'} type={q.search?'SearchResultsPage':'CollectionPage'} name={q.search?'البحث في الأخبار':q.latest?'آخر الأخبار':siteName}/>
    {home && highlights.length > 0 && <Newsstand stories={highlights}/>}
    <Shelf articles={shelf} section={q.section} search={q.search} home={home}/>
    {home && <HomeSections/>}
  </div>;
}
