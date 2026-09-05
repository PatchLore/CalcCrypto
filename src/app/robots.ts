import { MetadataRoute } from 'next'

/**
 * Crawler policy.
 *
 * The distinction that matters is training crawlers versus answer/search
 * crawlers. Blocking a training bot does not remove the site from that
 * vendor's search product, and blocking a search bot removes the site from
 * answers while doing nothing to stop training. They are separate tokens and
 * are treated separately below.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Google resolves conflicts by rule specificity (longest path wins),
        // falling back to the least restrictive rule on a tie. These Allow
        // entries are all longer than the Disallow patterns they override, so
        // rendering resources stay crawlable without weakening the rules below:
        //   /_next/image   Next.js image optimizer; every <Image> renders as
        //                  /_next/image?url=... Blocking it makes every
        //                  displayed image uncrawlable.
        //   /_next/static/ CSS, JS and font bundles needed to render the page.
        //   /favicon.ico   Next declares this with a cache-busting query
        //                  string, which /*?* would otherwise block.
        allow: ['/', '/_next/image', '/_next/static/', '/favicon.ico'],
        // /*?* keeps parameterized page URLs (UTM tags and similar) out of the
        // index to avoid duplicate content.
        disallow: ['/api/', '/_next/', '/*?*'],
      },

      // --- Answer and search crawlers: allowed, so the site can be cited ---
      // Each named group must repeat the disallow list, because a bot that
      // matches a named group ignores the '*' group entirely.
      ...['OAI-SearchBot', 'PerplexityBot', 'Bingbot', 'Claude-SearchBot', 'Claude-User'].map(
        (userAgent) => ({
          userAgent,
          allow: ['/', '/_next/image', '/_next/static/', '/favicon.ico'],
          disallow: ['/api/', '/_next/', '/*?*'],
        })
      ),

      // --- Model-training crawlers: blocked ---
      // Google-Extended governs Gemini training and grounding only. It does not
      // affect Googlebot or normal Google Search indexing.
      ...['GPTBot', 'ClaudeBot', 'anthropic-ai', 'Claude-Web', 'Google-Extended', 'CCBot', 'Bytespider', 'meta-externalagent', 'Applebot-Extended'].map(
        (userAgent) => ({
          userAgent,
          disallow: '/',
        })
      ),
    ],
    sitemap: 'https://www.calccrypto.com/sitemap.xml',
  }
}
