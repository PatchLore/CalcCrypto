'use client';

import Link from 'next/link';
import { trackNavigation } from '@/lib/analytics';

export default function NewCalculatorsTaxTokenPrice() {
  return (
    <div className="min-h-screen bg-crypto-background">
      {/* Header */}
      <header className="border-b border-crypto-border 
                         bg-crypto-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">₿</div>
              <div className="text-2xl font-bold 
                              text-crypto-primary-600 
                              dark:text-crypto-primary-400">
                CrypCal
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-crypto-foreground 
                           hover:text-crypto-primary-600 
                           transition-colors"
                onClick={() => trackNavigation('/')}
              >
                Home
              </Link>
              <Link
                href="/calculators"
                className="text-crypto-foreground 
                           hover:text-crypto-primary-600 
                           transition-colors"
                onClick={() => trackNavigation('/calculators')}
              >
                Calculators
              </Link>
              <Link
                href="/blog"
                className="text-crypto-foreground 
                           hover:text-crypto-primary-600 
                           transition-colors"
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

          <Link
            href="/blog"
            className="inline-flex items-center text-sm 
                       text-crypto-muted-foreground 
                       hover:text-crypto-foreground mb-8"
            onClick={() => trackNavigation('/blog')}
          >
            ← Back to Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold 
                         text-crypto-foreground mb-6">
            Two New Calculators Now Live: Tax Estimator 
            & Token Risk Analyser
          </h1>

          <div className="flex items-center gap-3 mb-8 
                          text-sm text-crypto-muted-foreground">
            <time dateTime="2026-05-02">2 May 2026</time>
            <span>·</span>
            <span>5 min read</span>
            <span>·</span>
            <span>Product Update</span>
          </div>

          <div className="prose prose-lg max-w-none 
                          text-crypto-foreground">

            <p className="text-xl text-crypto-muted-foreground mb-8">
              CrypCal has two new tools live today — a Capital Gains 
              Tax estimator covering UK, US, Australia and EU, and an 
              updated Token Price Analyser with smarter risk scoring. 
              Both are free, require no signup, and store nothing. 
              Here is what they do and how to use them.
            </p>

            {/* TAX CALCULATOR */}
            <h2 className="text-2xl font-bold mt-10 mb-4">
              🧾 Capital Gains Tax Calculator
            </h2>
            <p>
              The Tax Calculator gives you a deterministic CGT estimate 
              based on the numbers you enter. Select your jurisdiction, 
              choose your tax rate band, enter your buy price, sell price 
              and quantity — and the calculator works out your gross gain, 
              taxable gain after allowance, estimated tax liability and 
              effective rate.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Jurisdictions supported
            </h3>
            <ul className="list-disc list-inside space-y-2 
                           text-crypto-muted-foreground">
              <li>
                <strong className="text-crypto-foreground">
                  United Kingdom
                </strong> — £3,000 annual CGT allowance, 
                18% basic rate / 24% higher rate (2024/25)
              </li>
              <li>
                <strong className="text-crypto-foreground">
                  United States
                </strong> — Long-term rates of 15% / 20%, 
                no annual allowance
              </li>
              <li>
                <strong className="text-crypto-foreground">
                  Australia
                </strong> — 50% CGT discount applies if held 
                over 12 months
              </li>
              <li>
                <strong className="text-crypto-foreground">
                  European Union
                </strong> — General 20% estimate 
                (rates vary by member state)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              How to use it
            </h3>
            <ol className="list-decimal list-inside space-y-2 
                           text-crypto-muted-foreground">
              <li>Select your jurisdiction and tax rate band</li>
              <li>Enter the price you paid per coin</li>
              <li>Enter the price you sold at and quantity disposed</li>
              <li>Click Calculate — results appear instantly</li>
            </ol>

            <div className="bg-amber-500/10 border border-amber-500/30 
                            rounded-xl p-5 mt-6">
              <p className="text-sm text-crypto-muted-foreground m-0">
                <strong className="text-crypto-foreground">
                  Important:
                </strong> These are generic educational estimates based 
                on simplified rules. They are not tax advice. Tax law is 
                complex and depends on your full financial situation. 
                Always consult a qualified tax professional before 
                making decisions.
              </p>
            </div>

            <div className="bg-crypto-muted/20 rounded-xl p-6 mt-6 
                            border border-crypto-border">
              <h3 className="text-xl font-bold mb-3">
                Try the Tax Calculator
              </h3>
              <p className="mb-4 text-crypto-muted-foreground">
                Estimate your crypto CGT liability for UK, US, AU or EU.
              </p>
              <Link
                href="/calculators/tax"
                className="inline-flex items-center justify-center 
                           px-6 py-3 font-bold text-lg rounded-xl 
                           shadow-lg hover:shadow-xl hover:-translate-y-1 
                           transition-all duration-300"
                style={{ background: '#e53e3e', color: '#ffffff' }}
                onClick={() => trackNavigation('/calculators/tax')}
              >
                Open Tax Calculator →
              </Link>
            </div>

            {/* TOKEN PRICE */}
            <h2 className="text-2xl font-bold mt-12 mb-4">
              🔍 Token Price Analyser — Smarter Risk Scoring
            </h2>
            <p>
              The Token Price Analyser fetches live data from public APIs 
              and runs a deterministic point-based risk model. Paste any 
              Ethereum contract address and you get a snapshot of price, 
              liquidity, fully diluted valuation and 24-hour volume — 
              plus a risk context score explaining any flags triggered.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              What changed in this update
            </h3>
            <p className="text-crypto-muted-foreground">
              The risk scoring now correctly handles major stablecoins 
              and blue-chip tokens. USDC, USDT, DAI, WETH and WBTC 
              previously scored Medium due to low DEX liquidity relative 
              to their fully diluted valuation — which is technically 
              correct on-chain but misleading, since most of their volume 
              occurs on centralised exchanges. These tokens now receive a 
              Low risk context score with an explanatory note.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              How the risk score works
            </h3>
            <p className="text-crypto-muted-foreground">
              The model is fully deterministic — same inputs always 
              produce the same output. It scores three signals:
            </p>
            <ul className="list-disc list-inside space-y-2 
                           text-crypto-muted-foreground">
              <li>
                <strong className="text-crypto-foreground">
                  Liquidity depth
                </strong> — absolute USD value of on-chain liquidity
              </li>
              <li>
                <strong className="text-crypto-foreground">
                  Liquidity vs FDV ratio
                </strong> — how much liquidity backs the total valuation
              </li>
              <li>
                <strong className="text-crypto-foreground">
                  Volume vs liquidity ratio
                </strong> — trading activity relative to pool depth
              </li>
            </ul>
            <p className="text-crypto-muted-foreground mt-3">
              Scores map to Low, Medium or High context levels. 
              No predictions. No AI. No buy or sell signals.
            </p>

            <div className="bg-crypto-muted/20 rounded-xl p-6 mt-6 
                            border border-crypto-border">
              <h3 className="text-xl font-bold mb-3">
                Try the Token Analyser
              </h3>
              <p className="mb-4 text-crypto-muted-foreground">
                Paste any Ethereum contract address for a live 
                risk context snapshot.
              </p>
              <Link
                href="/calculators/token-price"
                className="inline-flex items-center justify-center 
                           px-6 py-3 font-bold text-lg rounded-xl 
                           shadow-lg hover:shadow-xl hover:-translate-y-1 
                           transition-all duration-300"
                style={{ background: '#667eea', color: '#ffffff' }}
                onClick={() => trackNavigation('/calculators/token-price')}
              >
                Open Token Analyser →
              </Link>
            </div>

            {/* COMING NEXT */}
            <h2 className="text-2xl font-bold mt-12 mb-4">
              What is coming next
            </h2>
            <p className="text-crypto-muted-foreground">
              The next tools in development for CrypCal:
            </p>
            <ul className="list-disc list-inside space-y-2 
                           text-crypto-muted-foreground">
              <li>
                <strong className="text-crypto-foreground">
                  Portfolio Tracker
                </strong> — manual entry, localStorage only, 
                no wallet connection
              </li>
              <li>
                <strong className="text-crypto-foreground">
                  Impermanent Loss Calculator
                </strong> — for DeFi liquidity providers
              </li>
              <li>
                <strong className="text-crypto-foreground">
                  Stablecoin Peg Tracker
                </strong> — monitor de-peg events across 
                major stablecoins
              </li>
              <li>
                <strong className="text-crypto-foreground">
                  L1 vs L2 Fee Comparison
                </strong> — see real costs across Ethereum, 
                Arbitrum, Base, Optimism and more
              </li>
            </ul>

            {/* CLOSING */}
            <h2 className="text-2xl font-bold mt-12 mb-4">
              CrypCal stays free
            </h2>
            <p className="text-crypto-muted-foreground">
              Every tool on CrypCal is free, requires no account, 
              and stores nothing on our servers. Calculator inputs 
              stay in your browser. We do not connect to wallets, 
              we do not give financial advice, and we do not track 
              you across the web. The goal is simple — give you 
              the maths, clearly, so you can make your own decisions.
            </p>

            <p className="text-sm text-crypto-muted-foreground 
                          border-l-4 border-crypto-border pl-4 
                          py-2 mt-8">
              CrypCal is a global educational platform. All outputs 
              are estimates based on public data. This is not 
              financial, tax or legal advice. Consult a licensed 
              professional before making decisions.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-crypto-border">
            <Link
              href="/calculators"
              className="inline-flex items-center 
                         text-crypto-primary-600 
                         hover:text-crypto-primary-700 font-medium"
              onClick={() => trackNavigation('/calculators')}
            >
              ← Back to All Calculators
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-crypto-border 
                         bg-crypto-background/80 backdrop-blur-sm 
                         mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 text-sm 
                          text-crypto-muted-foreground">
            <div className="text-xs text-crypto-muted-foreground 
                            border-t border-crypto-border pt-4">
              <p>
                CrypCal provides educational calculators only. 
                All outputs are estimates based on public data. 
                This is not financial, tax, or legal advice. 
                Cryptoassets are volatile and unregulated in many 
                jurisdictions. Consult a licensed professional 
                before making decisions. We do not store user 
                data or connect to wallets.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center 
                            justify-between gap-3">
              <div>© 2026 CrypCal. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  className="hover:text-crypto-foreground 
                             transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-crypto-foreground 
                             transition-colors"
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