'use client';

import {useEffect, useRef, useState} from 'react';
import {IconBrandWhatsapp, IconBrandX, IconLink, IconMinus, IconPlus} from '@tabler/icons-react';

export default function ArticleActions({title}) {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [size, setSize] = useState(100);
  const progress = useRef(null);
  useEffect(() => {
    setUrl(window.location.href.split('#')[0]);
    const body = document.querySelector('.reader-body');
    const update = () => {
      if (!body || !progress.current) return;
      const rect = body.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)));
      progress.current.style.transform = `scaleX(${ratio})`;
    };
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      body?.style.removeProperty('font-size');
    };
  }, []);
  function resize(next) {
    setSize(next);
    document.querySelector('.reader-body')?.style.setProperty('font-size', `${next / 100 * 1.15}rem`);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage('تم نسخ رابط الخبر');
    } catch {
      setMessage('تعذّر النسخ. يمكنك نسخ الرابط من شريط العنوان.');
    }
  }
  return <>
    <div className="reading-progress" aria-hidden="true" ref={progress}/>
    <div className="article-actions" aria-label="مشاركة الخبر وحجم النص">
      <span>شارك الخبر</span>
      <a href={url ? 'https://wa.me/?text=' + encodeURIComponent(title + '\n' + url) : undefined} target="_blank" rel="noopener noreferrer" aria-label="مشاركة عبر واتساب"><IconBrandWhatsapp size={20}/></a>
      <a href={url ? 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url) : undefined} target="_blank" rel="noopener noreferrer" aria-label="مشاركة عبر إكس"><IconBrandX size={19}/></a>
      <button type="button" onClick={copy} disabled={!url} aria-label="نسخ رابط الخبر"><IconLink size={20}/></button>
      <div className="text-size"><button type="button" disabled={size === 80} onClick={() => resize(size - 10)} aria-label="تصغير النص"><IconMinus size={17}/></button>
        <span>{size}%</span><button type="button" disabled={size === 150} onClick={() => resize(size + 10)} aria-label="تكبير النص"><IconPlus size={17}/></button></div>
    </div><p className="copy-message" role="status">{message}</p>
  </>;
}
