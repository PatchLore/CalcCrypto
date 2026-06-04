import type { Metadata } from 'next';
import Link from 'next/link';
import { MiningClient } from './MiningClient';
import { JsonLd } from "@/components/seo/JsonLd";
import { TrustBadge } from "@/components/ui/TrustBadge";

export const metadata: Metadata = {
  title: 'Crypto Mining Profitability Calculator — Hashrate & Electricity Cost | CalcCrypto',
  description: 'Calculate cryptocurrency mining profitability with our free mining calculator. Enter hashrate, power consumption in watts, electricity cost per kWh, pool fees and coin price to estimate daily, weekly and monthly profit. Supports Bitcoin ASIC and GPU mining. Free, no signup required.',
  alternates: { canonical: 'https://calccrypto.com/calculators/mining' },
  openGraph: {
    title: 'Crypto Mining Profitability Calculator — Hashrate & Power Cost Estimator',
    description: 'Estimate mining profitability, power costs, pool fees and ROI for Bitcoin and PoW coins. Free educational calculator.',
    url: 'https://calccrypto.com/calculators/mining',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Mining Profitability Calculator — Hashrate & Electricity Cost',
    description: 'Calculate mining profitability, electricity costs and expected returns instantly. Free, no signup.',
  },
};

export default function MiningCalculator() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Crypto Mining Profitability Calculator",
        "applicationCategory": "FinanceApplication",
        "url": "https://calccrypto.com/calculators/mining",
        "description": "Estimate cryptocurrency mining profitability. Enter hashrate, power consumption, electricity cost, pool fees and coin price to see daily, weekly and monthly returns.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": ["Mining profit estimation", "Power cost calculation", "Pool fee impact", "ROI timeline", "Daily/weekly/monthly projections"]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to calculate mining profitability",
        "description": "Estimate your crypto mining returns in 5 steps",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter your hashrate",
            "text": "Enter your mining hardware hashrate in TH/s, GH/s or MH/s depending on your setup."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Enter power consumption",
            "text": "Enter your hardware power consumption in watts to calculate electricity costs."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Enter electricity cost",
            "text": "Enter your electricity rate in cents per kWh, typically 5-15 cents for residential power."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Enter pool fees and coin price",
            "text": "Enter your mining pool fee percentage and the current market price of the coin you are mining."
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "View your profitability estimate",
            "text": "The calculator shows daily, weekly and monthly revenue, power costs, net profit and break-even analysis."
          }
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How is crypto mining profitability calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mining profitability is calculated by estimating the daily block reward share based on your hashrate vs network hashrate, multiplying by the coin price, then subtracting electricity costs and pool fees. The formula is: Daily Revenue = (Your Hashrate / Network Hashrate) × Blocks Per Day × Block Reward × Coin Price. Net Profit = Revenue - Power Cost - Pool Fees."
            }
          },
          {
            "@type": "Question",
            "name": "What is the most profitable cryptocurrency to mine?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Profitability depends on hardware efficiency, electricity costs and market prices. Bitcoin mining is dominated by ASICs and requires significant capital. Alternative PoW coins like Litecoin, Kaspa, Dogecoin, Monero or Ethereum Classic may be more accessible to smaller miners using GPU or ASIC hardware. Use this calculator to compare different coins and hardware configurations."
            }
          },
          {
            "@type": "Question",
            "name": "How does network difficulty affect mining profits?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Network difficulty adjusts periodically to maintain a consistent block time. As more miners join the network, difficulty increases, reducing each miner's share of the block reward. Higher difficulty means you earn less per unit of hashrate. Difficulty adjustments happen approximately every 2 weeks for Bitcoin and vary by cryptocurrency protocol."
            }
          },
          {
            "@type": "Question",
            "name": "How much does electricity cost affect mining profitability?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Electricity is typically the largest ongoing cost in mining operations. At residential electricity rates of 10-15 cents per kWh, power costs can consume 50-80% of mining revenue for less efficient hardware. Miners with access to cheap power under 5 cents per kWh have a significant competitive advantage. This is why many large mining operations are located in regions with surplus renewable energy."
            }
          },
          {
            "@type": "Question",
            "name": "Are mining rewards taxable?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In most jurisdictions, mining rewards are taxable as ordinary income at their fair market value on the date received. When mined coins are later sold, any gain or loss from the value at receipt is subject to capital gains tax. Mining expenses such as electricity and hardware costs may be deductible as business expenses depending on your jurisdiction and whether mining is classified as a business or hobby."
            }
          }
        ]
      }} />

      <MiningClient />

      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <TrustBadge />

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How the Mining Profitability Calculator Works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed mb-4">
              <strong>The formula for mining profitability is:</strong>
            </p>
            <div className="bg-crypto-muted/20 border border-crypto-border rounded-lg p-4 mb-4 font-mono text-sm text-crypto-foreground">
              Miner Share = (Your Hashrate × 1e12) ÷ (Network Difficulty × 2³² ÷ Block Time)<br />
              Daily Revenue = Miner Share × (86,400 ÷ Block Time) × Block Reward × Coin Price<br />
              Daily Electricity Cost = (Power Consumption ÷ 1000) × 24 × Electricity Rate<br />
              Daily Profit = Daily Revenue − Daily Electricity Cost − Daily Pool Fees
            </div>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              <strong>Variables:</strong> Your Hashrate is your mining hardware speed in TH/s. Network Difficulty adjusts the puzzle difficulty to maintain block time. Block Reward is the number of new coins per block (e.g., 3.125 BTC). Power Consumption is your hardware's wattage. Electricity Rate is your cost per kWh. Pool Fees are a percentage deducted by mining pools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How this calculator works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              The mining calculator estimates profitability by dividing your 
              hashrate by the network hashrate to calculate your proportional 
              share of daily block rewards. It multiplies this by the current 
              block reward and coin price to get gross revenue, then deducts 
              electricity costs based on your power consumption and local 
              electricity rate, and subtracts pool fees. Results are shown 
              per day, week and month. All calculations are deterministic 
              based on your inputs and current network data estimates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Understanding mining profitability
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              Cryptocurrency mining involves dedicating computational power 
              to validate transactions and secure the network. Miners compete 
              to solve cryptographic puzzles, and the first to find a valid 
              block earns the block reward plus transaction fees. The key 
              factors affecting your profitability are: your hardware hashrate 
              and efficiency, the network's total hashrate and difficulty, 
              the block reward schedule including halving events, electricity 
              costs which are highly location-dependent, mining pool fees 
              (typically 0-2%), and the market price of the mined coin. 
              Mining profitability is inherently competitive — as hardware 
              improves or more miners join the network, your share of rewards 
              decreases. Always run your numbers before purchasing mining 
              hardware, and consider that network difficulty tends to increase 
              over time as more efficient hardware comes online. The break-even 
              analysis helps you understand how long it will take to recover 
              your hardware investment at current profitability levels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How is crypto mining profitability calculated?",
                  a: "Daily Revenue = (Your Hashrate / Network Hashrate) × Blocks Per Day × Block Reward × Coin Price. Net Profit = Revenue - Power Cost - Pool Fees."
                },
                {
                  q: "What is the most profitable cryptocurrency to mine?",
                  a: "Profitability depends on hardware, power costs and prices. Bitcoin uses ASICs. Litecoin, Kaspa, Monero or ETC may be more accessible for smaller miners."
                },
                {
                  q: "How does network difficulty affect profits?",
                  a: "Difficulty adjusts to maintain block time. More miners = higher difficulty = less reward per hashrate. Bitcoin adjusts every 2 weeks."
                },
                {
                  q: "How much does electricity cost affect mining?",
                  a: "It is the largest ongoing cost. At 10-15c/kWh, power can consume 50-80% of revenue. Miners with sub-5c/kWh have a major advantage."
                },
                {
                  q: "Are mining rewards taxable?",
                  a: "Yes, mining rewards are typically taxable as income at fair market value on receipt. Later sales of mined coins may trigger capital gains tax."
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
                { href: '/calculators/profit-loss', label: 'Profit & Loss', desc: 'Trade P&L calculation' },
                { href: '/calculators/dca', label: 'DCA Calculator', desc: 'Dollar cost averaging' },
                { href: '/calculators/staking', label: 'Staking Calculator', desc: 'Staking reward projections' },
                { href: '/calculators/conversion', label: 'Conversion Calculator', desc: 'Crypto conversion rates' },
                { href: '/calculators/token-price', label: 'Token Analyser', desc: 'Token risk scoring' },
                { href: '/calculators/tax', label: 'Tax Calculator', desc: 'CGT estimation' },
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
  );
}