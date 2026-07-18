import type { Metadata } from 'next'
import Link from 'next/link'
import TokenPriceClient from './TokenPriceClient'
import { JsonLd } from "@/components/seo/JsonLd";
import { TrustBadge } from "@/components/ui/TrustBadge";

export const metadata: Metadata = {
  title: 'Token Risk Analyser — Price, Liquidity & Risk Score Checker | CalcCrypto',
  description: 'Analyse any Ethereum token with deterministic risk scoring. Free token risk analyser — paste a contract address to get current price, DEX liquidity, FDV, 24-hour volume and a Low/Medium/High risk context score powered by on-chain data from DexScreener. Educational analysis, not financial advice.',
  alternates: { canonical: 'https://www.calccrypto.com/calculators/token-price' },
  openGraph: {
    title: 'Token Risk Analyser — Price, Liquidity & Risk Score Checker',
    description: 'Deterministic risk scoring for any Ethereum token. Paste a contract address for price, liquidity, FDV and risk context. Free, no wallet required.',
    url: 'https://www.calccrypto.com/calculators/token-price',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Risk Analyser — Price, Liquidity & Risk Score Checker',
    description: 'Risk score any crypto token using on-chain data. Free, deterministic, educational analysis only.',
  },
}

export default function TokenPriceCalculator() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Token Price & Risk Analyser",
        "applicationCategory": "FinanceApplication",
        "url": "https://www.calccrypto.com/calculators/token-price",
        "description": "Analyse any Ethereum token with deterministic risk scoring. Paste a contract address to get price, liquidity, FDV and volume data plus a risk context score.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": ["Token price lookup", "Risk context scoring", "Liquidity analysis", "Volume assessment", "Fully diluted valuation check"]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to analyse a token's risk",
        "description": "Analyse any Ethereum token in 3 steps",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Get a contract address",
            "text": "Find the Ethereum contract address of the token you want to analyse from a trusted source like CoinGecko or the project's official website."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Paste the address",
            "text": "Paste the contract address into the analyser and wait a few seconds while it fetches live market data."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Review the risk context",
            "text": "The analyser shows price, liquidity, FDV and 24-hour volume, plus a deterministic risk score with plain-English explanations."
          }
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does the token risk scoring work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The risk scoring model is fully deterministic — same inputs always produce the same output. It scores three signals: liquidity depth (absolute USD value of on-chain liquidity), liquidity vs FDV ratio (how much liquidity backs the total valuation), and volume vs liquidity ratio (trading activity relative to pool depth). Scores map to Low, Medium or High context levels. No predictions, no AI, no buy or sell signals."
            }
          },
          {
            "@type": "Question",
            "name": "What does Low, Medium and High risk mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Low risk indicates the token has strong on-chain liquidity relative to its valuation, suggesting lower risk of price manipulation or liquidity crunches. Medium risk means some signals are elevated — for example moderate liquidity vs FDV ratio. High risk flags significant concerns such as very low liquidity relative to valuation or suspicious volume patterns. These are context signals, not investment recommendations."
            }
          },
          {
            "@type": "Question",
            "name": "Why do stablecoins like USDC show Low risk?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Major stablecoins (USDC, USDT, DAI) and blue-chip tokens (WETH, WBTC) previously scored Medium because their low DEX liquidity relative to fully diluted valuation is technically correct but misleading — most of their volume occurs on centralised exchanges. The scoring now correctly identifies these as Low risk with an explanatory note."
            }
          },
          {
            "@type": "Question",
            "name": "What data sources does the analyser use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The analyser fetches data from public sources including DexScreener for DEX liquidity and trading data. All data is publicly available on-chain. The tool is read-only and does not connect to wallets or store any information you enter."
            }
          },
          {
            "@type": "Question",
            "name": "Can this tool predict token prices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. This tool does not predict prices, generate trading signals or give financial advice. It provides deterministic risk context based on current on-chain data. All outputs are labelled as estimates. Always do your own research and consult a licensed professional before making investment decisions."
            }
          }
        ]
      }} />

      <TokenPriceClient />

      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <TrustBadge />

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How this calculator works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              The Token Price Analyser works by fetching live on-chain data 
              from public APIs when you enter a valid Ethereum contract 
              address. It retrieves current price, total liquidity across 
              DEX pools, fully diluted valuation (FDV), and 24-hour trading 
              volume. The deterministic risk scoring engine then evaluates 
              three key ratios — liquidity depth, liquidity-to-FDV ratio, 
              and volume-to-liquidity ratio — and assigns a context score 
              of Low, Medium or High risk. Each score comes with a 
              plain-English explanation of what triggered it. No data is 
              stored and no wallet connection is required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Understanding token risk context
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              Token risk context helps you understand the liquidity and 
              market structure behind any Ethereum-based token. Three key 
              metrics drive the scoring: liquidity depth measures the total 
              USD value of tokens available in DEX pools — higher is better 
              because it means larger trades can execute without significant 
              price impact. The liquidity-to-FDV ratio compares available 
              liquidity against the token's fully diluted valuation. A low 
              ratio means the market price could be easily manipulated with 
              relatively small trades. The volume-to-liquidity ratio measures 
              how actively the token trades relative to its pool depth. 
              Extremely high ratios can indicate wash trading or artificial 
              volume, while very low ratios suggest the token has little 
              genuine trading interest. The scoring model is fully transparent 
              and deterministic — the same contract address always produces 
              the same results. This is educational context, not financial 
              advice. Always combine this analysis with your own research 
              and consult professionals before making investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How does the token risk scoring work?",
                  a: "It scores three signals deterministically: liquidity depth, liquidity vs FDV ratio, and volume vs liquidity ratio. Maps to Low, Medium or High."
                },
                {
                  q: "What does Low, Medium and High risk mean?",
                  a: "Low = strong on-chain liquidity. Medium = some signals elevated. High = significant concerns like low liquidity relative to valuation."
                },
                {
                  q: "Why do stablecoins show Low risk?",
                  a: "Stablecoins like USDC, USDT and DAI now correctly score Low because most of their volume is on centralised exchanges, not DEXs."
                },
                {
                  q: "What data sources does it use?",
                  a: "Public on-chain data from DexScreener. The tool is read-only, does not connect to wallets or store your inputs."
                },
                {
                  q: "Can this tool predict token prices?",
                  a: "No. It provides deterministic risk context based on current data. No predictions, signals or financial advice."
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
                { href: '/calculators/mining', label: 'Mining Calculator', desc: 'Mining profitability' },
                { href: '/calculators/conversion', label: 'Conversion Calculator', desc: 'Crypto conversion rates' },
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
  )
}