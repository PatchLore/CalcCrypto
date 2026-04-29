'use client';

import Link from 'next/link';
import { trackNavigation } from '@/lib/analytics';
import Image from 'next/image';

export default function BlogPage() {
  const blogPosts = [
    {
      title: "Introducing the Token Price Calculator: Deterministic Risk Context for Crypto",
      slug: "token-price-calculator-launch",
      excerpt: "CalCrypto just added a new read-only tool: the Token Price Calculator. It fetches live market data and runs a deterministic risk scoring model to help you understand liquidity, valuation, and volume signals.",
      date: "2026-04-29",
      image: "/blog-images/token.png",
    },
    {
      title: "Top 5 Crypto Calculators Every Trader Should Use",
      slug: "2026-04-16-top-5-calculators",
      excerpt: "Essential tools for professional crypto trading and investment. From profit/loss tracking to tax calculations - build better trading habits.",
      date: "2026-04-16",
      image: "/blog-images/calculators.webp",
    },
    {
      title: "Bitcoin Reserves Are Shrinking – Why Traders Should Watch, Not Panic",
      slug: "2026-04-16-bitcoin-reserves-analysis",
      excerpt: "Exchange reserves just hit 2.683 million BTC. Low supply sounds bullish, but retail demand is weak. Here's how to trade both scenarios.",
      date: "2026-04-16",
      image: "/blog-images/bitcoin.jpg",
    },
    {
      title: "Understanding Our Deterministic Risk Scoring System",
      slug: "2026-04-16-risk-scoring-explained",
      excerpt: "No black boxes, no AI guesswork - just transparent math that you can verify. Learn how our risk detection system works.",
      date: "2026-04-16",
      image: "/blog-images/risk.jpg",
    },
    {
      title: "Welcome to CalCrypto: Beyond Basic Calculators",
      slug: "2026-04-16-welcome-to-calcrypto",
      excerpt: "Why we're building risk intelligence for crypto traders. Privacy-first, deterministic results, no signup required.",
      date: "2026-04-16",
      image: "/blog-images/welcome.jpg",
    },
  ];

  console.log('TOTAL_BLOG_POSTS:', blogPosts.length);
  console.log('BLOG_POSTS:', blogPosts.map(p => ({ title: p.title, slug: p.slug })));

  return (
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
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
                onClick={() => trackNavigation('/')}
              >
                Home
              </Link>
              <Link
                href="/calculators"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
                onClick={() => trackNavigation('/calculators')}
              >
                Calculators
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
              Crypto insights and tool guides.
            </p>
            <p className="text-sm text-crypto-muted-foreground mt-2">
              All content is educational and low-liability.
            </p>
          </div>

          {/* Blog Posts List */}
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="border border-crypto-border rounded-xl overflow-hidden hover:bg-crypto-muted/10 transition-colors">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block"
                  onClick={() => trackNavigation(`/blog/${post.slug}`)}
                >
                  {/* Featured Image (if available) */}
                  {post.image && (
                    <div className="relative w-full h-48 md:h-64 bg-crypto-muted/20">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ background: '#667eea', color: '#ffffff' }}
              onClick={() => trackNavigation('/')}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-crypto-border bg-crypto-background/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 text-sm text-crypto-muted-foreground">
            <div className="text-xs text-crypto-muted-foreground border-t border-crypto-border pt-4">
              <p>
                CalCrypto provides educational calculators only. All outputs are estimates based on public data. 
                This is not financial, tax, or legal advice. Cryptoassets are volatile and unregulated in many jurisdictions. 
                Consult a licensed professional before making decisions. We do not store user data or connect to wallets.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>© 2025 CrypCal. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  className="hover:text-crypto-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-crypto-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}