import Link from 'next/link';
import {listNews, sections} from '../lib/news';
import {Shelf} from './shelf';
import './front.css';
import CategoryPage from './category-page';
import HomeSections from './home-sections';
import {absoluteUrl, siteName} from '../lib/site';

const dateFormat = new Intl.DateTimeFormat('ar', {
  dateStyle: 'full', timeZone: 'Asia/Riyadh', numberingSystem: 'latn'
});
function DateLine({story}) {
  return <time dateTime={story.published_at}>{dateFormat.format(new Date(story.published_at))}</time>;
}
function Highlights({stories}) {
  const [lead, ...rest] = stories;
  return <section className="highlights" aria-label="أبرز الأخبار">
    <article className="front-lead">
      <Link href={'/news/' + lead.slug}>
        <div className="front-photo"><img src={lead.image} alt=""/><span>{sections[lead.category]}</span></div>
        <h1>{lead.title}</h1>
        <p>{lead.summary}</p>
        <DateLine story={lead}/>
      </Link>
    </article>
    {rest.length > 0 && <ol className="front-ranks" start={2}>{rest.map((story, index) =>
      <li key={story.slug}><Link href={'/news/' + story.slug}>
        <div>
          <div className="front-meta"><b aria-hidden="true">{index + 2}</b><strong>{sections[story.category]}</strong><span>·</span><DateLine story={story}/></div>
          <h2>{story.title}</h2>
        </div>
        <img src={story.image} alt=""/>
      </Link></li>
    )}</ol>}
  </section>;
}
export async function generateMetadata({searchParams}) {
  const query = await searchParams;
  const category = typeof query.section === 'string' ? sections[query.section] : null;
  const title = category ? 'أخبار ' + category : query.search ? 'البحث في الأخبار' : query.saved ? 'الأخبار المحفوظة' : query.latest ? 'آخر الأخبار' : siteName;
  const description = category ? 'آخر أخبار ' + category + ' وتقاريرها في ' + siteName + '.' : 'أخبار السعودية والعالم وتغطيات السياسة والاقتصاد والرياضة والثقافة.';
  const canonical = new URLSearchParams();
  if (category) canonical.set('section', query.section);
  if (query.latest) canonical.set('latest','1');
  if (query.page && /^[1-9]\d*$/.test(query.page) && Number(query.page)>1) canonical.set('page',query.page);
  const path = canonical.size ? '/?' + canonical.toString() : '/';
  return {
    title, description,
    alternates: {canonical:absoluteUrl(path)},
    openGraph: {title, description, url:absoluteUrl(path)},
    ...((query.search || query.saved) && {robots:{index:false, follow:true}})
  };
}
export default async function Page({searchParams}) {
  const q = await searchParams;
  if (q.section && !q.search && !q.saved) return <CategoryPage category={q.section} page={q.page}/>;
  const articles = await listNews();
  const home = !(q.section || q.search || q.saved || q.latest);
  const featured = articles.filter(article => article.featured).slice(0, 5);
  const highlights = featured.length ? featured : articles.slice(0, 1);
  const excluded = new Set(highlights.map(article => article.slug));
  const shelf = home ? articles.filter(article => !excluded.has(article.slug)) : articles;
  return <>
    {home && highlights.length > 0 && <Highlights stories={highlights}/>}
    <Shelf articles={shelf} section={q.section} search={q.search} saved={q.saved} home={home}/>
    {home && <HomeSections/>}
  </>;
}
