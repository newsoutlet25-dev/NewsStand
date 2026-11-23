import '@fontsource-variable/noto-sans-arabic/wght.css';
import './style.css';
import './shell.css';
import './header.css';
import {Suspense} from 'react';
import Navigation from './navigation';
import Footer from './footer';
import {siteName, siteDescription, siteUrl} from '../lib/site';
import Link from 'next/link';
import {IconSearch} from '@tabler/icons-react';
import {isDemo} from '../lib/news';

export const metadata = {
  metadataBase: new URL(siteUrl || 'http://localhost:3101'),
  title: {default: siteName + ' | الصحيفة الرقمية', template: '%s | ' + siteName},
  description: siteDescription,
  robots: {index: Boolean(siteUrl) && !isDemo, follow: Boolean(siteUrl) && !isDemo},
  openGraph: {siteName, locale:'ar_SA', type:'website', title:siteName, description:siteDescription},
  twitter: {card:'summary_large_image'}
};
export const dynamic='force-dynamic';
export default function Layout({children}) {
  const now = new Date();
  const date = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-arab', {
    dateStyle: 'full',
    timeZone: 'Asia/Riyadh'
  }).format(now);

  return <html lang="ar" dir="rtl"><body id="top">
    <svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true" focusable="false">
      <defs><filter id="navy-print" colorInterpolationFilters="sRGB">
        {/* Remap the press ink while anchoring the ivory paper color. */}
        <feColorMatrix type="matrix" values="-.16 1.16 0 0 .0364  .317 .683 0 0 -.00995  .286 -.286 1 0 -.00897  0 0 0 1 0"/>
      </filter></defs>
    </svg>
    <a className="skip-link" href="#content">انتقل إلى المحتوى</a>
    <header className="site-header">
      <div className="wrap edition-mast">
        <Link href="/" className="edition-name" aria-label={siteName + '، الرئيسية'}>{siteName}</Link>
        <div className="edition-dateline">
          <span>الرياض</span>
          <time dateTime={now.toISOString()}>{date}</time>
        </div>
        <Link href="/?search=1" className="edition-search" aria-label="البحث في الأخبار">
          <IconSearch size={19} stroke={1.7} aria-hidden="true"/>
          <span>بحث</span>
        </Link>
      </div>
      <Suspense><Navigation/></Suspense>
    </header>
    <main id="content" className="wrap site-content">{children}</main>
    <Footer demo={isDemo}/>
  </body></html>;
}
