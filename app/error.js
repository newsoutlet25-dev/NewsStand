'use client';

export default function ErrorPage({reset}) {
  return <section className="empty-page"><h1>تعذّر تحميل الأخبار</h1>
    <p>حدثت مشكلة أثناء الاتصال. حاول تحميل الصفحة مرة أخرى.</p><button type="button" onClick={reset}>إعادة المحاولة</button></section>;
}
