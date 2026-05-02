import type { Metadata } from 'next'
import TokenPriceClient from './TokenPriceClient'

export const metadata: Metadata = {
  title: 'Token Price & Risk Calculator | CalcCrypto',
  description: 'Analyse any crypto token with deterministic risk scoring. Get risk assessment based on market cap, volume, liquidity and price data from DexScreener. Free, no wallet required.',
  alternates: { canonical: 'https://calccrypto.com/calculators/token-price' },
  openGraph: {
    title: 'Token Price & Risk Analyser — CalcCrypto',
    description: 'Deterministic risk scoring for any crypto token. Educational analysis, not financial advice.',
    url: 'https://calccrypto.com/calculators/token-price',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Price & Risk Calculator',
    description: 'Risk score any crypto token using market data. Free, deterministic, no advice.',
  },
}

export default function TokenPriceCalculator() {
  return <TokenPriceClient />
}
