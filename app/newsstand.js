import Link from 'next/link';
import {sections} from '../lib/sections';
import Published from './published';

export default function FeaturedNews({stories}) {
  if (!stories.length) return null;
  const [lead, ...rest] = stories;

  return (
    <section className="featured-news" aria-label="أبرز الأخبار">
      <article className="featured-lead">
        <Link href={'/news/' + lead.slug}>
          <img src={lead.image} alt="" fetchPriority="high"/>
          <span className="story-category">{sections[lead.category]}</span>
          <h1>{lead.title}</h1>
          <Published story={lead}/>
        </Link>
      </article>
      {rest.length > 0 && (
        <div className="featured-stories">
          {rest.map(story => (
            <article key={story.slug}>
              <Link href={'/news/' + story.slug} title={story.title}>
                <img src={story.image} alt=""/>
                <div>
                  <span className="story-category">{sections[story.category]}</span>
                  <h2>{story.title}</h2>
                  <Published story={story}/>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
