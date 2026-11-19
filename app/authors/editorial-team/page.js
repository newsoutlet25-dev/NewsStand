import Link from 'next/link';
import {listNews, sections} from '../../../lib/news';
import Published from '../../published';
import '../../reader.css';

export const metadata = {
  title: 'فريق التحرير',
  description: 'أحدث الأخبار والتقارير المنشورة بتوقيع فريق تحرير مركاز.',
  alternates: {canonical: '/authors/editorial-team'}
};

export default async function EditorialTeamPage() {
  const stories = await listNews();
  return <div className="category-reader">
    <header className="category-banner">
      <div className="reader-crumb"><Link href="/">الرئيسية</Link> ‹ فريق التحرير</div>
      <h1>فريق التحرير</h1>
      <p>فريق تحرير مركاز.</p>
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
