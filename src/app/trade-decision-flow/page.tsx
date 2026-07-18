import type { Metadata } from 'next';
import { TradeDecisionFlow } from './TradeDecisionFlow';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Trade Decision Flow — Combined Risk & Liquidity Assessment | CalcCrypto',
  description: 'A step-by-step trader workflow combining position sizing, liquidity analysis, and risk context. Evaluate whether a trade is worth taking with our free decision support tool.',
  alternates: { canonical: 'https://www.calccrypto.com/trade-decision-flow' },
  openGraph: {
    title: 'Trade Decision Flow — Crypto Trade Evaluation Tool',
    description: 'Step-by-step trade evaluation: position sizing → liquidity check → execution feasibility. Free, no signup.',
    url: 'https://www.calccrypto.com/trade-decision-flow',
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
        "url": "https://www.calccrypto.com/trade-decision-flow",
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

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the Trade Decision Flow?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It is a 4-step guided workflow that combines position sizing, liquidity analysis, slippage estimation, and risk context into a single trade feasibility assessment. Enter your token details, define your position, review liquidity, and get a composite verdict."
            }
          },
          {
            "@type": "Question",
            "name": "How is the final trade score calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The final score is a 0-to-100 composite: risk assessment contributes up to 40 points, liquidity analysis up to 40 points, and slippage estimation up to 20 points. Higher scores indicate more favourable trade conditions based on the inputs provided."
            }
          },
          {
            "@type": "Question",
            "name": "What does a high or low score mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A high score (70+) suggests the trade parameters are aligned with common risk-management guidelines. A moderate score (40-69) indicates one or more areas need attention, such as position size or liquidity. A low score (below 40) flags multiple concerns. These are educational context signals, not buy or sell recommendations."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use this tool for any cryptocurrency?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can use it for any token or coin where you have the current price and 24-hour trading volume. It works best for tokens with publicly available market data. The tool is read-only and does not connect to any exchange or wallet."
            }
          },
          {
            "@type": "Question",
            "name": "Is this financial advice?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. The Trade Decision Flow provides educational context based on the numbers you enter. It is not financial advice, does not consider your personal circumstances, and should not be used as the sole basis for any trading decision. Always do your own research."
            }
          }
        ]
      }} />

      <TradeDecisionFlow />
    </>
  )
}