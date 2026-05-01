import type { Metadata } from 'next';
import { DCAClient } from './DCAClient';
import { JsonLd } from "@/components/seo/JsonLd";
import { TrustBadge } from "@/components/ui/TrustBadge";

export const metadata: Metadata = {
  title: 'Crypto DCA Calculator — Dollar Cost Averaging | CalcCrypto',
  description: 'Calculate your crypto dollar cost averaging returns. See your average buy price, total invested, current value and profit from any DCA strategy. Free, instant, no signup required.',
  alternates: { canonical: 'https://calccrypto.com/calculators/dca' },
  openGraph: {
    title: 'Crypto DCA Calculator — CalcCrypto',
    description: 'See exactly what dollar cost averaging into crypto returns over any period. Free educational estimates.',
    url: 'https://calccrypto.com/calculators/dca',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto DCA Calculator',
    description: 'Calculate your crypto DCA strategy returns, average cost and profit instantly.',
  },
}

export default function DCACalculator() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Crypto DCA Calculator",
        "applicationCategory": "FinanceApplication",
        "url": "https://calccrypto.com/calculators/dca",
        "description": "Calculate cryptocurrency dollar cost averaging returns. Enter monthly investment amount, duration and price data to see average buy price, total invested and profit.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": ["DCA return calculation", "Average buy price", "Total invested", "Current value", "Profit projection"]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to calculate crypto DCA returns",
        "description": "Calculate your cryptocurrency dollar cost averaging returns in 4 steps",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter monthly investment amount",
            "text": "Enter the fixed amount you plan to invest each month in USD."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Enter investment duration in months",
            "text": "Enter how many months you plan to continue your DCA strategy."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Enter your average buy price and current price",
            "text": "Enter the historical average price you bought at and the current market price of the asset."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "View total invested, coins acquired, current value and profit",
            "text": "The calculator shows your total amount invested, total coins acquired, current portfolio value and net profit instantly."
          }
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is dollar cost averaging in crypto?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dollar cost averaging (DCA) in crypto is an investment strategy where you invest a fixed amount of money at regular intervals (usually monthly) regardless of the current price. This reduces the impact of volatility by automatically buying more coins when prices are low and fewer when prices are high."
            }
          },
          {
            "@type": "Question",
            "name": "How does the DCA calculator work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The DCA calculator works by simulating regular fixed investments over your selected time period. It calculates your average buy price by dividing total amount invested by total coins purchased. It then compares this average price against the current market price to show your total return and profit."
            }
          },
          {
            "@type": "Question",
            "name": "Is DCA a good strategy for crypto?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DCA is generally considered a lower risk strategy for crypto investing because it removes emotional decision making and timing risk from the investment process. It performs best in volatile markets, which is typical for cryptocurrencies. It does not guarantee profit but can reduce downside risk during market downturns."
            }
          },
          {
            "@type": "Question",
            "name": "How do fees affect my DCA returns?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Trading fees reduce your DCA returns because they are applied to every individual purchase. Over many months, even small fees of 0.1% per trade add up. This calculator can account for fees by reducing the number of coins you receive with each purchase, showing your real net return after all costs."
            }
          },
          {
            "@type": "Question",
            "name": "What is average buy price in DCA?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Average buy price in DCA is the effective price per coin across all your purchases. It is calculated by dividing your total amount invested by the total number of coins you have acquired. Because you automatically buy more coins during price dips, your average buy price will typically be lower than the average market price over the same period."
            }
          }
        ]
      }} />

      <DCAClient />

      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <TrustBadge />

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How this calculator works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              The DCA calculator uses a standard dollar cost averaging formula: 
              it simulates fixed recurring investments over your selected time frame, 
              calculates total coins acquired at each interval, computes your 
              average buy price, then compares against current market price to show 
              your total return. All calculations are deterministic based purely 
              on the values you enter.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Understanding dollar cost averaging
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              Dollar cost averaging works by removing emotion from investment timing. 
              Instead of trying to predict market bottoms, you invest the same amount 
              on a regular schedule. When prices are high you buy fewer coins, 
              when prices are low you automatically buy more. Over time this 
              typically results in a lower average entry price than attempting 
              to time the market. DCA is particularly effective for volatile 
              assets like cryptocurrencies where price swings are common and 
              difficult to predict.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is dollar cost averaging in crypto?",
                  a: "Dollar cost averaging (DCA) is investing a fixed amount regularly regardless of price. This reduces volatility impact by buying more when prices are low and fewer when high."
                },
                {
                  q: "How does the DCA calculator work?",
                  a: "It simulates regular fixed investments, calculates total coins acquired, finds your average buy price, then compares to current price to show your total return."
                },
                {
                  q: "Is DCA a good strategy for crypto?",
                  a: "DCA reduces timing risk and emotional decisions, making it generally lower risk for volatile crypto markets. It does not guarantee profit but can reduce downside exposure."
                },
                {
                  q: "How do fees affect my DCA returns?",
                  a: "Fees apply to every individual purchase. Over many months even 0.1% fees add up meaningfully. This calculator accounts for fees to show your real net return."
                },
                {
                  q: "What is average buy price in DCA?",
                  a: "Average buy price is your total invested divided by total coins. Due to automatic discount buying during dips, this is usually lower than average market price."
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
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Related calculators
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { href: '/calculators/profit-loss', label: 'Profit & Loss', desc: 'Trade P&L calculation' },
                { href: '/calculators/staking', label: 'Staking Calculator', desc: 'Staking reward projections' },
                { href: '/calculators/mining', label: 'Mining Calculator', desc: 'Mining profitability' },
                { href: '/calculators/conversion', label: 'Conversion Calculator', desc: 'Crypto conversion rates' },
                { href: '/calculators/token-price', label: 'Token Analyser', desc: 'Token risk scoring' },
              ].map(({ href, label, desc }) => (
                <a
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
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}