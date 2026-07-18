import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { JsonLd } from '@/components/seo/JsonLd';

const channelUrl = 'https://www.youtube.com/@CalcCrypto';
const title = 'CalcCrypto YouTube Channel — White Paper Reviews & Crypto Analysis';
const description =
  'CalcCrypto reads the white papers so you do not have to: no price predictions, no hype, just honest crypto deep dives, protocol reviews, and project analysis backed by real numbers and free calculator tools.';

const YouTubeFeed = dynamic(() => import('@/components/YouTubeFeed'), {
  loading: () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-crypto-border/60 bg-crypto-background/40 overflow-hidden">
          <div className="aspect-video bg-white/5" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),
});

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/channel',
  },
  openGraph: {
    title,
    description,
    url: '/channel',
    siteName: 'CalcCrypto',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

const channelVideoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "CalcCrypto YouTube Channel",
  "description": "Honest crypto white paper deep dives, protocol reviews, and project analysis backed by real numbers and free calculator tools.",
  "thumbnailUrl": "https://img.youtube.com/vi/hqdefault.jpg",
  "publication": { "@type": "BroadcastEvent", "name": "CalcCrypto" },
  "associatedArticle": { "@type": "Article", "name": "CalcCrypto White Paper Reviews" },
  "author": {
    "@type": "Organization",
    "name": "CalcCrypto",
    "url": "https://www.calccrypto.com"
  }
};

export default function ChannelPage() {
  return (
    <>
      <JsonLd schema={channelVideoSchema} />

      <div className="min-h-screen bg-crypto-background">
        <header className="glass-card mx-4 mt-4">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center space-x-2" aria-label="CrypCal home">
                <div className="text-sm font-bold text-primary rounded-lg px-3 py-2 border border-crypto-border/60 bg-crypto-background/60">
                  CC
                </div>
                <div className="text-2xl font-bold text-primary">CrypCal</div>
              </Link>
              <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/calculators" className="text-secondary hover:text-primary transition-colors">
                  Calculators
                </Link>
                <Link href="/blog" className="text-secondary hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link href="/channel" className="text-primary font-medium">
                  YouTube
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-6xl space-y-8">
            <section className="text-center">
              <div className="mb-4 inline-flex items-center rounded-full border border-crypto-border/60 bg-crypto-background/60 px-3 py-1 text-sm text-secondary">
                Document-level crypto research
              </div>
              <h1 className="text-4xl font-bold text-primary md:text-5xl">
                CalcCrypto YouTube
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-secondary md:text-xl">
                We read the white papers so you don&rsquo;t have to &mdash; and we&rsquo;ll tell you straight whether they hold up.
              </p>
            </section>

            <section className="rounded-2xl border border-crypto-border/60 bg-crypto-background/40 p-6 text-secondary md:p-8">
              <div className="mx-auto max-w-4xl space-y-4 text-base leading-relaxed md:text-lg">
                <p>
                  CalcCrypto is the channel for people who want to understand crypto at the document level.
                  No price predictions. No hype. Just honest deep dives into the projects, protocols, and
                  papers that matter.
                </p>
                <p>
                  Backed by free tools to calculate profits, fees, and gains, because smart decisions start
                  with real numbers.
                </p>
              </div>
            </section>

            <section aria-labelledby="youtube-feed-heading" className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="youtube-feed-heading" className="text-2xl font-semibold text-primary">
                    Latest From The Channel
                  </h2>
                  <p className="mt-1 text-sm text-secondary">
                    Click any video to watch it here, or head to YouTube for the full channel.
                  </p>
                </div>
              </div>

              <YouTubeFeed className="w-full" maxResults={6} />
            </section>

            <section className="rounded-2xl border border-crypto-border/60 bg-crypto-background/40 px-6 py-6 text-center md:px-8">
              <h2 className="text-2xl font-semibold text-primary">Watch The Full Channel</h2>
              <p className="mx-auto mt-2 max-w-2xl text-secondary">
                Go straight to YouTube for every CalcCrypto deep dive, update, and paper review.
              </p>
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5 inline-flex min-h-[44px] items-center justify-center px-6 py-3 text-center"
              >
                Visit YouTube Channel
              </a>
            </section>

            {/* Internal links to calculators */}
            <section className="rounded-2xl border border-crypto-border/60 bg-crypto-background/40 px-6 py-6">
              <h2 className="text-xl font-semibold text-primary text-center mb-4">
                Run the Numbers Yourself
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/calculators/position-size"
                  className="px-4 py-2 rounded-lg border border-crypto-border/60 text-sm text-secondary hover:text-primary hover:border-crypto-border transition-colors"
                >
                  Position Size Calculator
                </Link>
                <Link
                  href="/liquidity-impact-calculator"
                  className="px-4 py-2 rounded-lg border border-crypto-border/60 text-sm text-secondary hover:text-primary hover:border-crypto-border transition-colors"
                >
                  Liquidity Impact Tool
                </Link>
                <Link
                  href="/trade-decision-flow"
                  className="px-4 py-2 rounded-lg border border-crypto-border/60 text-sm text-secondary hover:text-primary hover:border-crypto-border transition-colors"
                >
                  Trade Decision Flow
                </Link>
                <Link
                  href="/calculators"
                  className="px-4 py-2 rounded-lg border border-crypto-border/60 text-sm text-secondary hover:text-primary hover:border-crypto-border transition-colors"
                >
                  All Calculators
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}