'use client';
import {useState} from 'react';
import Link from 'next/link';
import {IconSearch} from '@tabler/icons-react';
import Published from './published';
import {sections as labels} from '../lib/sections';
const batchSize=6;
export function Shelf({articles,section,search,home}){
 const [term,setTerm]=useState('');
 const [limit,setLimit]=useState(batchSize);
 const visible=articles.filter(a=>(!section||a.category===section)&&(!search||(a.title+' '+a.summary).includes(term.trim())));
 const shown=home ? visible.slice(0,limit) : visible;
 const Heading=home ? 'h2' : 'h1';
 return <section id="latest" className={home ? undefined : 'catalog-page'}><div className="sectionTitle"><Heading>{search?'البحث في الأخبار':labels[section]||'آخر الأخبار'}</Heading><i/>{!home && <small>{visible.length.toLocaleString('ar-SA')} مواد</small>}</div>
 {search&&<label className="search"><IconSearch/><input autoFocus value={term} onChange={e=>setTerm(e.target.value)} placeholder="ابحث بعنوان الخبر أو محتواه" aria-label="كلمات البحث"/></label>}
 <div className="cards" id="shelf-cards">
   {shown.map(article => (
     <article key={article.slug}>
       <Link href={'/news/' + article.slug}>
         <img src={article.image} alt="" loading="lazy"/>
         <div className="card-copy">
           <small>{labels[article.category]}</small>
           <h3>{article.title}</h3>
           <Published story={article}/>
         </div>
       </Link>
     </article>
   ))}
 </div>
 {home && shown.length<visible.length && <button type="button" className="latest-more" aria-controls="shelf-cards" onClick={()=>setLimit(n=>n+batchSize)}>أعرض المزيد</button>}
 {!visible.length&&<p className="empty">لا توجد أخبار مطابقة.</p>}</section>;
}
