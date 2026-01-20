import type { Metadata } from 'next';
import { DCAClient } from './DCAClient';

const title = 'DCA Calculator | Free Crypto Calculator – CrypCal';
const description = 'Estimate the results of a dollar-cost averaging plan using deterministic inputs like contribution amount, duration, average buy price, and current price. Same inputs produce the same outputs.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/calculators/dca',
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

export default function DCACalculator() {
  return <DCAClient />;
}
