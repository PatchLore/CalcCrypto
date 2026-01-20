import type { Metadata } from 'next';
import { CalculatorsClient } from './CalculatorsClient';

const title = 'All Calculators | Free Crypto Calculator – CrypCal';
const description = 'Browse CrypCal’s free crypto calculators. Each tool is read-only and designed for clear, deterministic results with no signup required.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/calculators',
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
  return <CalculatorsClient />;
}


