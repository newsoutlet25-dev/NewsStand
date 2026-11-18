'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {IconBookmark,IconSearch,IconClock} from '@tabler/icons-react';
import {sections as labels} from '../lib/sections';
function useSaved(){
 const [items,set]=useState([]);
 useEffect(()=>{function sync(){try{const v=JSON.parse(localStorage.getItem('marsad:saved'));set(Array.isArray(v)?v:[]);}catch{set([]);}}sync();window.addEventListener('storage',sync);window.addEventListener('savedNews',sync);return()=>{window.removeEventListener('storage',sync);window.removeEventListener('savedNews',sync);};},[]);
 return items;
}
export function Save({slug}){
 const items=useSaved(),on=items.includes(slug);
 return <button className={'save'+(on?' selected':'')} type="button" aria-label={on?'إلغاء حفظ الخبر':'حفظ الخبر'} aria-pressed={on} onClick={()=>{localStorage.setItem('marsad:saved',JSON.stringify(on?items.filter(v=>v!==slug):[...items,slug]));window.dispatchEvent(new Event('savedNews'));}}><IconBookmark size={19} fill={on?'currentColor':'none'}/></button>;
}
const batchSize=6;
export function Shelf({articles,section,search,saved,home}){
 const items=useSaved(),[term,setTerm]=useState('');
 const [limit,setLimit]=useState(batchSize);
 const visible=articles.filter(a=>(!section||a.category===section)&&(!saved||items.includes(a.slug))&&(!search||(a.title+' '+a.summary).includes(term.trim())));
 const shown=home ? visible.slice(0,limit) : visible;
 return <section id="latest"><div className="sectionTitle"><h2>{saved?'الأخبار المحفوظة':search?'البحث في الأخبار':labels[section]||'آخر الأخبار'}</h2><i/>{!home && <small>{visible.length.toLocaleString('ar-SA')} مواد</small>}</div>
 {search&&<label className="search"><IconSearch/><input autoFocus value={term} onChange={e=>setTerm(e.target.value)} placeholder="ابحث بعنوان الخبر أو محتواه" aria-label="كلمات البحث"/></label>}
 <div className="cards" id="shelf-cards">{shown.map(a=><article key={a.slug}><Link href={'/news/'+a.slug}><img src={a.image} alt="" loading="lazy"/><small>{labels[a.category]}</small><h3>{a.title}</h3></Link><Save slug={a.slug}/></article>)}</div>
 {home && shown.length<visible.length && <button type="button" className="latest-more" aria-controls="shelf-cards" onClick={()=>setLimit(n=>n+batchSize)}>أعرض المزيد</button>}
 {!visible.length&&<p className="empty">{saved?'يمكنك حفظ الأخبار باستخدام علامة الحفظ على كل خبر.':'لا توجد أخبار مطابقة.'}</p>}</section>;
}
