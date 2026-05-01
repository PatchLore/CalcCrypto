import type { Metadata } from 'next';
import { ConversionClient } from './ConversionClient';

const title = 'Currency Converter | Free Crypto Calculator – CrypCal';
const description = 'Convert between cryptocurrencies and fiat currencies using a simple, read-only interface. This tool is designed for clear, deterministic outputs.';

export const metadata: Metadata = {
  title: 'Crypto Currency Converter | CalcCrypto',
  description: 'Convert between cryptocurrency and fiat currencies. Instant Bitcoin, Ethereum, USD, EUR conversions with live market rates. Free, no signup required.',
  alternates: { canonical: 'https://calccrypto.com/calculators/conversion' },
  openGraph: {
    title: 'Crypto Currency Converter — CalcCrypto',
    description: 'Instant cryptocurrency and fiat currency converter. Free educational estimates with transparent exchange rates.',
    url: 'https://calccrypto.com/calculators/conversion',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Currency Converter',
    description: 'Convert crypto and fiat currencies instantly with live market rates.',
  },
};

export default function CurrencyConverter() {
  return <ConversionClient />;
}

