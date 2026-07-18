import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { logger } from '@/lib/logger';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Crypto Blog & Insights — Calculator Guides & Market Context | CalcCrypto',
  description:
    'Read CalcCrypto\'s educational blog covering crypto calculator tutorials, position sizing guides, DCA strategy explainers, tax insights, and honest white paper reviews. No hype, no price predictions.',
  alternates: { canonical: 'https://www.calccrypto.com/blog' },
  openGraph: {
    title: 'Crypto Blog & Insights — Educational Content from CalcCrypto',
    description:
      'Calculator guides, trading context, and crypto education. No hype, no price predictions.',
    url: 'https://www.calccrypto.com/blog',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Blog & Insights — Educational Content from CalcCrypto',
    description:
      'Calculator guides, trading context, and crypto education. No hype, no price predictions.',
  },
};

export default function BlogPage() {
  const blogPosts = getAllPosts();

  logger.log('TOTAL_BLOG_POSTS:', blogPosts.length);
  logger.log('BLOG_POSTS:', blogPosts.map(p => ({ title: p.title, slug: p.slug })));

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CrypCal Blog & Insights",
    "description": "Crypto insights, calculator guides, and tool tutorials from CrypCal.",
    "url": "https://www.calccrypto.com/blog",
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://www.calccrypto.com/blog/${post.slug}`,
      "datePublished": post.date,
      ...(post.image ? { "image": `https://www.calccrypto.com${post.image}` } : {})
    }))
  };

  return (
    <>
      <JsonLd schema={blogSchema} />
      <div className="min-h-screen bg-crypto-background">
      {/* Header */}
      <header className="border-b border-crypto-border bg-crypto-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">₿</div>
              <div className="text-2xl font-bold text-crypto-primary-600 dark:text-crypto-primary-400">
                CrypCal
              </div>
            </div>
            <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/calculators"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
              >
                Calculators
              </Link>
              <Link
                href="/channel"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
              >
                YouTube
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">📝</div>
            <h1 className="text-4xl font-bold text-crypto-foreground mb-4">
              Blog & Insights
            </h1>
            <p className="text-xl text-crypto-muted-foreground">
              Crypto insights, calculator guides, and tool tutorials.
            </p>
            <p className="text-sm text-crypto-muted-foreground mt-2">
              All content is educational and low-liability. No price predictions.
            </p>
          </div>

          {/* Blog Posts List */}
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="border border-crypto-border rounded-xl overflow-hidden hover:bg-crypto-muted/10 transition-colors group">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block"
                  >
                  {/* Featured Image (if available) */}
                  {post.image && (
                    <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
                      <Image
                        src={post.image}
                        alt={`Featured image for article: ${post.title}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-crypto-foreground mb-2 hover:text-crypto-primary-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-crypto-muted-foreground mb-3">
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-crypto-foreground">
                      {post.excerpt}
                    </p>
                    <span className="inline-block mt-4 text-crypto-primary-600 font-medium hover:underline">
                      Read more →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Related Tools */}
          <div className="mt-12 rounded-2xl border border-crypto-border bg-crypto-background/40 p-6">
            <h2 className="text-xl font-semibold text-crypto-foreground mb-4 text-center">
              Try the calculators behind the blog
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/calculators/profit-loss"
                className="px-4 py-2 rounded-lg border border-crypto-border text-sm text-crypto-foreground hover:bg-crypto-muted/30 transition-colors"
              >
                Profit & Loss
              </Link>
              <Link
                href="/calculators/position-size"
                className="px-4 py-2 rounded-lg border border-crypto-border text-sm text-crypto-foreground hover:bg-crypto-muted/30 transition-colors"
              >
                Position Size
              </Link>
              <Link
                href="/trade-decision-flow"
                className="px-4 py-2 rounded-lg border border-crypto-border text-sm text-crypto-foreground hover:bg-crypto-muted/30 transition-colors"
              >
                Trade Decision Flow
              </Link>
              <Link
                href="/channel"
                className="px-4 py-2 rounded-lg border border-crypto-border text-sm text-crypto-foreground hover:bg-crypto-muted/30 transition-colors"
              >
                YouTube Channel
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[44px]"
              style={{ background: '#667eea', color: '#ffffff' }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}