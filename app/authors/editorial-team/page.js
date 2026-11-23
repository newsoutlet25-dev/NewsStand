import Link from 'next/link';
import {listNews, sections} from '../../../lib/news';
import {PageSchema, team} from '../../page-schema';
import Published from '../../published';
import '../../reader.css';

import {pageMetadata} from '../../../lib/page-metadata';

export const metadata = pageMetadata('team', '/authors/editorial-team');

export default async function EditorialTeamPage() {
  const stories = await listNews();
  return <div className="category-reader">
    <PageSchema type="ProfilePage" path="/authors/editorial-team" name={team.name} entity={team}/>
    <header className="category-banner">
      <div className="reader-crumb"><Link href="/">الرئيسية</Link> ‹ فريق التحرير</div>
      <h1>فريق التحرير</h1>
      <p>فريق تحرير مشراق.</p>
    </header>
    <section aria-labelledby="team-news">
      <h2 id="team-news" className="reader-heading">أحدث أخبار الفريق</h2>
      <div className="category-archive">{stories.map(story =>
        <Link key={story.slug} href={'/news/' + story.slug}>
          <img src={story.image} alt="" loading="lazy"/>
          <div><small>{sections[story.category]} · <Published story={story}/></small><h3>{story.title}</h3></div>
        </Link>
      )}</div>
      {!stories.length && <p className="empty">لا توجد أخبار منشورة بعد.</p>}
    </section>
  </div>;
}
