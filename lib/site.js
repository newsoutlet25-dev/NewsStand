export const siteName = 'مشراق';
export const siteDescription = 'أخبار السعودية والسياسة والاقتصاد والرياضة والثقافة والترفيه والسفر.';
export const siteUrl = 'https://mshraq.com';

export function absoluteUrl(path) {
  return new URL(path, siteUrl).href;
}

export function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
