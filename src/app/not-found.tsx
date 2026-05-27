import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | CrypCal',
  description: 'The page you are looking for does not exist or has been moved. Browse our free crypto calculators instead.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-crypto-background flex flex-col items-center justify-center px-4">
      <div className="max-w-lg text-center space-y-6">
        <div className="text-8xl font-bold text-crypto-primary-600/20 select-none">404</div>
        
        <h1 className="text-3xl font-bold text-crypto-foreground">
          Page Not Found
        </h1>
        
        <p className="text-crypto-muted-foreground text-lg">
          The page you are looking for does not exist, has been moved, or 
          is still under development. All of our tools are accessible from 
          the calculators page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/calculators"
            className="inline-flex items-center justify-center rounded-lg bg-crypto-primary-600 text-white px-6 py-3 font-medium hover:bg-crypto-primary-700 transition-colors"
          >
            Browse All Calculators
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-crypto-border px-6 py-3 font-medium text-crypto-foreground hover:bg-white/5 transition-colors"
          >
            Go Home
          </Link>
        </div>

        <div className="border-t border-crypto-border pt-8 mt-8">
          <h2 className="text-lg font-semibold text-crypto-foreground mb-3">
            Popular Calculators
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              href="/calculators/profit-loss"
              className="block rounded-lg border border-crypto-border p-3 hover:bg-crypto-muted/30 transition-colors text-crypto-muted-foreground hover:text-crypto-foreground"
            >
              Profit & Loss
            </Link>
            <Link
              href="/calculators/dca"
              className="block rounded-lg border border-crypto-border p-3 hover:bg-crypto-muted/30 transition-colors text-crypto-muted-foreground hover:text-crypto-foreground"
            >
              DCA Calculator
            </Link>
            <Link
              href="/calculators/staking"
              className="block rounded-lg border border-crypto-border p-3 hover:bg-crypto-muted/30 transition-colors text-crypto-muted-foreground hover:text-crypto-foreground"
            >
              Staking Calculator
            </Link>
            <Link
              href="/calculators/tax"
              className="block rounded-lg border border-crypto-border p-3 hover:bg-crypto-muted/30 transition-colors text-crypto-muted-foreground hover:text-crypto-foreground"
            >
              Tax Calculator
            </Link>
          </div>
        </div>

        <div className="text-xs text-crypto-muted-foreground pt-8">
          Need help? <Link href="/contact" className="text-crypto-primary-600 hover:underline">Contact us</Link>
          {' · '}
          <Link href="/blog" className="text-crypto-primary-600 hover:underline">Visit our blog</Link>
        </div>
      </div>
    </div>
  );
}