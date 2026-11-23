import {NextResponse} from 'next/server';
import {sections} from './lib/sections';

export function proxy(request) {
  const url = request.nextUrl.clone();
  const section = url.searchParams.get('section');
  if (Object.hasOwn(sections, section) && !url.searchParams.get('search') && !url.searchParams.get('saved')) {
    url.pathname = '/' + section;
    url.searchParams.delete('section');
    url.searchParams.delete('latest');
    if (url.searchParams.get('page') === '1') url.searchParams.delete('page');
    return new NextResponse(null, {status:308, headers:{Location:url.pathname + url.search}});
  }
  return NextResponse.next();
}
export const config = {matcher: '/'};
