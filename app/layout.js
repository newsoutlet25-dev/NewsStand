import '@fontsource-variable/noto-sans-arabic/wght.css';
import './style.css';
import './shell.css';
import './header.css';
import {Suspense} from 'react';
import Navigation from './navigation';
import {SiteSchema} from './page-schema';
import Footer from './footer';
import {siteName, siteDescription, siteUrl} from '../lib/site';
import Link from 'next/link';
import {IconSearch} from '@tabler/icons-react';
import {isDemo} from '../lib/news';

export const metadata = {
  metadataBase: new URL(siteUrl),
  verification: {google: 'WO5j4zbW7c84zY_QC7j3AlpF6m9ZsVNcRO3aY_XcJeQ'},
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

  return <html lang="ar" dir="rtl"><body id="top"><SiteSchema/>
    <svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true" focusable="false">
      <defs><filter id="navy-print" colorInterpolationFilters="sRGB">
        {/* Remap the press ink while anchoring the ivory paper color. */}
        <feColorMatrix type="matrix" values="-.16 1.16 0 0 .0364  .317 .683 0 0 -.00995  .286 -.286 1 0 -.00897  0 0 0 1 0"/>
      </filter>
      <filter id="press-paper-tone" colorInterpolationFilters="sRGB">
        {/* Keep the ink channels intact and bring paper highlights up to #faf8f5. */}
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0 0.04 0.08 0.12 0.16 0.2 0.24 0.28 0.32 0.36 0.4 0.44 0.48 0.52 0.56 0.6 0.64 0.6811 0.7243 0.7676 0.8108 0.8541 0.8973 0.9405 0.9818 1"/>
          <feFuncG type="table" tableValues="0 0.04 0.08 0.12 0.16 0.2 0.24 0.28 0.32 0.36 0.4 0.44 0.48 0.52 0.56 0.6 0.64 0.6824 0.7297 0.777 0.8242 0.8715 0.9188 0.9661 0.9853 1"/>
          <feFuncB type="table" tableValues="0 0.04 0.08 0.12 0.16 0.2 0.24 0.28 0.32 0.36 0.4 0.44 0.48 0.52 0.56 0.6 0.64 0.6842 0.7368 0.7895 0.8421 0.8947 0.9474 0.9714 0.9857 1"/>
        </feComponentTransfer>
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
