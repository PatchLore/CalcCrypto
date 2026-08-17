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
    // Every host here is a live fetch target for the image optimizer, so this
    // list is the optimizer's attack surface — keep it to hosts actually
    // rendered through next/image. Audited: the only remote <Image> in the
    // codebase is the YouTube thumbnail in components/YouTubeFeed.tsx, whose
    // URLs come from the Data API on i.ytimg.com. The CoinGecko and DexScreener
    // entries were confusing the API hosts (api.coingecko.com,
    // api.dexscreener.com — used for price data, not images) with their image
    // CDNs, which nothing renders. img.youtube.com appeared only in a JSON-LD
    // string, which never routes through the optimizer.
    // Re-add deliberately if Phase 2 starts rendering token logos.
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
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