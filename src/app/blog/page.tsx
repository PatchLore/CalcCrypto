'use client';

import Link from 'next/link';
import { trackNavigation } from '@/lib/analytics';

export default function BlogPage() {
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
              <Link
                href="/"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
                onClick={() => trackNavigation('/')}
              >
                Home
              </Link>
              <Link
                href="/calculators"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
                onClick={() => trackNavigation('/calculators')}
              >
                Calculators
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">📝</div>
          <h1 className="text-4xl font-bold text-crypto-foreground mb-4">
            Blog & Insights
          </h1>
          <p className="text-xl text-crypto-muted-foreground mb-8">
            Crypto insights and tool guides coming soon.
          </p>
          <p className="text-sm text-crypto-muted-foreground mb-8">
            All content will be educational and low-liability.
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{ background: '#667eea', color: '#ffffff' }}
            onClick={() => trackNavigation('/')}
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-crypto-border bg-crypto-background/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 text-sm text-crypto-muted-foreground">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>© 2025 CrypCal. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  className="hover:text-crypto-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-crypto-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}