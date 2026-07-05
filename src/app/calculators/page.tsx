import type { Metadata } from 'next';
import { CalculatorsClient } from './CalculatorsClient';
import { JsonLd } from '@/components/seo/JsonLd';

const title = 'All Calculators | Free Crypto Calculator – CrypCal';
const description = 'Browse CrypCal’s free crypto calculators. Each tool is read-only and designed for clear, deterministic results with no signup required.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: 'https://calccrypto.com/calculators',
  },
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
  },
};

export default function CalculatorsPage() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CrypCal — Free Crypto Calculator Suite",
        "applicationCategory": "FinanceApplication",
        "url": "https://calccrypto.com/calculators",
        "description": "Free cryptocurrency calculators for staking, DCA, tax, profit and loss, position sizing, mining, currency conversion, token analysis, liquidity impact, and trade decision evaluation. 100% client-side, no signup required.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": [
          "Staking rewards calculator",
          "DCA calculator",
          "CGT tax calculator",
          "Profit and loss calculator",
          "Position size calculator",
          "Mining profitability calculator",
          "Currency converter",
          "Token price analyser",
          "Liquidity impact calculator",
          "Trade decision flow"
        ]
      }} />
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to use CrypCal calculators",
        "description": "Get instant crypto calculations in 3 steps",
        "step": [
          { "@type": "HowToStep", "position": 1, "name": "Browse calculators", "text": "Choose from 10+ free crypto calculators covering staking, DCA, tax, profit and loss, position sizing, mining, conversion, token analysis, liquidity impact, and trade decisions." },
          { "@type": "HowToStep", "position": 2, "name": "Select a calculator", "text": "Click any calculator to open it. Each tool has a clean interface with labelled inputs and instant results." },
          { "@type": "HowToStep", "position": 3, "name": "Enter your inputs", "text": "Fill in the fields relevant to your calculation. All results update instantly and are displayed with clear explanations." }
        ]
      }} />
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Are CrypCal calculators free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every calculator on CrypCal is completely free to use. No signup, no account, no hidden fees." } },
          { "@type": "Question", "name": "Do I need to create an account?", "acceptedAnswer": { "@type": "Answer", "text": "No. CrypCal does not require any account or signup. All calculations run client-side in your browser." } },
          { "@type": "Question", "name": "Are these calculators accurate?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every calculator uses deterministic formulas — the same inputs always produce the same output. Results are based on the numbers you enter and are clearly labelled as educational estimates where applicable." } },
          { "@type": "Question", "name": "Do you store my calculator inputs?", "acceptedAnswer": { "@type": "Answer", "text": "No. Calculator inputs stay in your browser's memory and are never sent to any server. They disappear when you close the tab." } },
          { "@type": "Question", "name": "Is this financial advice?", "acceptedAnswer": { "@type": "Answer", "text": "No. CrypCal provides calculations and read-only context only. All outputs are clearly labelled as educational or contextual. We do not give financial, tax, or trading advice." } }
        ]
      }} />
      <CalculatorsClient />
    </>
  );
}


