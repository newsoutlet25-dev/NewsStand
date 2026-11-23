import {NextResponse} from 'next/server';
import {sections} from './lib/sections';
import {absoluteUrl} from './lib/site';

export function proxy(request) {
  const url = request.nextUrl.clone();
  const section = url.searchParams.get('section');
  if (Object.hasOwn(sections, section) && !url.searchParams.get('search') && !url.searchParams.get('saved')) {
    url.pathname = '/' + section;
    url.searchParams.delete('section');
    url.searchParams.delete('latest');
    if (url.searchParams.get('page') === '1') url.searchParams.delete('page');
    return NextResponse.redirect(absoluteUrl(url.pathname + url.search), 308);
  }
  return NextResponse.next();
}
export const config = {matcher: '/'};
