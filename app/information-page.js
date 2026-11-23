import {PageSchema} from './page-schema';
import Link from 'next/link';
import './information.css';

export default function InformationPage({title, introduction, children, updated, path, type}) {
  return <article className="information-page">
    <PageSchema name={title} path={path} type={type}/>
    <div className="information-breadcrumb"><Link href="/">الرئيسية</Link><span aria-hidden="true">/</span><span>{title}</span></div>
    <header className="information-header">
      <h1>{title}</h1>
      <p>{introduction}</p>
      {updated && <small>آخر تحديث: <time dateTime="2026-11-19">19 نوفمبر 2026</time></small>}
    </header>
    <div className="information-body">{children}</div>
    <div className="information-links"><Link href="/about">من نحن</Link><Link href="/privacy">سياسة الخصوصية</Link><Link href="/">العودة للرئيسية</Link></div>
  </article>;
}
