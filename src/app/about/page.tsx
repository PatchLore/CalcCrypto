import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import SupportSection from '@/components/SupportSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-crypto-background">
      {/* Header */}
      <header className="glass-card mx-4 mt-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-bold text-primary rounded-lg px-3 py-2 border border-crypto-border/60 bg-crypto-background/60">
                CC
              </div>
              <h1 className="text-2xl font-bold text-primary">
                CrypCal
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-secondary hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/calculators" className="text-secondary hover:text-primary transition-colors">
                Calculators
              </Link>
              <Link href="/about" className="text-primary font-medium">
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
            <h2 className="text-4xl font-bold text-crypto-foreground mb-3">About CrypCal</h2>
            <p className="text-lg text-crypto-muted-foreground">
              Clear, read-only crypto calculators built for understanding — not hype.
            </p>
          </div>

          <div className="space-y-4 text-crypto-muted-foreground">
            <p>
              CrypCal is a practical web app for exploring common cryptocurrency scenarios using deterministic calculations and transparent inputs.
            </p>
            <p>
              You enter numbers. CrypCal shows the result — clearly, consistently, and without hidden assumptions.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What is CrypCal?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>
                CrypCal helps you calculate and interpret everyday crypto maths such as:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Profit and loss</li>
                <li>Dollar-cost averaging (DCA)</li>
                <li>Staking rewards</li>
                <li>Mining profitability</li>
              </ul>
              <p>
                Each calculator is designed to be simple, deterministic, and easy to verify. The same inputs will always produce the same outputs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why it was built</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>Many crypto tools:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Hide assumptions</li>
                <li>Require sign-ups</li>
                <li>Mix analysis with promotion or advice</li>
              </ul>
              <p>
                CrypCal was built to provide a clean baseline: straightforward calculations with optional, read-only context — nothing more.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How CrypCal is different</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>CrypCal prioritises clarity, determinism, and minimal data collection.</p>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-crypto-foreground">Independent and read-only</div>
                  <div>No wallets, no transactions, no accounts</div>
                </div>
                <div>
                  <div className="font-semibold text-crypto-foreground">Deterministic calculations</div>
                  <div>Identical inputs always produce identical results</div>
                </div>
                <div>
                  <div className="font-semibold text-crypto-foreground">Optional context, not advice</div>
                  <div>Some features may display public market structure data (such as liquidity or volume) to help explain what the numbers mean — never to predict outcomes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What CrypCal does NOT do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>To keep the tool safe and understandable, CrypCal does not provide:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Financial, investment, tax, or legal advice</li>
                <li>Predictions or forecasts</li>
                <li>Trading signals or recommendations</li>
                <li>Wallet connections or asset management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transparency & limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>
                All results depend on the inputs you provide and the assumptions documented within each calculator.
              </p>
              <p>
                When market data is shown, it comes from public third-party sources and may be delayed, incomplete, or temporarily unavailable.
              </p>
              <p>
                Use CrypCal as a reference for understanding numbers — and validate important decisions using multiple sources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & data handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>CrypCal is designed to minimise data collection.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>No accounts</li>
                <li>No wallets</li>
                <li>No storage of calculator inputs</li>
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

          <div className="pt-8">
            <SupportSection />
          </div>

          <div className="pt-4 text-center text-sm text-crypto-muted-foreground">
            © 2025 CrypCal. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

