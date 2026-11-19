import Link from 'next/link';
import {siteName, siteDescription} from '../lib/site';

export default function Footer({demo}) {
  return <footer className="site-footer"><div className="wrap footer-grid">
    <div className="footer-about"><Link className="brand" href="/">{siteName}<i/></Link><p>{siteDescription}</p>
      {demo && <small>نسخة تجريبية · مواد تحريرية توضيحية</small>}</div>
    <div><h2>عن الصحيفة</h2><ul>
      <li><Link href="/about">من نحن</Link></li>
      <li><Link href="/privacy">سياسة الخصوصية</Link></li>
    </ul></div>
    <div><h2>تصفّح الصحيفة</h2><ul><li><Link href="/?latest=1">آخر الأخبار</Link></li>
      <li><Link href="/?search=1">البحث في الأخبار</Link></li>
      <li><a href="#top">العودة إلى الأعلى ↑</a></li></ul></div>
  </div><div className="wrap footer-bottom"><bdi>Copyright © {new Date().getFullYear()}</bdi><span>{siteName} — جميع الحقوق محفوظة.</span></div></footer>;
}
