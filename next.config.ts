import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  trailingSlash: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.coingecko.com' },
      { protocol: 'https', hostname: 'coin-images.coingecko.com' },
      { protocol: 'https', hostname: 'dd.dexscreener.com' },
      { protocol: 'https', hostname: 'assets.dexscreener.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      // Redirect empty/stale calculator directories to real pages (fix redirect chains)
      {
        source: '/calculators/convert',
        destination: '/calculators/conversion',
        permanent: true,
      },
      {
        source: '/calculators/convert/:path*',
        destination: '/calculators/conversion/:path*',
        permanent: true,
      },
      {
        source: '/calculators/portfolio',
        destination: '/calculators',
        permanent: true,
      },
      {
        source: '/calculators/trade',
        destination: '/calculators',
        permanent: true,
      },
      // Fix broken blog links that lack /calculators/ prefix
      {
        source: '/profit-loss',
        destination: '/calculators/profit-loss',
        permanent: true,
      },
      {
        source: '/dca',
        destination: '/calculators/dca',
        permanent: true,
      },
      {
        source: '/portfolio',
        destination: '/calculators',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
};

export default nextConfig;