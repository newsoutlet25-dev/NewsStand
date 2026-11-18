import '@fontsource-variable/noto-sans-arabic/wght.css';
import './style.css';
import './shell.css';
import {Suspense} from 'react';
import Navigation from './navigation';
import Footer from './footer';
import {siteName, siteDescription, siteUrl} from '../lib/site';
import Link from 'next/link';
import {IconSearch,IconBookmark,IconCalendar,IconWorld} from '@tabler/icons-react';
import {sections,isDemo} from '../lib/news';

export const metadata = {
  metadataBase: new URL(siteUrl || 'http://localhost:3101'),
  title: {default: siteName + ' | الصحيفة الرقمية', template: '%s | ' + siteName},
  description: siteDescription,
  robots: {index: Boolean(siteUrl) && !isDemo, follow: Boolean(siteUrl) && !isDemo},
  openGraph: {siteName, locale:'ar_SA', type:'website', title:siteName, description:siteDescription},
  twitter: {card:'summary_large_image'}
};
export const dynamic='force-dynamic';
export default function Layout({children}){
 const date=new Intl.DateTimeFormat('ar-SA-u-ca-gregory',{dateStyle:'full',timeZone:'Asia/Riyadh'}).format(new Date());
 return <html lang="ar" dir="rtl"><body id="top"><a className="skip-link" href="#content">انتقل إلى المحتوى</a><div className="utility"><div className="wrap"><span><IconCalendar size={15}/>{date}</span><span><IconWorld size={15}/> الرياض، المملكة العربية السعودية</span></div></div>
 <header className="wrap mast"><Link href="/" className="brand" aria-label="المرصد، الرئيسية">المرصد<i/></Link><div className="identity">صحيفة عربية رقمية<br/><small>من قلب الحدث</small></div><div className="tools"><Link href="/?search=1" aria-label="بحث"><IconSearch/></Link><Link href="/?saved=1" aria-label="الأخبار المحفوظة"><IconBookmark/></Link></div></header>
 <Suspense><Navigation/></Suspense>
 <main id="content" className="wrap">{children}</main><Footer demo={isDemo}/></body></html>;
}
