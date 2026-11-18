import Link from 'next/link';

export default function NotFound() {
  return <section className="empty-page"><small>404</small><h1>الصفحة غير موجودة</h1>
    <p>يمكنك متابعة آخر الأخبار أو البحث عن الخبر الذي تريده.</p>
    <Link href="/">العودة إلى الرئيسية</Link><Link href="/?search=1">البحث في الأخبار</Link></section>;
}
