import Link from 'next/link';
import {sections} from '../lib/sections';
import {siteName, siteDescription} from '../lib/site';

export default function Footer({demo}) {
  return <footer className="site-footer"><div className="wrap footer-grid">
    <div className="footer-about"><Link className="brand" href="/">{siteName}<i/></Link><p>{siteDescription}</p>
      {demo && <small>نسخة تجريبية · مواد تحريرية توضيحية</small>}</div>
    <div><h2>الأقسام</h2><ul className="footer-sections">{Object.entries(sections).map(([key, label]) =>
      <li key={key}><Link href={'/?section=' + key}>{label}</Link></li>)}</ul></div>
    <div><h2>تصفّح الصحيفة</h2><ul><li><Link href="/?latest=1">آخر الأخبار</Link></li>
      <li><Link href="/?search=1">البحث في الأخبار</Link></li><li><Link href="/?saved=1">أخبارك المحفوظة</Link></li>
      <li><a href="#top">العودة إلى الأعلى ↑</a></li></ul></div>
  </div><div className="wrap footer-bottom">{siteName} · {new Date().getFullYear()}</div></footer>;
}
