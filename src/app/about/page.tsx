import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-crypto-background">
      {/* Header */}
      <header className="border-b border-crypto-border bg-crypto-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">₿</div>
              <h1 className="text-2xl font-bold text-crypto-primary-600 dark:text-crypto-primary-400">
                CrypCal
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors">
                Home
              </Link>
              <Link href="/calculators" className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors">
                Calculators
              </Link>
              <Link href="/about" className="text-crypto-primary-600 dark:text-crypto-primary-400 font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4">ℹ️</div>
            <h2 className="text-4xl font-bold text-crypto-foreground mb-3">About CrypCal</h2>
            <p className="text-lg text-crypto-muted-foreground">
              Simple, fast crypto calculators designed to help you understand numbers clearly.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What this site is</CardTitle>
              <CardDescription>Crypto calculators and tools for quick estimation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>
                CrypCal provides browser-based calculators for common crypto scenarios like profit/loss, DCA, staking,
                and mining. The focus is on clarity and speed: enter inputs, see outputs immediately.
              </p>
              <p>
                Results are informational and should be validated before making financial decisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Designed to keep your inputs on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>
                Calculator inputs are processed locally in the browser. We do not ask you to connect a wallet.
              </p>
              <p>
                Basic analytics may be used to understand usage patterns and improve the product.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/calculators"
              className="inline-flex items-center justify-center rounded-lg bg-crypto-primary-600 text-white px-5 py-3 hover:bg-crypto-primary-700 transition-colors"
            >
              Browse calculators
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-crypto-border px-5 py-3 text-crypto-foreground hover:bg-white/5 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

