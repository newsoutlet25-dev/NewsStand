export default {
  async redirects() {
    return ['newsstand-15r1.onrender.com', 'www.mshraq.com'].map(host => ({
      source: '/:path*',
      has: [{type: 'host', value: host.replaceAll('.', '\\.')}],
      destination: 'https://mshraq.com/:path*',
      permanent: true
    }));
  }
};
