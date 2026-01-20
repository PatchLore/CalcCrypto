import type { Metadata } from 'next';
import { PositionSizeClient } from './PositionSizeClient';

const title = 'Position Size Calculator | Free Crypto Calculator – CrypCal';
const description = 'Calculate position size based on account size, risk per trade, entry price, and stop-loss price. Outputs are deterministic and based only on your inputs.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/calculators/position-size',
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

export default function PositionSizeCalculator() {
  return <PositionSizeClient />;
}

