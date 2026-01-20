import type { Metadata } from 'next';
import { ProfitLossClient } from './ProfitLossClient';

const title = 'Profit/Loss Calculator | Free Crypto Calculator – CrypCal';
const description = 'Calculate profit or loss from a crypto trade using deterministic inputs like buy price, sell price, quantity, and fees. Same inputs produce the same outputs.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/calculators/profit-loss',
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

export default function ProfitLossCalculator() {
  return <ProfitLossClient />;
}


