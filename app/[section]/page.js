import {notFound} from 'next/navigation';
import CategoryPage from '../category-page';
import {sections} from '../../lib/sections';
import {absoluteUrl, siteName} from '../../lib/site';

export async function generateMetadata({params, searchParams}) {
  const {section} = await params;
  if (!Object.hasOwn(sections, section)) notFound();
  const {page} = await searchParams;
  const url = absoluteUrl('/' + section + (Number(page)>1 ? '?page='+page : ''));
  const title = 'أخبار ' + sections[section];
  const description = 'آخر أخبار ' + sections[section] + ' وتقاريرها في ' + siteName + '.';
  return {title, description, alternates:{canonical:url}, openGraph:{siteName,title,description,url}};
}

export default async function Section({params, searchParams}) {
  return <CategoryPage category={(await params).section} page={(await searchParams).page}/>;
}
