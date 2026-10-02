import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './crypto-macro.module.css';
import { DISCLOSURE } from '@/lib/crypto-macro/config';

export const metadata: Metadata = {
  title: 'Crypto Macro | Market Relationships',
  description: 'A transparent dashboard for crypto and macro-market relationships.',
  robots: process.env.CRYPTO_MACRO_INDEXABLE === 'true' ? { index: true, follow: true } : { index: false, follow: false },
};

export default function CryptoMacroLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.app}>
    <div className={styles.topbar}><Link href="/crypto-macro" className={styles.brand}><span className={styles.brandMark}>⌁</span> CRYPTO MACRO</Link><nav><Link href="/crypto-macro">Dashboard</Link><Link href="/crypto-macro/methodology">Methodology</Link><Link href="/crypto-macro/privacy">Privacy</Link></nav></div>
    {children}
    <div className={styles.disclosure}>{DISCLOSURE}</div>
  </div>;
}
