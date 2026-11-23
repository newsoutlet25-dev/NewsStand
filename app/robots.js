import {isDemo} from '../lib/news';
import {absoluteUrl} from '../lib/site';

export default function robots() {
  if (isDemo) return {rules:{userAgent:'*',disallow:'/'}};
  return {rules:{userAgent:'*',allow:'/'},sitemap:absoluteUrl('/sitemap.xml')};
}
