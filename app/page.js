import {permanentRedirect} from 'next/navigation';
import {PageSchema} from './page-schema';
import Newsstand from './newsstand';
import {listNews, sections} from '../lib/news';
import {Shelf} from './shelf';
import './front.css';
import CategoryPage from './category-page';
import HomeSections from './home-sections';
import {pageMetadata} from '../lib/page-metadata';
import {siteName} from '../lib/site';

export async function generateMetadata({searchParams}) {
  const query = await searchParams;
  if (query.search) return pageMetadata('search', '/?search=1');
  if (Object.hasOwn(sections, query.section)) {
    const page = Number(query.page) || 1;
    return pageMetadata(query.section, '/' + query.section + (page > 1 ? '?page=' + page : ''), page);
  }
  return query.latest ? pageMetadata('latest', '/?latest=1') : pageMetadata('home', '/');
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
