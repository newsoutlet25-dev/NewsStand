'use client';
import Link from 'next/link';
import {useEffect, useRef} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {sections} from '../lib/sections';

export default function Navigation() {
  const pathname = usePathname();
  const params = useSearchParams();
  const selected = pathname === '/' ? params.get('section') : null;
  const home = pathname === '/' && !params.toString();
  const rail = useRef(null);

  useEffect(() => {
    const track = rail.current;
    const current = track.querySelector('[aria-current="page"]');
    if (!current) return;
    const link = current.getBoundingClientRect();
    const frame = track.getBoundingClientRect();
    if (link.left < frame.left) track.scrollLeft += link.left - frame.left;
    else if (link.right > frame.right) track.scrollLeft += link.right - frame.right;
  }, [selected, home]);

  return (
    <nav className="wrap site-navigation" aria-label="القائمة الرئيسية">
      <div className="nav-fascia">
        <div className="nav" ref={rail}>
          <Link href="/" aria-current={home ? 'page' : undefined}>الرئيسية</Link>
          {Object.entries(sections).map(([key, label]) => (
            <Link key={key} href={'/?section=' + key} aria-current={selected === key ? 'page' : undefined}>
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="nav-rafters" aria-hidden="true"><i/><i/><i/></div>
    </nav>
  );
}
