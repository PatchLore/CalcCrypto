'use client';

import React, { Suspense } from 'react';
import { Phase2DecisionPanel } from '@/features/phase2/components/Phase2DecisionPanel';

// Simple error boundary for Phase 2 components
class Phase2ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Phase 2 Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded border border-red-200">
          <h2 className="text-xl font-bold mb-4 text-red-600">
            Phase 2 Features Temporarily Unavailable
          </h2>
          <p className="mb-4">
            We're experiencing issues loading the risk assessment features.
            The core calculator functionality remains available.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary rounded hover:bg-primary/80 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function TokenPriceCalculator() {
  const phase2Enabled =
    process.env.NEXT_PUBLIC_PHASE_2_ENABLED === 'true';

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
              <a
                href="/"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
              >
                Home
              </a>
              <a
                href="/calculators"
                className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors"
              >
                Calculators
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-4xl font-bold text-crypto-foreground mb-4">
              Token Price Calculator
            </h1>
            <p className="text-xl text-crypto-muted-foreground">
              Get current price and risk assessment for any token
            </p>
          </div>

          {/* Phase 2 Components (conditionally rendered) */}
          {phase2Enabled ? (
            <Phase2ErrorBoundary>
              <Suspense fallback={<div className="p-6 text-center">Loading Phase 2 features...</div>}>
                <div className="space-y-8">
                  <Phase2DecisionPanel calculator="token-price" />
                </div>
              </Suspense>
            </Phase2ErrorBoundary>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-crypto-muted-foreground">
                Phase 2 risk assessment features are currently disabled.
              </p>
              <p className="mt-4 text-sm text-crypto-muted-foreground">
                To enable, set NEXT_PUBLIC_PHASE_2_ENABLED=true in .env.local
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-crypto-border bg-crypto-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 text-sm text-crypto-muted-foreground">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>© 2025 CrypCal. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <a
                  href="/privacy"
                  className="hover:text-crypto-foreground transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="hover:text-crypto-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}