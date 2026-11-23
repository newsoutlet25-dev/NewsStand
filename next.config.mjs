export default {
  // Keep metadata in the document head for browser SEO inspectors as well as crawlers.
  htmlLimitedBots: /.*/,
  async redirects() {
    const domains = ['newsstand-15r1.onrender.com', 'www.mshraq.com'].map(host => ({
      source: '/:path*',
      has: [{type: 'host', value: host.replaceAll('.', '\\.')}],
      destination: 'https://mshraq.com/:path*',
      permanent: true
    }));
    return [...domains, {
      source: '/news/okaz-:id([0-9]+)',
      destination: '/news/:id',
      permanent: true
    }];
  }
};
