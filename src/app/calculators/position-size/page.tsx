import type { Metadata } from 'next';
import Link from 'next/link';
import { PositionSizeCalculator as CalculatorClient } from './PositionSizeCalculator';
import { JsonLd } from "@/components/seo/JsonLd";
import { TrustBadge } from "@/components/ui/TrustBadge";

export const metadata: Metadata = {
  title: 'Crypto Position Size Calculator — Risk Management & Trade Sizing | CalcCrypto',
  description: 'Calculate the correct position size for any crypto trade based on your account size and risk tolerance. Free position sizing calculator — enter account balance, risk percentage, entry price and stop loss to see exact position size, capital required and maximum loss. No signup required.',
  alternates: { canonical: 'https://calccrypto.com/calculators/position-size' },
  openGraph: {
    title: 'Crypto Position Size Calculator — Risk-Based Trade Sizing Tool',
    description: 'Calculate exactly how much crypto to buy based on your account size and risk per trade. Free, no signup, works for BTC, ETH and altcoins.',
    url: 'https://calccrypto.com/calculators/position-size',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Position Size Calculator — Risk-Based Trade Sizing',
    description: 'Calculate trade position size based on risk management principles instantly. Free, no signup.',
  },
}

export default function PositionSizeCalculator() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Crypto Position Size Calculator",
        "applicationCategory": "FinanceApplication",
        "url": "https://calccrypto.com/calculators/position-size",
        "description": "Calculate cryptocurrency trade position size based on account size, risk percentage, entry price and stop loss. Free educational risk management tool.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": ["Position size calculation", "Risk amount calculation", "Capital required", "Stop distance percentage"]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to calculate position size for a crypto trade",
        "description": "Calculate your position size based on risk management in 4 steps",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter your account size",
            "text": "Enter your total trading account balance in USD. This is the full amount of capital you have available for trading."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Set your risk percentage",
            "text": "Enter the percentage of your account you are willing to risk on this single trade. Most professional traders risk 0.5% to 2% per trade."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Enter entry and stop loss prices",
            "text": "Enter your planned entry price and stop loss price in USD. The stop loss must be below the entry price for a long position."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "View your position size",
            "text": "The calculator shows your maximum risk amount, position size in units, capital required, and percentage distance to your stop loss."
          }
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do you calculate position size in crypto trading?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Position size is calculated by dividing your maximum risk amount by the distance between your entry price and stop loss price. The formula is: Risk Amount = Account Size × (Risk % / 100), then Position Size = Risk Amount / (Entry Price − Stop Loss Price)."
            }
          },
          {
            "@type": "Question",
            "name": "What percentage of my account should I risk per trade?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most professional traders risk between 0.5% and 2% of their trading account on any single trade. Risking more than 2% per trade significantly increases the probability of a large drawdown. The 1% rule is a common conservative position sizing approach."
            }
          },
          {
            "@type": "Question",
            "name": "What is the 1% rule in position sizing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The 1% rule states that you should never risk more than 1% of your total trading account on a single trade. For example, with a $10,000 account, your maximum risk per trade is $100. This ensures no single loss can significantly damage your portfolio."
            }
          },
          {
            "@type": "Question",
            "name": "How does stop loss distance affect position size?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A wider stop loss distance results in a smaller position size, and a tighter stop loss allows for a larger position size. This is because the same risk amount is spread over a larger or smaller price movement. For example, risking $100 with a $1 stop distance gives 100 units, while a $5 stop distance gives only 20 units."
            }
          },
          {
            "@type": "Question",
            "name": "Is position size the same as capital required?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Position size is the number of units (coins or tokens) you can trade. Capital required is the total dollar amount needed to open that position, calculated as Position Size × Entry Price. For leveraged trading, the capital required may be lower than the full position value."
            }
          }
        ]
      }} />

      <CalculatorClient />

      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <TrustBadge />

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How the Position Size Calculator Works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed mb-4">
              <strong>The formula for position sizing is:</strong>
            </p>
            <div className="bg-crypto-muted/20 border border-crypto-border rounded-lg p-4 mb-4 font-mono text-sm text-crypto-foreground">
              Risk Amount = Account Size × (Risk % ÷ 100)<br />
              Stop Distance % = ((Entry Price − Stop Loss) ÷ Entry Price) × 100<br />
              Position Size (units) = Risk Amount ÷ (Entry Price − Stop Loss)<br />
              Capital Required = Position Size × Entry Price
            </div>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              <strong>Variables:</strong> Account Size is your total trading capital. Risk % is the portion of your account you are willing to lose on this trade. Entry Price is your planned purchase price. Stop Loss Price is the price at which you will exit if the trade moves against you. Position Size is the number of units to buy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How this calculator works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              The Position Size Calculator uses a standard risk management formula: 
              it first calculates your maximum acceptable loss (risk amount) as a percentage 
              of your account, then divides that by the distance from entry to stop loss 
              to determine how many units you can trade. The wider your stop, the fewer 
              units you get — this naturally prevents oversized positions. All calculations 
              are deterministic based purely on the values you enter. Results update live 
              as you type, with no submit button required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Understanding position sizing
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              Position sizing is one of the most overlooked yet critical components of 
              trading risk management. Professional traders determine their position 
              size before entering any trade based on a fixed risk percentage of their 
              account, not on gut feeling or the size of a potential payout. The core 
              principle is that no single trade should be large enough to significantly 
              damage your portfolio. By tying position size to a fixed percentage risk, 
              you automatically trade smaller when prices are volatile (wider stops) and 
              larger when you can place tight stops near key support levels. This creates 
              a consistent risk profile across all your trades regardless of market 
              conditions. The 1% rule is a popular starting point — risking 1% of your 
              account per trade means you would need 100 consecutive losing trades to 
              lose everything, which is statistically unlikely with any half-decent strategy. 
              Remember, position sizing does not predict profitability, it manages loss 
              magnitude. This is educational context, not financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How do you calculate position size in crypto trading?",
                  a: "Risk Amount = Account Size × (Risk % / 100). Position Size = Risk Amount / (Entry − Stop Loss). This gives you the number of units to buy while keeping your risk fixed."
                },
                {
                  q: "What percentage of my account should I risk per trade?",
                  a: "Professional traders typically risk 0.5% to 2% per trade. The 1% rule is a common conservative approach. Over 2% significantly increases drawdown risk."
                },
                {
                  q: "What is the 1% rule in position sizing?",
                  a: "Never risk more than 1% of your total account on a single trade. A $10,000 account means max $100 risk per trade. This protects your portfolio from large losses."
                },
                {
                  q: "How does stop loss distance affect position size?",
                  a: "Wider stop = smaller position. Tighter stop = larger position. The same risk amount is spread over the price distance. Wider stops need fewer units."
                },
                {
                  q: "Is position size the same as capital required?",
                  a: "No. Position size = units to trade. Capital required = units × entry price in dollars. Leverage reduces the actual capital needed."
                }
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
                { href: '/liquidity-impact-calculator', label: 'Liquidity & Impact', desc: 'Slippage & market impact' },
                { href: '/calculators/profit-loss', label: 'Profit & Loss', desc: 'Trade P&L calculation' },
                { href: '/calculators/dca', label: 'DCA Calculator', desc: 'Dollar cost averaging' },
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
