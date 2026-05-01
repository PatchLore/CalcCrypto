import type { Metadata } from 'next';
import { MiningClient } from './MiningClient';

const title = 'Mining Calculator | Free Crypto Calculator – CrypCal';
const description = 'Estimate mining profitability from deterministic inputs like hashrate, power consumption, electricity cost, pool fees, and price. Same inputs produce the same outputs.';

export const metadata: Metadata = {
  title: 'Crypto Mining Profitability Calculator | CalcCrypto',
  description: 'Calculate cryptocurrency mining profitability. Estimate daily, weekly and monthly returns including power costs, pool fees and hardware efficiency. Free, no signup required.',
  alternates: { canonical: 'https://calccrypto.com/calculators/mining' },
  openGraph: {
    title: 'Crypto Mining Calculator — CalcCrypto',
    description: 'Calculate mining profitability, power costs, and potential returns for Bitcoin and other PoW cryptocurrencies. Free educational estimates.',
    url: 'https://calccrypto.com/calculators/mining',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Mining Calculator',
    description: 'Calculate mining profitability, electricity costs and expected returns instantly.',
  },
};

export default function MiningCalculator() {
  return <MiningClient />;
}
