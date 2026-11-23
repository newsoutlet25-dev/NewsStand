import {notFound} from 'next/navigation';
import CategoryPage from '../category-page';
import {sections} from '../../lib/sections';
import {pageMetadata} from '../../lib/page-metadata';

export async function generateMetadata({params, searchParams}) {
  const {section} = await params;
  if (!Object.hasOwn(sections, section)) notFound();
  const {page} = await searchParams;
  const number = Number(page) || 1;
  return pageMetadata(section, '/' + section + (number > 1 ? '?page=' + number : ''), number);
}

export default async function Section({params, searchParams}) {
  return <CategoryPage category={(await params).section} page={(await searchParams).page}/>;
}
