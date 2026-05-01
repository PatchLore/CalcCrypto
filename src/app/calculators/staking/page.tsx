import type { Metadata } from 'next';
import { StakingClient } from './StakingClient';

const title = 'Staking Calculator | Free Crypto Calculator – CrypCal';
const description = 'Calculate staking rewards using deterministic inputs like amount, APY, duration, and compounding frequency. Same inputs produce the same outputs.';

export const metadata: Metadata = {
  title: 'Crypto Staking Rewards Calculator | CalcCrypto',
  description: 'Calculate crypto staking rewards with compound interest. See APY returns, earned interest and total value over time. Free, instant, no signup required.',
  alternates: { canonical: 'https://calccrypto.com/calculators/staking' },
  openGraph: {
    title: 'Crypto Staking Calculator — CalcCrypto',
    description: 'Calculate staking rewards, compound interest and APY returns for any cryptocurrency. Free educational estimates.',
    url: 'https://calccrypto.com/calculators/staking',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Staking Calculator',
    description: 'Calculate staking rewards, APY and compound interest instantly.',
  },
};

export default function StakingCalculator() {
  return <StakingClient />;
}
