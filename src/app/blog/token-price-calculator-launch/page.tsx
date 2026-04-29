'use client';

import Link from 'next/link';
import Image from 'next/image';
import { trackNavigation } from '@/lib/analytics';

export default function TokenPriceCalculatorLaunch() {
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
              <Link
                href="/blog"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
                onClick={() => trackNavigation('/blog')}
              >
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-crypto-muted-foreground hover:text-crypto-foreground mb-8"
            onClick={() => trackNavigation('/blog')}
          >
            ← Back to Blog
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-crypto-foreground mb-6">
            Introducing the Token Price Calculator: Deterministic Risk Context for Crypto
          </h1>

          {/* Featured Image (if exists) */}
          <div className="mb-8 rounded-xl overflow-hidden bg-crypto-muted/20 relative h-64 md:h-96">
            <Image
              src="/blog-images/token.png"
              alt="Token Price Calculator - Deterministic Risk Context for Crypto"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-crypto-foreground">
            <p className="text-xl text-crypto-muted-foreground mb-8">
              CalCrypto just added a new read-only tool: the Token Price Calculator. It fetches live market data 
              and runs a deterministic risk scoring model to help you understand liquidity, valuation, and volume signals. 
              This is context, not advice. Same inputs always produce the same output. No predictions, no AI guessing, 
              no buy or sell signals.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">How it works</h2>
            <p>
              Paste any Ethereum contract address. The tool fetches price, liquidity, fully diluted valuation, and 24-hour 
              volume from public APIs. It then applies a transparent point-based scoring system that flags liquidity gaps, 
              valuation imbalances, and volume anomalies. Results are displayed as Low, Medium, or High with 
              plain-English explanations.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">Why we built it</h2>
            <p>
              Crypto markets move fast. We wanted a tool that shows you the data without telling you what to do. 
              CalCrypto remains 100 percent educational. We do not store user data, we do not connect wallets, 
              and we do not give financial advice.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">How to use it</h2>
            <p>
              Visit the Token Price Calculator, paste a valid 0x contract address, and wait a few seconds. 
              The snapshot and risk panel load automatically. You can export the data or bookmark the page. 
              All outputs are labeled estimates only and include a last-updated timestamp.
            </p>

            <div className="bg-crypto-muted/20 rounded-xl p-6 mt-10 border border-crypto-border">
              <h3 className="text-xl font-bold mb-3">Try it now</h3>
              <p className="mb-4">
                Experience the Token Price Calculator with deterministic risk assessment.
              </p>
              <Link
                href="/calculators/token-price"
                className="inline-flex items-center justify-center px-6 py-3 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ background: '#667eea', color: '#ffffff' }}
                onClick={() => trackNavigation('/calculators/token-price')}
              >
                Open Token Price Calculator →
              </Link>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4">Compliance note</h2>
            <p className="text-sm text-crypto-muted-foreground border-l-4 border-crypto-border pl-4 py-2">
              CalCrypto is a global, unregistered educational platform. Cryptoassets are volatile and unregulated 
              in many jurisdictions. Use this tool for research and context only. Consult a licensed professional 
              before making financial decisions.
            </p>
          </div>

          {/* Back to Calculators Link */}
          <div className="mt-12 pt-8 border-t border-crypto-border">
            <Link
              href="/calculators"
              className="inline-flex items-center text-crypto-primary-600 hover:text-crypto-primary-700 font-medium"
              onClick={() => trackNavigation('/calculators')}
            >
              ← Back to All Calculators
            </Link>
          </div>
        </div>
      </article>

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
              <div>© 2026 CrypCal. All rights reserved.</div>
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