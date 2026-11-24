import Link from 'next/link';
import {notFound} from 'next/navigation';
import {articleViewCount,findNews,listNews,sections,clock,sectionNews} from '../../../lib/news';
import ViewCount from '../view-count';

import Discussion from '../../discussion';
import Published from '../../published';
import '../../reader.css';
import ArticleActions from '../../article-actions';
import {PageSchema, publisherId, team} from '../../page-schema';
import {absoluteUrl, siteName} from '../../../lib/site';

export async function generateMetadata({params}) {
  const a=await findNews((await params).slug);
  if (!a) return {};
  const canonical = a.seo_details?.canonical_url || absoluteUrl('/news/'+a.slug);
  const title = a.seo_title || a.title;
  const description = a.seo_description || a.summary;
  const {keywords,open_graph:og={},twitter={}} = a.seo_details || {};
  const socialImage = og.image || a.image || '/icon.png';
  return {
    title, description, keywords,
    ...(a.seo_details?.index!==undefined || a.seo_details?.follow!==undefined ? {robots:{index:a.seo_details.index ?? true,follow:a.seo_details.follow ?? true}} : {}),
    alternates:{canonical},
    openGraph:{type:'article',siteName,title:og.title || title,description:og.description || description,url:canonical,
      locale:'ar_SA',authors:[absoluteUrl('/authors/editorial-team')],publishedTime:a.published_at,section:sections[a.category],images:[{url:socialImage,alt:og.image_alt || a.title}]},
    twitter:{card:a.seo_details?.twitter_card || 'summary_large_image',title:twitter.title || og.title || title,description:twitter.description || og.description || description,
      images:[{url:twitter.image || socialImage,alt:twitter.image_alt || og.image_alt || a.title}]}
  };
}
export default async function Story({params}) {
  const a=await findNews((await params).slug);
  if (!a) notFound();
  const [section,latest,views]=await Promise.all([sectionNews(a.category,7),listNews(),articleViewCount(a.slug)]);
  const related=section.filter(b=>b.slug!==a.slug).slice(0,4);
  const following=latest.filter(b=>b.slug!==a.slug && !related.some(r=>r.slug===b.slug)).slice(0,6);
  const minutes=Math.max(1,Math.ceil(a.body.trim().split(/\s+/).length/200));
  const author = 'فريق التحرير';
  const structured = {
    '@id':absoluteUrl('/news/'+a.slug+'#article'), '@type':'NewsArticle',
    headline:a.title, description:a.seo_description || a.summary, keywords:a.seo_details?.keywords,
    image:[a.image,...(a.additional_images || []).map(photo=>photo.url)].filter(Boolean).map(url=>absoluteUrl(url)),
    datePublished:a.published_at, inLanguage:'ar', articleSection:sections[a.category],
    author:team,
    publisher:{'@id':publisherId},
    mainEntityOfPage:absoluteUrl('/news/'+a.slug)
  };
  return <div className="article-reader">
    <PageSchema path={structured.mainEntityOfPage} name={a.title} parents={[[sections[a.category],'/'+a.category]]} entity={structured}/>
    <nav className="reader-crumb" aria-label="مسار التنقل"><Link href="/">الرئيسية</Link> ‹ <Link href={'/'+a.category}>{sections[a.category]}</Link> ‹ <span aria-current="page">{a.title}</span></nav>
    <div className="reader-grid"><article className="reader-main">
      <header><div className="reading-meta"><Link href={'/'+a.category}>{sections[a.category]}</Link>
        </div><h1>{a.title}</h1></header>
      <div className="reader-author"><span className="avatar">م</span><div><b><Link href="/authors/editorial-team" rel="author" className="byline-link">{author}</Link></b>
        <small className="story-details"><span>نُشر في <Published story={a}/> · {clock(a.published_at)}</span>
          <ViewCount key={a.slug} slug={a.slug} initialCount={views}/>
          <span>مدة القراءة: {minutes===1?'دقيقة واحدة':minutes===2?'دقيقتان':minutes.toLocaleString('ar-SA')+(minutes%100>=3 && minutes%100<=10?' دقائق':' دقيقة')}</span>
        </small></div></div>
      {a.image && <figure style={{margin:0}}><img className="reader-photo" src={a.image} alt={a.lead_image_details?.alt ?? a.title} title={a.lead_image_details?.title}/>
        {a.lead_image_details?.caption && <figcaption>{a.lead_image_details.caption}</figcaption>}
        {a.lead_image_details?.description && <p>{a.lead_image_details.description}</p>}</figure>}
      <ArticleActions title={a.title} url={structured.mainEntityOfPage}/>
      <div className="reader-body">{a.body.split(/\n+/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div>
      {!!a.additional_images?.length && <section className="article-gallery" aria-label="صور الخبر">
        {a.additional_images.map((photo,index)=><figure key={index}>
          <img src={photo.url} alt={photo.alt ?? (photo.caption || a.title)} title={photo.title} loading="lazy"/>
          {photo.caption && <figcaption>{photo.caption}</figcaption>}
          {photo.description && <p>{photo.description}</p>}
        </figure>)}
      </section>}
      {!!a.tags?.length && <p aria-label="وسوم المقال">{a.tags.join(' · ')}</p>}
      <Discussion title={a.title} articleUrl={structured.mainEntityOfPage} excerpt={a.body.slice(0,600)} publication={siteName}/>
    </article>
    {!!related.length && <div className="related-rail"><h2>أخبار ذات علاقة</h2>
      {related.map(b=><Link key={b.slug} href={'/news/'+b.slug}><img src={b.image} alt=""/><div><h3>{b.title}</h3><Published story={b}/></div></Link>)}</div>}</div>
    {!!following.length && <section><h2 className="reader-heading">اقرأ أيضًا</h2><div className="category-archive">{following.map(b=><Link key={b.slug} href={'/news/'+b.slug}><img src={b.image} alt="" loading="lazy"/><div><small>{sections[b.category]}</small><h3>{b.title}</h3></div></Link>)}</div></section>}
  </div>;
}
