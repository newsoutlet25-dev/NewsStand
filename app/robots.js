import {isDemo} from '../lib/news';
import {siteUrl, absoluteUrl} from '../lib/site';

export default function robots() {
  if (!siteUrl || isDemo) return {rules:{userAgent:'*',disallow:'/'}};
  return {rules:{userAgent:'*',allow:'/',disallow:['/*?search=','/*?saved=']},sitemap:absoluteUrl('/sitemap.xml')};
}
