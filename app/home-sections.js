import Link from 'next/link';
import DepartmentRail from './department-rail';
import {sectionNews, sections} from '../lib/news';

const dateFormat = new Intl.DateTimeFormat('ar', {dateStyle:'long', timeZone:'Asia/Riyadh'});
const url = story => '/news/' + story.slug;
function DateLine({story}) {
  return <time dateTime={story.published_at}>{dateFormat.format(new Date(story.published_at))}</time>;
}
function Heading({category, title, action}) {
  return <header className="edition-heading"><h2>{title || sections[category]}</h2>
    {category && <Link href={'/?section='+category}>{action || 'كل الأخبار'} ←</Link>}
  </header>;
}
function Photo({story}) {
  return <img src={story.image} alt="" loading="lazy"/>;
}
function Department({stories,category}) {
  const [lead,...rest]=stories;
  return <section className="department" aria-labelledby={'department-'+category}>
    <header className="department-heading"><h2 id={'department-'+category}><Link href={'/?section='+category}>{sections[category]}</Link></h2><Link href={'/?section='+category} aria-label={'كل أخبار '+sections[category]}>المزيد ←</Link></header>
    <div className="department-sheet"><Link className="department-lead" href={url(lead)}><Photo story={lead}/><div><h3>{lead.title}</h3><DateLine story={lead}/><p>{lead.summary}</p></div></Link>
    <ol className="department-list">{rest.slice(0,2).map(story=><li key={story.slug}><Link href={url(story)}><h3>{story.title}</h3><DateLine story={story}/></Link></li>)}</ol></div>
  </section>;
}
export default async function HomeSections() {
  const keys=Object.keys(sections);
  const lists=await Promise.all(keys.map(key=>sectionNews(key,4)));
  const feeds=Object.fromEntries(keys.map((key,i)=>[key,lists[i]]));
  return <DepartmentRail>{keys.map(category => {
    if (!feeds[category].length) return null;
    return <Department key={category} category={category} stories={feeds[category]}/>;
  })}</DepartmentRail>;
}
