'use client';

import Link from 'next/link';
import {usePathname, useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {IconMenu2, IconX} from '@tabler/icons-react';
import {sections} from '../lib/sections';

export default function Navigation() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();
  const selected = params.get('section');
  const home = pathname === '/' && !params.toString();
  return <nav className="site-navigation" aria-label="القائمة الرئيسية">
    <div className="wrap">
      <button className="menu-toggle" type="button" aria-expanded={expanded} aria-controls="site-sections" onClick={() => setExpanded(!expanded)}>
        {expanded ? <IconX size={20}/> : <IconMenu2 size={20}/>} الأقسام
      </button>
      <div id="site-sections" className={'nav' + (expanded ? ' expanded' : '')}>
        <Link href="/" aria-current={home ? 'page' : undefined} onClick={() => setExpanded(false)}>الرئيسية</Link>
        {Object.entries(sections).map(([key, label]) => <Link key={key} href={'/?section=' + key}
          aria-current={pathname === '/' && selected === key ? 'page' : undefined} onClick={() => setExpanded(false)}>{label}</Link>)}
      </div>
    </div>
  </nav>;
}
