import type { Metadata } from 'next';
import { ConversionClient } from './ConversionClient';

const title = 'Currency Converter | Free Crypto Calculator – CrypCal';
const description = 'Convert between cryptocurrencies and fiat currencies using a simple, read-only interface. This tool is designed for clear, deterministic outputs.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/calculators/conversion',
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

export default function CurrencyConverter() {
  return <ConversionClient />;
}

