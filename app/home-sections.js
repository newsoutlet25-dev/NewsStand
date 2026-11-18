import Link from 'next/link';
import {sectionNews, sections} from '../lib/news';

const columns = Object.keys(sections).filter(key => key !== 'sport');
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
function Sport({stories}) {
  return <section className="edition sport-edition"><Heading category="sport"/>
    <div className="sports-row">{stories.map(story=><Link key={story.slug} href={url(story)}>
      <Photo story={story}/><h3>{story.title}</h3><DateLine story={story}/>
    </Link>)}</div></section>;
}
function LeadSection({stories, category}) {
  const [lead,...others]=stories;
  return <section className="edition"><Heading category={category} action={'كل أخبار '+sections[category]}/>
    <div className="world-grid"><Link className="world-lead" href={url(lead)}>
      <Photo story={lead}/><h3>{lead.title}</h3><p>{lead.summary}</p><DateLine story={lead}/>
    </Link><div className="world-list">{others.map(story=><Link key={story.slug} href={url(story)}>
      <Photo story={story}/><div><h3>{story.title}</h3><DateLine story={story}/></div>
    </Link>)}</div></div></section>;
}
function Tile({story}) {
  return <Link className="variety-tile" href={url(story)}><Photo story={story}/>
    <div><h3>{story.title}</h3><DateLine story={story}/></div></Link>;
}
function TileSection({stories, category}) {
  return <section className="edition"><Heading category={category} action={'كل أخبار '+sections[category]}/>
    <div className="variety-grid"><Tile story={stories[0]}/><div className="variety-small">
      {stories.slice(1).map(story=><Tile key={story.slug} story={story}/>)}
    </div></div></section>;
}
function OtherSections({feeds}) {
  return <section className="edition" id="other-sections"><Heading title="أخبار الأقسام"/>
    <div className="other-grid">{columns.filter(key=>feeds[key].length).map(key=><article className="index-column" key={key}>
      <h3><Link href={'/?section='+key}>{sections[key]} <span aria-hidden="true">←</span></Link></h3>
      <ol>{feeds[key].slice(0,4).map((story,i)=><li key={story.slug}><Link href={url(story)}>
        <b aria-hidden="true">{i+1}</b><div><h4>{story.title}</h4><DateLine story={story}/></div>
      </Link></li>)}</ol>
    </article>)}</div></section>;
}
export default async function HomeSections() {
  const keys=Object.keys(sections);
  const lists=await Promise.all(keys.map(key=>sectionNews(key,['culture','variety'].includes(key)?5:4)));
  const feeds=Object.fromEntries(keys.map((key,i)=>[key,lists[i]]));
  const layouts = {sport: Sport, culture: TileSection, variety: TileSection};
  return <>{keys.map(category => {
    if (!feeds[category].length) return null;
    const Layout = layouts[category] || LeadSection;
    return <Layout key={category} category={category} stories={feeds[category]}/>;
  })}
    {columns.some(key=>feeds[key].length>0) && <OtherSections feeds={feeds}/>}
  </>;
}
