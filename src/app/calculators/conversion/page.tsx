import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const title = 'Currency Converter | Free Crypto Calculator – CrypCal';
const description = 'Convert between cryptocurrencies and fiat currencies using a simple, read-only interface. This tool is designed for clear, deterministic outputs.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/calculators/conversion',
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

export default function CurrencyConverter() {
  return (
    <div className="min-h-screen bg-crypto-background">
      {/* Header */}
      <header className="border-b border-crypto-border bg-crypto-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">₿</div>
              <div className="text-2xl font-bold text-crypto-primary-600 dark:text-crypto-primary-400">
                CrypCal
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors">
                Home
              </Link>
              <Link href="/calculators" className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors">
                Calculators
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🔄</div>
            <h1 className="text-4xl font-bold text-crypto-foreground mb-4">
              Currency Converter
            </h1>
            <p className="text-xl text-crypto-muted-foreground">
              Convert between different cryptocurrencies and fiat currencies.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                The Currency Converter is currently under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🚧</div>
                <p className="text-crypto-muted-foreground mb-6">
                  This converter will allow you to convert between different cryptocurrencies and 
                  fiat currencies with real-time exchange rates.
                </p>
                <Link href="/calculators">
                  <div className="inline-block bg-crypto-primary-600 text-white px-6 py-3 rounded-md hover:bg-crypto-primary-700 transition-colors">
                    Back to Calculators
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

