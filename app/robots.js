import {isDemo} from '../lib/news';
import {absoluteUrl} from '../lib/site';

const crawlers = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot',
  'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot'
];

export default function robots() {
  if (isDemo) return {rules:{userAgent:'*',disallow:'/'}};
  const disallow = ['/api/', '/admin'];
  return {
    rules: [
      {userAgent: '*', allow: '/', disallow},
      ...crawlers.map(userAgent => ({userAgent, allow: ['/', '/llms.txt'], disallow}))
    ],
    sitemap: absoluteUrl('/sitemap.xml')
  };
}
