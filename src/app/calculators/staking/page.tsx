import type { Metadata } from 'next';
import Link from 'next/link';
import { StakingClient } from './StakingClient';
import { JsonLd } from "@/components/seo/JsonLd";
import { TrustBadge } from "@/components/ui/TrustBadge";

export const metadata: Metadata = {
  title: 'Crypto Staking Rewards Calculator — APY Yield & Compound Interest | CalcCrypto',
  description: 'Calculate crypto staking rewards with compound interest. Free staking calculator — enter your stake amount, APY rate, duration and compounding frequency (daily, weekly, monthly, yearly) to estimate total rewards and final balance. Supports Ethereum, Solana, Cardano and more. Instant, no signup required.',
  alternates: { canonical: 'https://calccrypto.com/calculators/staking' },
  openGraph: {
    title: 'Crypto Staking Rewards Calculator — APY Yield & Compound Interest Estimator',
    description: 'Estimate staking rewards with compound interest for any crypto. Daily, weekly, monthly or yearly compounding. Free educational tool.',
    url: 'https://calccrypto.com/calculators/staking',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Staking Rewards Calculator — APY Yield Estimator',
    description: 'Calculate staking rewards, compound interest and APY returns instantly. Free, no signup.',
  },
};

export default function StakingCalculator() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Crypto Staking Rewards Calculator",
        "applicationCategory": "FinanceApplication",
        "url": "https://calccrypto.com/calculators/staking",
        "description": "Calculate cryptocurrency staking rewards with compound interest. Enter your stake amount, APY, duration and compounding frequency to see projected returns.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": ["Staking reward projection", "Compound interest calculation", "APY return estimate", "Duration comparison"]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to calculate crypto staking rewards",
        "description": "Calculate your crypto staking returns in 4 steps",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter your staking amount",
            "text": "Enter the total amount of cryptocurrency you plan to stake."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Enter the APY rate",
            "text": "Enter the annual percentage yield offered by the staking protocol or validator."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Select staking duration",
            "text": "Choose how long you plan to stake your tokens, from days to years."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Choose compounding frequency",
            "text": "Select how often rewards are compounded: daily, weekly, monthly or annually."
          }
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do crypto staking rewards work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Staking rewards are earned by locking up cryptocurrency to support a proof-of-stake blockchain network. Validators are chosen based on the amount staked and are rewarded with new tokens and transaction fees. The APY varies by network, ranging from 3% to 20% or more depending on the protocol."
            }
          },
          {
            "@type": "Question",
            "name": "What is APY in staking?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "APY (Annual Percentage Yield) represents the real rate of return on staked assets accounting for compound interest. Unlike APR which is simple interest, APY assumes rewards are reinvested, leading to exponential growth over time. Higher compounding frequency produces higher effective returns."
            }
          },
          {
            "@type": "Question",
            "name": "How does compounding frequency affect staking rewards?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "More frequent compounding produces higher total returns. Daily compounding generates the highest yield because rewards begin earning their own rewards sooner. For a 10% APY over one year: daily compounding yields 10.52%, monthly yields 10.47%, and annual compounding yields exactly 10.00%."
            }
          },
          {
            "@type": "Question",
            "name": "Are staking rewards taxable?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In most jurisdictions, staking rewards are treated as income at the time they are received. Their fair market value on the receipt date is taxable as ordinary income. When you later sell staked tokens, any gain or loss from the original value is subject to capital gains tax. Rules vary by country."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between staking and locking?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Staking involves locking tokens to support network operations while earning rewards, with varying lock-up periods. Some networks allow instant unstaking while others have unbonding periods of days or weeks during which no rewards are earned. Always check the unstaking period before committing your tokens."
            }
          }
        ]
      }} />

      <StakingClient />

      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <TrustBadge />

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How the Staking Rewards Calculator Works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed mb-4">
              <strong>The formula for staking rewards with compound interest is:</strong>
            </p>
            <div className="bg-crypto-muted/20 border border-crypto-border rounded-lg p-4 mb-4 font-mono text-sm text-crypto-foreground">
              Rate Per Period = (APY ÷ 100) ÷ Periods Per Year<br />
              Total Periods = (Duration in Days ÷ 365) × Periods Per Year<br />
              Final Amount = Initial Stake × (1 + Rate Per Period)<sup>Total Periods</sup><br />
              Total Rewards = Final Amount − Initial Stake
            </div>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              <strong>Variables:</strong> Initial Stake is the amount of cryptocurrency staked. APY is the annual percentage yield offered by the protocol. Duration is the staking period in days. Periods Per Year depends on compounding frequency: 365 for daily, 52 for weekly, 12 for monthly, 1 for yearly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How this calculator works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              The staking calculator uses a standard compound interest formula: 
              it takes your initial stake amount, applies the APY rate, and 
              compounds the rewards at your selected frequency over the chosen 
              duration. The calculation is fully deterministic — the same inputs 
              always produce the same outputs. Results show your total rewards 
              earned, final balance, effective APY, and a breakdown of rewards 
              per period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Understanding staking rewards
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              Staking is a core mechanism of proof-of-stake blockchains like 
              Ethereum, Solana, Cardano and Avalanche. By staking your tokens, 
              you help secure the network and validate transactions. In return, 
              you earn a share of network fees and newly minted tokens. The 
              APY rate depends on the total amount staked on the network, 
              the inflation rate, and the fee market. Higher total staked 
              typically means lower APY, while higher network activity can 
              increase fee-based rewards. Understanding how compounding 
              affects your returns is essential — even small differences in 
              APY or compounding frequency can significantly impact long-term 
              earnings. Always consider the lock-up period and unstaking delay 
              before committing your assets, as some networks impose 
              unbonding periods of 21 days or more during which you cannot 
              access your tokens or transfer them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How do crypto staking rewards work?",
                  a: "Staking rewards are earned by locking crypto to support a proof-of-stake network. Validators are chosen based on stake amount and earn new tokens plus fees. APY varies by network from 3% to 20%+."
                },
                {
                  q: "What is APY in staking?",
                  a: "APY (Annual Percentage Yield) is the real rate of return accounting for compound interest. Higher compounding frequency produces higher returns than simple APR."
                },
                {
                  q: "How does compounding frequency affect rewards?",
                  a: "More frequent compounding yields higher total returns. Daily compounding generates the highest yield as rewards start earning rewards sooner."
                },
                {
                  q: "Are staking rewards taxable?",
                  a: "Yes, in most jurisdictions staking rewards are taxable as income at fair market value on receipt. Later sales of staked tokens may trigger capital gains tax."
                },
                {
                  q: "What is the difference between staking and locking?",
                  a: "Staking locks tokens for network security. Some networks allow instant unstaking while others have unbonding periods of days or weeks."
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
                { href: '/calculators/mining', label: 'Mining Calculator', desc: 'Mining profitability' },
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