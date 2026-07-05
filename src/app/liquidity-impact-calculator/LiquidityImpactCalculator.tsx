'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { TooltipIcon } from '@/components/ui/TooltipIcon';
import { formatCurrency } from '@/lib/formulas';
import { calculateMarketImpact, calculateSlippage } from '@/lib/liquidityCalculations';
import { calculateRiskScore, getRiskLabel, getRiskColor, getSlippageColor } from '@/lib/riskScoring';
import { getWarnings } from '@/lib/warnings';
import { trackEvent } from '@/lib/analytics';
import type { LiquidityImpactInput } from '@/types';

interface Props {
  initialTradeSize?: number;
}

export function LiquidityImpactCalculator({ initialTradeSize }: Props) {
  const [inputs, setInputs] = useState<Record<keyof LiquidityImpactInput, string>>({
    tradeSize: initialTradeSize ? String(initialTradeSize) : '',
    volume24h: '',
    marketCap: '',
    multiplier: '',
  });

  const parsed = useMemo(() => ({
    tradeSize: parseFloat(inputs.tradeSize) || 0,
    volume24h: parseFloat(inputs.volume24h) || 0,
    marketCap: parseFloat(inputs.marketCap) || undefined,
    multiplier: parseFloat(inputs.multiplier) || undefined,
  }), [inputs]);

  const marketImpact = useMemo(() => calculateMarketImpact(parsed), [parsed]);
  const slippage = useMemo(
    () => marketImpact ? calculateSlippage(marketImpact.impactPercent) : null,
    [marketImpact],
  );
  const riskScore = useMemo(
    () => marketImpact ? calculateRiskScore(marketImpact.ratioPercent) : 0,
    [marketImpact],
  );
  const riskLabel = useMemo(() => getRiskLabel(riskScore), [riskScore]);
  const riskColor = useMemo(() => getRiskColor(riskScore), [riskScore]);
  const warnings = useMemo(
    () => marketImpact ? getWarnings(marketImpact.ratioPercent) : [],
    [marketImpact],
  );

  const handleInputChange = (field: keyof LiquidityImpactInput, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    trackEvent('calculator_loaded', 'LiquidityImpact', 'liquidity-impact');
  }, []);

  useEffect(() => {
    if (marketImpact) {
      trackEvent('calculation', 'LiquidityImpact', 'liquidity-impact');
    }
  }, [marketImpact]);

  const hasResult = marketImpact && slippage;

  return (
    <div className="min-h-screen">
      <header className="glass-card mx-4 mt-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl gold-accent rounded-lg p-2">🌊</div>
              <div className="text-2xl font-bold text-primary">
                CrypCal
              </div>
            </div>
            <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-secondary hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/calculators" className="text-secondary hover:text-primary transition-colors">
                Calculators
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-6xl mb-4">🌊</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Liquidity & Impact Calculator
            </h1>
            <p className="text-lg sm:text-xl text-secondary">
              Estimate slippage and liquidity risk before entering a crypto trade.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Trade Details</CardTitle>
                <CardDescription>
                  Enter your trade size and the token&apos;s 24-hour volume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Input
                  label={
                    <span className="inline-flex items-center">
                      Trade Size (USD)
                      <TooltipIcon text="The total dollar value of the position you want to open or close." />
                    </span>
                  }
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.tradeSize}
                  onChange={(e) => handleInputChange('tradeSize', e.target.value)}
                  placeholder="e.g. 5000"
                  helperText={initialTradeSize ? 'Pre-filled from Position Size Calculator' : 'Your intended position value'}
                />

                <Input
                  label={
                    <span className="inline-flex items-center">
                      24h Volume (USD)
                      <TooltipIcon text="The token's total trading volume over the last 24 hours. Available on DexScreener, CoinGecko, or any DEX." />
                    </span>
                  }
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.volume24h}
                  onChange={(e) => handleInputChange('volume24h', e.target.value)}
                  placeholder="e.g. 100000"
                  helperText="Find this on any DEX or exchange"
                />

                <Input
                  label="Market Cap (USD)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.marketCap}
                  onChange={(e) => handleInputChange('marketCap', e.target.value)}
                  placeholder="Optional"
                  helperText="Used for additional context only"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  Market impact, slippage, and liquidity assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasResult ? (
                  <div className="space-y-5 sm:space-y-6" role="region" aria-live="polite" aria-label="Liquidity impact results">
                    <div className={`p-5 sm:p-6 rounded-lg border ${riskColor.bg} ${riskColor.border}`}>
                      <div className="text-center">
                        <div className="text-sm text-crypto-muted-foreground mb-1">Liquidity Risk Score</div>
                        <div className={`text-4xl font-bold ${riskColor.text}`}>
                          {riskScore}
                          <span className="text-lg font-normal text-crypto-muted-foreground">/100</span>
                        </div>
                        <div className={`text-sm font-medium mt-1 ${riskColor.text}`}>
                          {riskLabel} Liquidity
                        </div>
                      </div>
                    </div>

                    {warnings.length > 0 && (
                      <div className="space-y-2">
                        {warnings.map(w => (
                          <div
                            key={w.type}
                            className={`p-3 rounded-lg border ${
                              w.type === 'extreme' || w.type === 'high'
                                ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30'
                                : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30'
                            }`}
                            role="alert"
                          >
                            <p className={`text-sm ${
                              w.type === 'extreme' || w.type === 'high'
                                ? 'text-red-700 dark:text-red-400'
                                : 'text-amber-700 dark:text-amber-400'
                            }`}>
                              {w.type === 'extreme' ? '🚨' : '⚠️'} {w.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-4">
                      <h2 className="font-semibold text-crypto-foreground">Slippage</h2>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40">
                          <div className="text-crypto-muted-foreground text-xs">Entry</div>
                          <div className={`font-medium text-lg ${getSlippageColor(slippage.entrySlippage)}`}>
                            {slippage.entrySlippage.toFixed(2)}%
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40">
                          <div className="text-crypto-muted-foreground text-xs">Exit</div>
                          <div className={`font-medium text-lg ${getSlippageColor(slippage.exitSlippage)}`}>
                            {slippage.exitSlippage.toFixed(2)}%
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40">
                          <div className="text-crypto-muted-foreground text-xs">Round Trip</div>
                          <div className={`font-medium text-lg ${getSlippageColor(slippage.totalRoundTrip)}`}>
                            {slippage.totalRoundTrip.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="font-semibold text-crypto-foreground">Market Impact</h2>
                      <div className="p-4 rounded-lg border border-crypto-border/60 bg-crypto-muted/20 text-center">
                        <div className="text-sm text-crypto-muted-foreground mb-1">Estimated Price Impact</div>
                        <div className={`text-2xl font-bold ${getSlippageColor(marketImpact.impactPercent)}`}>
                          {marketImpact.impactPercent.toFixed(2)}%
                        </div>
                        <div className="text-xs text-crypto-muted-foreground mt-1">
                          Trade is {marketImpact.ratioPercent.toFixed(2)}% of 24h volume
                        </div>
                      </div>
                    </div>

                    {parsed.marketCap && parsed.marketCap > 0 && (
                      <div className="pt-2 border-t border-crypto-border">
                        <div className="text-xs text-crypto-muted-foreground space-y-1">
                          <p>Market Cap: {formatCurrency(parsed.marketCap)}</p>
                          <p>Trade / MCap: {((parsed.tradeSize / parsed.marketCap) * 100).toFixed(4)}%</p>
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        ℹ️ For large trades, consider splitting into smaller orders across multiple hours or days to reduce market impact.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-crypto-muted-foreground">
                    <div className="text-4xl mb-4">🌊</div>
                    <p>Enter your trade size and the token&apos;s 24h volume to assess liquidity risk.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 p-4 border border-crypto-border rounded-lg bg-crypto-muted/20 text-sm text-crypto-muted-foreground text-center">
            This tool provides educational estimates only. Actual slippage depends on order book depth, trading pair liquidity, and market conditions at the time of execution.
          </div>
        </div>
      </div>
    </div>
  );
}
