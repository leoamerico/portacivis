const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'portacivis.com' }],
        destination: 'https://portacivis.com.br/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.portacivis.com' }],
        destination: 'https://portacivis.com.br/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'portacivis.online' }],
        destination: 'https://portacivis.com.br/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.portacivis.online' }],
        destination: 'https://portacivis.com.br/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; frame-src 'self' https://vercel.live; form-action 'self'; img-src 'self' data: blob: https://vercel.com; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://r2cdn.perplexity.ai https://vercel.live; script-src 'self' 'unsafe-inline' https://vercel.live; script-src-elem 'self' 'unsafe-inline' https://vercel.live; connect-src 'self' https://servicodados.ibge.gov.br https://vercel.live wss://ws-us3.pusher.com; upgrade-insecure-requests",
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
      },
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
