import type { Metadata } from 'next';
import { MiningClient } from './MiningClient';

const title = 'Mining Calculator | Free Crypto Calculator – CrypCal';
const description = 'Estimate mining profitability from deterministic inputs like hashrate, power consumption, electricity cost, pool fees, and price. Same inputs produce the same outputs.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/calculators/mining',
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

export default function MiningCalculator() {
  return <MiningClient />;
}
