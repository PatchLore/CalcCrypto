import type { Metadata } from 'next';
import { TradeDecisionFlow } from './TradeDecisionFlow';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Trade Decision Flow — Combined Risk & Liquidity Assessment | CalcCrypto',
  description: 'A step-by-step trader workflow combining position sizing, liquidity analysis, and risk context. Evaluate whether a trade is worth taking with our free decision support tool.',
  alternates: { canonical: 'https://calccrypto.com/trade-decision-flow' },
  openGraph: {
    title: 'Trade Decision Flow — Crypto Trade Evaluation Tool',
    description: 'Step-by-step trade evaluation: position sizing → liquidity check → execution feasibility. Free, no signup.',
    url: 'https://calccrypto.com/trade-decision-flow',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade Decision Flow — Crypto Trade Evaluation',
    description: 'Evaluate trades across risk, size, and liquidity in one guided workflow.',
  },
}

export default function TradeDecisionFlowPage() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Trade Decision Flow",
        "applicationCategory": "FinanceApplication",
        "url": "https://calccrypto.com/trade-decision-flow",
        "description": "A guided step-by-step tool combining position sizing, liquidity analysis, and risk context to evaluate crypto trades.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": ["Position sizing", "Liquidity assessment", "Slippage estimation", "Trade feasibility verdict"]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to evaluate a crypto trade using the Trade Decision Flow",
        "description": "A 4-step process to assess trade feasibility",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter token details",
            "text": "Enter the token's current price and 24-hour trading volume."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Define position size",
            "text": "Enter your account size, risk percentage, entry price, and stop loss to calculate your position size."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Review liquidity",
            "text": "The tool automatically checks your trade size against the token's volume and shows slippage estimates and a liquidity score."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Get the verdict",
            "text": "Review a combined summary of risk, liquidity, and execution cost with a final trade feasibility recommendation."
          }
        ]
      }} />

      <TradeDecisionFlow />
    </>
  )
}
