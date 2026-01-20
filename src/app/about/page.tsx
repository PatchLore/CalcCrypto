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
              A practical, read-only set of crypto calculators and context tools.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What is CrypCal?</CardTitle>
              <CardDescription>A simple web app for deterministic crypto calculations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>
                CrypCal is an independent tool for exploring common crypto scenarios (profit/loss, DCA, staking, mining)
                using straightforward inputs and deterministic calculations.
              </p>
              <p>
                It is designed to be easy to understand: you enter numbers, it shows the result and a transparent
                breakdown where applicable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why it was built</CardTitle>
              <CardDescription>To make common crypto math faster to check and easier to interpret.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>
                Many crypto tools either hide assumptions, require sign-ups, or mix analysis with promotional messaging.
                CrypCal exists to provide a clean baseline: deterministic calculations plus optional, read-only context.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How it’s different from other crypto tools</CardTitle>
              <CardDescription>Focused on clarity, determinism, and minimal data collection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Independent and read-only:</strong> no wallets, no transactions, no account required.
                </li>
                <li>
                  <strong>Deterministic calculations:</strong> same inputs produce the same outputs.
                </li>
                <li>
                  <strong>Optional context:</strong> some features may fetch public market structure data (for example,
                  liquidity and volume) to help explain what the numbers mean.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What it does NOT do</CardTitle>
              <CardDescription>Important boundaries to keep the tool safe and understandable.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li>No financial, investment, tax, or legal advice</li>
                <li>No predictions or forecasts</li>
                <li>No trading signals or recommendations</li>
                <li>No wallet connections or asset management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transparency & limitations</CardTitle>
              <CardDescription>How to interpret results responsibly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>
                Results depend on the inputs you provide and the assumptions each calculator uses. When market data is
                displayed, it comes from public third-party sources and may be delayed, incomplete, or temporarily
                unavailable.
              </p>
              <p>
                Use CrypCal as a reference for understanding numbers — and validate important decisions with multiple
                sources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & data handling</CardTitle>
              <CardDescription>Designed to minimize data collection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li>No accounts</li>
                <li>No wallets</li>
                <li>No storing of your calculator inputs</li>
                <li>No tracking designed to identify you as an individual</li>
              </ul>
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

