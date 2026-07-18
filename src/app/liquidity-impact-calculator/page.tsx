import type { Metadata } from 'next';
import Link from 'next/link';
import { LiquidityImpactCalculator } from './LiquidityImpactCalculator';
import { JsonLd } from '@/components/seo/JsonLd';
import { TrustBadge } from '@/components/ui/TrustBadge';

export const metadata: Metadata = {
  title: 'Liquidity Impact Calculator | CalcCrypto',
  description: 'Estimate slippage and liquidity risk before entering crypto trades. Free tool — enter trade size and 24h volume to get market impact, entry/exit slippage, and a 0–100 liquidity risk score.',
  alternates: { canonical: 'https://www.calccrypto.com/liquidity-impact-calculator' },
  openGraph: {
    title: 'Liquidity Impact Calculator | CalcCrypto',
    description: 'Estimate slippage and liquidity risk before entering crypto trades. Free, no signup.',
    url: 'https://www.calccrypto.com/liquidity-impact-calculator',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liquidity Impact Calculator | CalcCrypto',
    description: 'Estimate slippage and liquidity risk before entering crypto trades.',
  },
}

export default function LiquidityImpactPage() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Liquidity Impact Calculator",
        "applicationCategory": "FinanceApplication",
        "url": "https://www.calccrypto.com/liquidity-impact-calculator",
        "description": "Estimate slippage, market impact, and liquidity risk for cryptocurrency trades. Free educational tool.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": ["Slippage estimation", "Market impact calculation", "Liquidity risk scoring", "Execution warnings"]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to assess liquidity risk for a crypto trade",
        "description": "Evaluate trade realism in 3 steps",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter your trade size",
            "text": "Enter the total dollar value of the position you plan to open or close."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Enter the token's 24h volume",
            "text": "Enter the token's total trading volume over the last 24 hours."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Review the risk score and warnings",
            "text": "The tool shows market impact, entry and exit slippage, and a 0–100 liquidity score with actionable warnings."
          }
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is slippage in crypto trading?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Slippage is the difference between the expected price of a trade and the actual price at which it executes. It occurs when there is insufficient liquidity to fill your order at the desired price."
            }
          },
          {
            "@type": "Question",
            "name": "Why does liquidity matter?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Liquidity determines how easily you can enter or exit a position without affecting the market price. High liquidity means tighter spreads and lower slippage."
            }
          },
          {
            "@type": "Question",
            "name": "What is market impact?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Market impact is the change in an asset's price caused by executing a trade. Large buy orders push prices up; large sell orders push prices down."
            }
          },
          {
            "@type": "Question",
            "name": "How can I reduce slippage?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Split large orders into smaller ones, trade during high-volume periods, use limit orders, and choose tokens with higher daily volume."
            }
          }
        ]
      }} />

      <LiquidityImpactCalculator />

      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <TrustBadge />

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is slippage in crypto trading?",
                  a: "Slippage is the difference between the expected price of a trade and the actual price at which it executes. It occurs when there is insufficient liquidity."
                },
                {
                  q: "Why does liquidity matter?",
                  a: "Liquidity determines how easily you can enter or exit a position without affecting the market price. High liquidity means tighter spreads and lower slippage."
                },
                {
                  q: "What is market impact?",
                  a: "Market impact is the change in an asset's price caused by executing a trade. Large buy orders can push prices up, while large sell orders can push prices down."
                },
                {
                  q: "How can I reduce slippage?",
                  a: "Split large orders into smaller ones, trade during high-volume periods, use limit orders, and choose tokens with higher daily volume."
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="border border-crypto-border rounded-lg overflow-hidden group"
                >
                  <summary className="flex items-center justify-between px-4 py-3 
                                    cursor-pointer font-medium text-sm 
                                    text-crypto-foreground hover:bg-crypto-muted/30 
                                    list-none">
                    {q}
                    <span aria-hidden="true"
                          className="ml-2 text-crypto-muted-foreground 
                                    group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <div className="px-4 py-3 text-sm text-crypto-muted-foreground 
                                border-t border-crypto-border">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Related calculators
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { href: '/calculators/position-size', label: 'Position Size', desc: 'Risk-based trade sizing' },
                { href: '/calculators/profit-loss', label: 'Profit & Loss', desc: 'Trade P&L calculation' },
                { href: '/calculators/dca', label: 'DCA Calculator', desc: 'Dollar cost averaging' },
                { href: '/calculators/staking', label: 'Staking Calculator', desc: 'Staking reward projections' },
                { href: '/calculators/conversion', label: 'Conversion Calculator', desc: 'Crypto conversion rates' },
                { href: '/calculators/token-price', label: 'Token Analyser', desc: 'Token risk scoring' },
              ].map(({ href, label, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="block border border-crypto-border rounded-lg p-3 
                            hover:bg-crypto-muted/30 transition-colors"
                >
                  <div className="font-medium text-sm text-crypto-foreground">
                    {label}
                  </div>
                  <div className="text-xs text-crypto-muted-foreground mt-0.5">
                    {desc}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}