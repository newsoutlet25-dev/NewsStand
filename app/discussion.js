'use client';
import {useEffect, useState} from 'react';
import {IconBrandOpenai,IconSparkles,IconAsterisk,IconBrandX} from '@tabler/icons-react';

const providers=[
  ['ChatGPT','https://chatgpt.com/?hints=search',IconBrandOpenai],
  ['Gemini','https://www.google.com/search?udm=50&aep=11',IconSparkles],
  ['Claude','https://claude.ai/new',IconAsterisk],
  ['Grok','https://grok.com/',IconBrandX]
];
export default function Discussion({title,excerpt,slug,publication}) {
  const [origin,setOrigin]=useState('');
  useEffect(()=>{setOrigin(window.location.origin);},[]);
  const articleUrl=origin+'/news/'+encodeURIComponent(slug);
  const prompt=[`ناقش معي هذا الخبر من صحيفة ${publication}.`,title,articleUrl,'مقتطف من الخبر: '+excerpt,
    'لخّص أهم ما ورد فيه، واشرح أثره المحتمل على القارئ. ميّز بين ما يقوله النص والاستنتاجات، واذكر المصدر.'].join('\n');
  return <section id="discuss" className="discussion" aria-label="ناقش الخبر مع الذكاء الاصطناعي">
    <h2>ناقش الخبر مع الذكاء الاصطناعي</h2>
    <div>{providers.map(([label,base,Icon])=>{
      const target=new URL(base);
      target.searchParams.set('q',prompt);
      return <a key={label} href={origin?target.href:undefined} target="_blank" rel="noopener noreferrer"
        aria-label={'ناقش الخبر مع '+label+' (يفتح في تبويب جديد)'}><Icon size={16}/><bdi>{label}</bdi></a>;
    })}</div></section>;
}
