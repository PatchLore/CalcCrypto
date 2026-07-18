import type { Metadata } from 'next';
import Link from 'next/link';
import { ProfitLossClient } from './ProfitLossClient';
import { JsonLd } from "@/components/seo/JsonLd";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { AFFILIATE_LINKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Crypto Profit and Loss Calculator | ROI & Break-Even Price | CalcCrypto',
  description: 'Calculate crypto trade profit and loss with fees. Free P&L calculator — enter buy price, sell price, quantity and trading fees to see net profit, ROI percentage and break-even price. Supports BTC, ETH and any cryptocurrency. No signup required.',
  alternates: { canonical: 'https://www.calccrypto.com/calculators/profit-loss' },
  openGraph: {
    title: 'Crypto Profit and Loss Calculator — ROI & Break-Even Price Calculator',
    description: 'Instant crypto trade P&L with fee deduction. Free educational estimates for BTC, ETH and altcoin trades.',
    url: 'https://www.calccrypto.com/calculators/profit-loss',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Profit and Loss Calculator — ROI & Break-Even Price',
    description: 'Calculate crypto trade profit, loss, fees and break-even price instantly. Free, no signup.',
  },
}

export default function ProfitLossCalculator() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Crypto Profit & Loss Calculator",
        "applicationCategory": "FinanceApplication",
        "url": "https://www.calccrypto.com/calculators/profit-loss",
        "description": "Calculate cryptocurrency trade profit and loss. Enter buy price, sell price, quantity and fees to see exact P&L, ROI and net returns.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": ["P&L calculation", "ROI calculation", "Fee calculation", "Break-even price"]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to calculate crypto profit and loss",
        "description": "Calculate your cryptocurrency trading profit or loss in 4 steps",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter your buy price",
            "text": "Enter the price per coin or token at which you purchased the asset in USD."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Enter your sell price",
            "text": "Enter the price per coin or token at which you sold or plan to sell."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Enter quantity and fees",
            "text": "Enter the number of coins traded and your exchange trading fee percentage."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "View your results",
            "text": "The calculator shows your gross profit, total fees, net profit and ROI percentage instantly."
          }
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I calculate crypto profit and loss?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To calculate crypto profit and loss: subtract your total buy value (buy price × quantity) from your total sell value (sell price × quantity), then subtract trading fees from both sides. The formula is: Net P&L = (Sell Price × Quantity) - (Buy Price × Quantity) - Total Fees."
            }
          },
          {
            "@type": "Question",
            "name": "How are trading fees included in profit calculation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Trading fees are applied to both the buy and sell transactions. If your exchange charges 0.1%, you pay 0.1% of your buy value when buying and 0.1% of your sell value when selling. Both fees are deducted from your gross profit to give your net profit."
            }
          },
          {
            "@type": "Question",
            "name": "What is ROI in crypto trading?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ROI (Return on Investment) in crypto trading is your net profit divided by your initial investment, expressed as a percentage. For example, if you invested $1,000 and made $200 net profit, your ROI is 20%. This calculator computes ROI after deducting all trading fees."
            }
          },
          {
            "@type": "Question",
            "name": "What is the break-even price in crypto trading?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The break-even price is the sell price at which your trade results in exactly zero profit or loss after fees. It is calculated as: Break-even = Buy Price × (1 + fee rate) / (1 - fee rate). Any sell price above this point results in profit."
            }
          },
          {
            "@type": "Question",
            "name": "Are these profit calculations accurate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "These calculations are deterministic mathematical estimates based on the inputs you provide. They assume a fixed fee rate applied equally to buy and sell transactions. Real-world results may vary due to slippage, variable fees, or partial fills. These are educational estimates, not financial advice."
            }
          }
        ]
      }} />

      <ProfitLossClient />

      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <TrustBadge />

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How the Crypto Profit &amp; Loss Calculator Works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed mb-4">
              <strong>The formula for crypto profit is:</strong>
            </p>
            <div className="bg-crypto-muted/20 border border-crypto-border rounded-lg p-4 mb-4 font-mono text-sm text-crypto-foreground">
              Net P&amp;L = (Sell Price × Quantity) − (Buy Price × Quantity) − Total Fees<br />
              ROI = (Net P&amp;L ÷ Initial Investment) × 100
            </div>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              <strong>Variables:</strong> Buy Price is the price per coin at purchase. Sell Price is the price per coin at sale. Quantity is the number of coins traded. Total Fees includes both buy-side and sell-side trading fees (buy fee + sell fee). ROI expresses your net return as a percentage of the initial investment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How this calculator works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              The profit and loss calculator uses a deterministic formula: 
              it multiplies your entry and exit prices by your quantity to get 
              gross buy and sell values, applies your fee percentage to both 
              transactions, then subtracts total fees from gross profit to 
              produce your net result. No estimates, no predictions — only 
              the maths from the numbers you enter.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Understanding crypto profit and loss
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              Profit and loss (P&L) in crypto trading measures the financial 
              result of a completed or planned trade. Gross P&L is the 
              difference between sell value and buy value before fees. 
              Net P&L deducts trading fees paid on both legs of the trade. 
              ROI expresses net profit as a percentage of your initial 
              investment, making it easy to compare trades of different sizes. 
              Understanding your real net return after fees is essential — 
              exchange fees of 0.1–0.5% on both sides can meaningfully 
              reduce apparent gains on small price movements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How do I calculate crypto profit and loss?",
                  a: "Subtract your total buy value (buy price × quantity) from your sell value (sell price × quantity), then subtract fees from both sides. Net P&L = (Sell Price × Qty) − (Buy Price × Qty) − Total Fees."
                },
                {
                  q: "How are trading fees included?",
                  a: "Fees apply to both buy and sell transactions. A 0.1% fee on a $1,000 buy costs $1, and the same rate on your sell value is deducted again. Both are subtracted from gross profit."
                },
                {
                  q: "What is ROI in crypto trading?",
                  a: "ROI is net profit divided by your initial investment as a percentage. A $200 net profit on a $1,000 investment is 20% ROI. This calculator computes ROI after all fees."
                },
                {
                  q: "What is the break-even price?",
                  a: "The sell price at which your trade produces exactly zero profit after fees. Sell above it and you profit; sell below it and you lose."
                },
                {
                  q: "Are these calculations accurate?",
                  a: "Results are deterministic mathematical estimates based on your inputs. Real trades may vary due to slippage or variable fees. These are educational estimates, not financial advice."
                }
              ].map(({ q, a }) => (
                <details 
                  key={q}
                  className="border border-crypto-border rounded-lg 
                             overflow-hidden group"
                >
                  <summary className="flex items-center justify-between 
                                     px-4 py-3 cursor-pointer font-medium 
                                     text-sm text-crypto-foreground 
                                     hover:bg-crypto-muted/30 
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
            <div className="rounded-xl border border-green-600/30 
                            bg-green-600/5 p-5 mb-8">
              <p className="text-sm font-medium text-crypto-foreground 
                            mb-1">
                Tracking multiple trades for tax?
              </p>
              <p className="text-xs text-crypto-muted-foreground mb-3">
                Koinly imports your full transaction history and 
                generates HMRC, IRS and ATO-ready tax reports 
                automatically.
              </p>
              
              <a
                href={AFFILIATE_LINKS.koinly}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 text-sm 
                           font-medium text-green-500 
                           hover:text-green-400 transition-colors"
              >
                Try Koinly free →
              </a>
              <span className="text-xs text-crypto-muted-foreground 
                               ml-2">
                (affiliate link)
              </span>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Related calculators
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { href: '/calculators/dca', label: 'DCA Calculator', desc: 'Dollar cost averaging returns' },
                { href: '/calculators/staking', label: 'Staking Calculator', desc: 'Staking reward projections' },
                { href: '/calculators/mining', label: 'Mining Calculator', desc: 'Mining profitability' },
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