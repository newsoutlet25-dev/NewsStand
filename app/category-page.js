import Link from 'next/link';
import {notFound} from 'next/navigation';
import {sectionNews, sections} from '../lib/news';
import './reader.css';

import Published from './published';
const path = story => '/news/' + story.slug;
export default async function CategoryPage({category, page='1'}) {
  if (!Object.hasOwn(sections,category) || !/^[1-9]\d{0,5}$/.test(page)) notFound();
  const number=Number(page), size=23, name=sections[category];
  const found=await sectionNews(category,size+1,(number-1)*size);
  if (number>1 && !found.length) notFound();
  const stories=found.slice(0,size);
  const lead=number===1 && stories[0];
  const supporting=lead ? stories.slice(1,5) : [];
  const archive=lead ? stories.slice(5) : stories;
  const pageLink=n=>'/?section='+category+'&page='+n;
  return <div className="category-reader">
    <header className="category-banner"><div className="reader-crumb"><Link href="/">الرئيسية</Link> ‹ {name}</div>
      <small>قسم</small><h1>{name}</h1><p>آخر الأخبار والتقارير في قسم {name}.</p></header>
    {lead && <section aria-label={'أبرز أخبار '+name}>
      <Link className="category-lead" href={path(lead)}><img src={lead.image} alt=""/><div>
        <b>الأبرز</b><small>{name} · <Published story={lead}/></small><h2>{lead.title}</h2>
        <p>{lead.summary}</p><strong>اقرأ الخبر ←</strong></div></Link>
      {!!supporting.length && <div className="category-minis">{supporting.map(a=><Link key={a.slug} href={path(a)}>
        <img src={a.image} alt=""/><div><Published story={a}/><h3>{a.title}</h3></div></Link>)}</div>}
    </section>}
    {!!archive.length && <section><h2 className="reader-heading">المزيد من {name}</h2><div className="category-archive">
      {archive.map(a=><Link key={a.slug} href={path(a)}><img src={a.image} alt="" loading="lazy"/><div>
        <Published story={a}/><h3>{a.title}</h3><p>{a.summary}</p></div></Link>)}</div></section>}
    {!stories.length && <p className="empty">لا توجد أخبار منشورة في هذا القسم بعد.</p>}
    {(number>1 || found.length>size) && <div className="category-pages">
      {number>1 && <Link href={pageLink(number-1)}>الصفحة السابقة</Link>} صفحة {number}
      {found.length>size && <Link href={pageLink(number+1)}>الصفحة التالية</Link>}</div>}
  </div>;
}
