'use client';
import Link from 'next/link';
import {useEffect, useRef} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {IconMenu2, IconSearch, IconX} from '@tabler/icons-react';
import {sections} from '../lib/sections';

export default function Navigation() {
  const pathname = usePathname();
  const params = useSearchParams();
  const selected = pathname === '/' ? params.get('section') : null;
  const home = pathname === '/' && !params.toString();
  const rail = useRef(null);
  const menu = useRef(null);
  const trigger = useRef(null);
  const query = params.toString();

  useEffect(() => {
    menu.current.open = false;
  }, [pathname, query]);

  useEffect(() => {
    const details = menu.current;
    const closeOutside = event => {
      if (details.open && !details.contains(event.target)) details.open = false;
    };
    const closeOnEscape = event => {
      if (details.open && event.key === 'Escape') {
        details.open = false;
        trigger.current.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 681px)');
    const closeOnDesktop = () => { if (desktop.matches) details.open = false; };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, []);

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
        <div className="mobile-navigation">
          <details className="section-menu" ref={menu}>
            <summary ref={trigger} aria-label="قائمة الأقسام">
              <IconMenu2 className="menu-open-icon" size={23} aria-hidden="true"/>
              <IconX className="menu-close-icon" size={23} aria-hidden="true"/>
            </summary>
            <div className="section-menu-links">
              {Object.entries(sections).map(([key, label]) => (
                <Link key={key} href={'/?section=' + key} aria-current={selected === key ? 'page' : undefined}
                  onClick={() => { menu.current.open = false; }}>
                  {label}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/?search=1" className="mobile-search" aria-label="البحث في الأخبار">
            <IconSearch size={23} aria-hidden="true"/>
          </Link>
        </div>
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
