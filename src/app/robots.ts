import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Google resolves conflicts by rule specificity (longest path wins),
        // falling back to the least restrictive rule on a tie. These Allow
        // entries are all longer than the Disallow patterns they override, so
        // they carve out rendering resources without weakening the intent of
        // the broader rules below:
        //   /_next/image   — Next.js image optimizer; every <Image> on the site
        //                    renders as /_next/image?url=... Blocking it means
        //                    Google cannot crawl a single displayed image.
        //   /_next/static/ — CSS, JS and font bundles. Google renders pages
        //                    before indexing and needs these to see layout.
        //   /favicon.ico   — Next declares this with a cache-busting query
        //                    string, which /*?* would otherwise block.
        allow: ['/', '/_next/image', '/_next/static/', '/favicon.ico'],
        // /*?* keeps parameterized page URLs (UTM tags and similar) out of the
        // index to avoid duplicate content. It is intentionally broad; the
        // Allow rules above are what keep it from catching build assets.
        disallow: ['/api/', '/_next/', '/*?*'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      {
        userAgent: 'CCBot',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
    ],
    sitemap: 'https://www.calccrypto.com/sitemap.xml',
  }
}
