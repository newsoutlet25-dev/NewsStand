export const siteName = 'المرصد';
export const siteDescription = 'أخبار السعودية والسياسة والاقتصاد والرياضة والثقافة والترفيه والسفر.';
const publicOrigin = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL;
export const siteUrl = publicOrigin ? new URL(publicOrigin).origin : null;

export function absoluteUrl(path) {
  return siteUrl ? new URL(path, siteUrl).href : undefined;
}

export function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
