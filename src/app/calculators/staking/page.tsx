import type { Metadata } from 'next';
import { StakingClient } from './StakingClient';

const title = 'Staking Calculator | Free Crypto Calculator – CrypCal';
const description = 'Calculate staking rewards using deterministic inputs like amount, APY, duration, and compounding frequency. Same inputs produce the same outputs.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/calculators/staking',
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

export default function StakingCalculator() {
  return <StakingClient />;
}
