/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { APP_CONFIG, CALCULATORS } from '@/lib/constants';
import { useMemo, useState } from 'react';

export default function CalculatorsPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | keyof typeof categoryLabels>('all');

  const categoryLabels = {
    'profit-loss': 'Trading',
    'dca': 'Investment',
    'staking': 'Earning',
    'mining': 'Mining',
    'tax': 'Tax',
    'portfolio': 'Portfolio',
    'conversion': 'Tools',
  };

  const filterOptions: Array<{ key: 'all' | keyof typeof categoryLabels; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'profit-loss', label: 'Trading' },
    { key: 'dca', label: 'Investment' },
    { key: 'staking', label: 'Earning' },
    { key: 'mining', label: 'Mining' },
    { key: 'tax', label: 'Tax' },
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'conversion', label: 'Tools' },
  ];

  const categoryAccent = (category: keyof typeof categoryLabels) => {
    const label = categoryLabels[category];
    switch (label) {
      case 'Trading':
        return 'border-t-blue-500/80';
      case 'Investment':
        return 'border-t-green-500/80';
      case 'Earning':
        return 'border-t-purple-500/80';
      case 'Mining':
        return 'border-t-orange-500/80';
      case 'Tax':
        return 'border-t-red-500/80';
      case 'Portfolio':
        return 'border-t-teal-500/80';
      case 'Tools':
      default:
        return 'border-t-slate-400/70';
    }
  };

  const visibleCalculators = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CALCULATORS.filter((c) => {
      const matchesFilter = activeFilter === 'all' ? true : c.category === activeFilter;
      const matchesQuery = q.length === 0
        ? true
        : `${c.name} ${c.description} ${categoryLabels[c.category as keyof typeof categoryLabels] ?? ''}`
          .toLowerCase()
          .includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  return (
    <div className="min-h-screen">
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
              <Link href="/calculators" className="text-primary font-medium">
                Calculators
              </Link>
              <Link href="/about" className="text-secondary hover:text-primary transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            All Calculators
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Free crypto calculators for smarter trading decisions. No signup required.
          </p>
          <div className="mt-5 text-sm text-secondary/90">
            <span className="inline-flex items-center rounded-full border border-crypto-border/60 bg-crypto-background/60 px-3 py-1">
              {CALCULATORS.length} Professional Tools
            </span>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div className="relative w-full md:max-w-md">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search calculators…"
                className="w-full rounded-xl border border-crypto-border/60 bg-crypto-background/50 px-4 py-3 text-primary placeholder:text-secondary/70 outline-none focus:border-crypto-border focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filterOptions.map((opt) => {
                const isActive = activeFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setActiveFilter(opt.key)}
                    className={[
                      'px-3 py-2 rounded-lg text-sm border transition-colors',
                      isActive
                        ? 'border-crypto-border bg-crypto-background/70 text-primary'
                        : 'border-crypto-border/60 bg-crypto-background/30 text-secondary hover:text-primary hover:border-crypto-border',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust signals */}
          <div className="mb-6 rounded-xl border border-crypto-border/60 bg-crypto-background/40 px-4 py-3 text-sm text-secondary">
            ✓ 100% Free <span className="px-2 text-secondary/60">|</span> ✓ Privacy First{' '}
            <span className="px-2 text-secondary/60">|</span> ✓ No Registration
          </div>

          {/* Unified grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch">
            {visibleCalculators.map((calculator) => {
              const category = calculator.category as keyof typeof categoryLabels;
              const categoryLabel = categoryLabels[category] ?? category;
              const isPopular = calculator.featured === true;

              return (
                <Link key={calculator.id} href={calculator.path} className="block h-full">
                  <Card
                    className={[
                      'group h-full flex flex-col cursor-pointer border border-crypto-border/60 bg-gradient-to-b from-white/5 to-transparent',
                      'transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:border-crypto-border',
                      'border-t-4',
                      categoryAccent(category),
                    ].join(' ')}
                  >
                    <CardHeader className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-[48px] leading-none">{calculator.icon}</div>
                        <div className="flex items-center gap-2">
                          {isPopular && (
                            <span className="text-xs font-semibold rounded-full px-2 py-1 border border-crypto-border/60 bg-crypto-background/60 text-primary">
                              Most Popular
                            </span>
                          )}
                          <span className="text-xs rounded-full px-2 py-1 border border-crypto-border/50 bg-crypto-background/30 text-secondary">
                            {categoryLabel}
                          </span>
                        </div>
                      </div>

                      <CardTitle className="mt-3 group-hover:text-yellow-300 transition-colors">
                        {calculator.name}
                      </CardTitle>
                      <CardDescription className="truncate" title={calculator.description}>
                        {calculator.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="mt-auto">
                      <div className="btn-primary w-full text-center font-semibold">
                        Calculate →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {visibleCalculators.length === 0 && (
            <div className="text-center text-secondary mt-10">
              No calculators match your search.
            </div>
          )}

          {/* Footer helper */}
          <div className="mt-12 rounded-2xl border border-crypto-border/60 bg-crypto-background/40 px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-secondary">
              <div className="text-primary font-semibold">Can’t find what you need?</div>
              <div className="text-sm">
                Email us at{' '}
                <a className="underline hover:text-primary" href={`mailto:${APP_CONFIG.supportEmail}`}>
                  {APP_CONFIG.supportEmail}
                </a>
              </div>
            </div>
            <a
              className="btn-primary text-center px-5 py-3 rounded-xl"
              href={`mailto:${APP_CONFIG.supportEmail}?subject=Calculator%20Suggestion`}
            >
              Suggest a Calculator →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


