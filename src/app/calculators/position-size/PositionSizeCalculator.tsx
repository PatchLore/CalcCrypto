'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { TooltipIcon } from '@/components/ui/TooltipIcon';
import { formatCurrency } from '@/lib/formulas';
import { calculatePositionSize, parsePositionSizeInputs, formatTokenAmount, getAllocationCategory } from '@/lib/positionSize';
import { trackEvent, trackButtonClick } from '@/lib/analytics';
import type { PositionSizeInput } from '@/types';

const RISK_PRESETS = [0.5, 1, 2, 3, 5];

export function PositionSizeCalculator() {
  const [inputs, setInputs] = useState<Record<keyof PositionSizeInput, string>>({
    accountSize: '',
    riskPercentage: '',
    entryPrice: '',
    stopLossPrice: '',
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const parsed = useMemo(() => parsePositionSizeInputs(inputs), [inputs]);

  const result = useMemo(() => calculatePositionSize(parsed), [parsed]);

  const entryStopError =
    parsed.entryPrice > 0 && parsed.stopLossPrice > 0 && parsed.entryPrice <= parsed.stopLossPrice;

  const positionAllocationPercent = result
    ? (result.capitalRequired / parsed.accountSize) * 100
    : 0;

  const allocationCategory = result ? getAllocationCategory(positionAllocationPercent) : null;

  const insufficientCapital = result ? result.capitalRequired > parsed.accountSize : false;
  const requiredLeverage = insufficientCapital && parsed.accountSize > 0
    ? result!.capitalRequired / parsed.accountSize
    : 0;

  const riskExamples = useMemo(() => {
    const size = parsed.accountSize;
    if (size <= 0) return null;
    const percents = [0.5, 1, 2, 5];
    return percents.map(pct => ({
      percent: pct,
      amount: size * (pct / 100),
    }));
  }, [parsed.accountSize]);

  useEffect(() => {
    trackEvent('calculator_loaded', 'PositionSize', 'position-size');
  }, []);

  useEffect(() => {
    if (result) {
      trackEvent('calculation', 'PositionSize', 'position-size');
    }
  }, [result]);

  const warnings = useMemo(() => {
    const list: { type: string; severity: 'warning' | 'error'; message: string }[] = [];
    if (!result) return list;

    if (parsed.riskPercentage > 10) {
      list.push({
        type: 'risk_very_high',
        severity: 'error',
        message: 'Very High Risk. Professional traders rarely risk this much on a single trade.',
      });
    } else if (parsed.riskPercentage > 5) {
      list.push({
        type: 'risk_high',
        severity: 'warning',
        message: 'High Risk. Risking more than 5% per trade can lead to significant account drawdowns after a series of losing trades.',
      });
    }

    if (result.stopDistancePercent > 90) {
      list.push({
        type: 'unrealistic_stop',
        severity: 'error',
        message: 'Unrealistic stop distance. Your stop is over 90% below entry. Review your trade setup and ensure prices were entered correctly.',
      });
    } else if (result.stopDistancePercent > 75) {
      list.push({
        type: 'extremely_wide_stop',
        severity: 'warning',
        message: 'Extremely wide stop loss. This setup may not represent a practical trade and will result in a very small position size.',
      });
    } else if (result.stopDistancePercent > 50) {
      list.push({
        type: 'wide_stop',
        severity: 'warning',
        message: 'Wide stop loss. Your stop is more than 50% from entry. This significantly reduces position size.',
      });
    }

    if (result.stopDistancePercent < 1 && result.stopDistancePercent > 0) {
      list.push({
        type: 'extremely_tight_stop',
        severity: 'warning',
        message: 'Extremely tight stop loss. Small price movements may trigger your stop before the trade has time to develop.',
      });
    }

    if (positionAllocationPercent > 50) {
      list.push({
        type: 'large_allocation',
        severity: 'warning',
        message: 'Large account allocation. Even though your risk is controlled, this trade requires a significant portion of your account.',
      });
    }

    if (insufficientCapital) {
      list.push({
        type: 'insufficient_capital',
        severity: 'error',
        message: `This trade requires ${formatCurrency(result.capitalRequired)} but your account balance is ${formatCurrency(parsed.accountSize)}. While your risk is controlled, you do not have enough capital to open this position without leverage. Suggestions: reduce position size, increase stop distance, use leverage (higher risk), or choose a smaller trade.`,
      });
    }

    return list;
  }, [result, parsed.riskPercentage, positionAllocationPercent, insufficientCapital]);

  useEffect(() => {
    if (warnings.length > 0) {
      warnings.forEach(w => {
        trackEvent('warning_triggered', 'PositionSize', w.type);
      });
    }
  }, [warnings]);

  const handleInputChange = (field: keyof PositionSizeInput, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleRiskPreset = (value: number) => {
    setInputs(prev => ({ ...prev, riskPercentage: String(value) }));
    trackEvent('risk_preset', 'PositionSize', `${value}_percent`);
  };

  const copyResult = useCallback((value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    trackButtonClick('copy_result', 'position-size-calculator');
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const selectedPreset = parsed.riskPercentage > 0
    ? RISK_PRESETS.find(p => Math.abs(p - parsed.riskPercentage) < 0.01) ?? null
    : null;

  return (
    <div className="min-h-screen">
      <header className="glass-card mx-4 mt-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl gold-accent rounded-lg p-2">₿</div>
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
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Position Size Calculator
            </h1>
            <p className="text-lg sm:text-xl text-secondary">
              Calculate how much capital to allocate per trade based on your risk tolerance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
                <CardDescription>
                  Enter your account details and trade setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Input
                  label="Account Size (USD)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.accountSize}
                  onChange={(e) => handleInputChange('accountSize', e.target.value)}
                  placeholder="e.g. 10000"
                  helperText="Total trading account balance"
                />

                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="text-sm font-medium text-crypto-foreground inline-flex items-center">
                      Quick Risk %
                      <TooltipIcon text="Most traders risk between 0.5% and 2% of their account per trade." />
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RISK_PRESETS.map(value => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRiskPreset(value)}
                        className={`min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          selectedPreset === value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-crypto-muted/40 text-crypto-foreground border-crypto-border hover:bg-crypto-muted/70'
                        }`}
                        aria-pressed={selectedPreset === value}
                        aria-label={`Set risk to ${value}%`}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label={
                    <span className="inline-flex items-center">
                      Risk per Trade (%)
                      <TooltipIcon text="The percentage of your account you are willing to lose if the stop loss is hit." />
                    </span>
                  }
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={inputs.riskPercentage}
                  onChange={(e) => handleInputChange('riskPercentage', e.target.value)}
                  placeholder="e.g. 1"
                  helperText="Percentage of account you are willing to risk"
                />

                <Input
                  label="Entry Price (USD)"
                  type="number"
                  step="0.00000001"
                  min="0"
                  value={inputs.entryPrice}
                  onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                  placeholder="e.g. 50000"
                />

                <Input
                  label="Stop Loss Price (USD)"
                  type="number"
                  step="0.00000001"
                  min="0"
                  value={inputs.stopLossPrice}
                  onChange={(e) => handleInputChange('stopLossPrice', e.target.value)}
                  placeholder="e.g. 45000"
                  error={entryStopError ? 'Stop loss must be below entry price' : undefined}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Position Details</CardTitle>
                <CardDescription>
                  Your calculated position breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-5 sm:space-y-6" role="region" aria-live="polite" aria-label="Position size calculation results">
                    <div className="p-5 sm:p-6 rounded-lg bg-crypto-muted border border-crypto-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-crypto-muted-foreground mb-1">
                            <span className="inline-flex items-center justify-center">
                              Recommended Position
                              <TooltipIcon text="The maximum amount you can buy while keeping your risk within limits." />
                            </span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-primary break-words">
                            {formatTokenAmount(result.positionSize)} units
                          </div>
                        </div>
                        <div className="text-center sm:border-l border-crypto-border/60 sm:pl-4">
                          <div className="text-sm text-crypto-muted-foreground mb-1">
                            Trade Value
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-crypto-foreground">
                            {formatCurrency(result.capitalRequired)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {warnings.length > 0 && (
                      <div className="space-y-2">
                        {warnings.map(w => (
                          <div
                            key={w.type}
                            className={`p-3 rounded-lg border ${
                              w.severity === 'error'
                                ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30'
                                : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30'
                            }`}
                            role="alert"
                          >
                            <p className={`text-sm ${
                              w.severity === 'error'
                                ? 'text-red-700 dark:text-red-400'
                                : 'text-amber-700 dark:text-amber-400'
                            }`}>
                              {w.severity === 'error' ? '🚨' : '⚠️'} {w.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-4">
                      <h2 className="font-semibold text-crypto-foreground">Breakdown</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40">
                          <div className="text-crypto-muted-foreground">Max Risk Amount</div>
                          <div className="font-medium text-crypto-error-600 dark:text-crypto-error-400">
                            {formatCurrency(result.riskAmount)}
                          </div>
                          <button
                            onClick={() => copyResult(formatCurrency(result.riskAmount), 'riskAmount')}
                            className="text-xs text-crypto-muted-foreground hover:text-primary mt-1 transition-colors min-h-[24px]"
                            aria-label={copiedField === 'riskAmount' ? 'Copied risk amount' : 'Copy risk amount'}
                          >
                            {copiedField === 'riskAmount' ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40">
                          <div className="text-crypto-muted-foreground">Capital Required</div>
                          <div className="font-medium text-crypto-foreground">
                            {formatCurrency(result.capitalRequired)}
                          </div>
                          <button
                            onClick={() => copyResult(formatCurrency(result.capitalRequired), 'capitalRequired')}
                            className="text-xs text-crypto-muted-foreground hover:text-primary mt-1 transition-colors min-h-[24px]"
                            aria-label={copiedField === 'capitalRequired' ? 'Copied capital required' : 'Copy capital required'}
                          >
                            {copiedField === 'capitalRequired' ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40">
                          <div className="text-crypto-muted-foreground">
                            <span className="inline-flex items-center">
                              Stop Distance
                              <TooltipIcon text="The percentage difference between your entry price and stop loss." />
                            </span>
                          </div>
                          <div className="font-medium text-crypto-warning-600 dark:text-crypto-warning-400">
                            {result.stopDistancePercent.toFixed(2)}%
                          </div>
                          <button
                            onClick={() => copyResult(`${result.stopDistancePercent.toFixed(2)}%`, 'stopDistance')}
                            className="text-xs text-crypto-muted-foreground hover:text-primary mt-1 transition-colors min-h-[24px]"
                            aria-label={copiedField === 'stopDistance' ? 'Copied stop distance' : 'Copy stop distance'}
                          >
                            {copiedField === 'stopDistance' ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40">
                          <div className="text-crypto-muted-foreground">Position Allocation</div>
                          <div className="font-medium text-crypto-foreground">
                            {positionAllocationPercent.toFixed(1)}% of account
                          </div>
                          {allocationCategory && (
                            <div className={`text-xs mt-1 ${
                              positionAllocationPercent < 10
                                ? 'text-crypto-success-600 dark:text-crypto-success-400'
                                : positionAllocationPercent < 25
                                ? 'text-crypto-foreground'
                                : 'text-crypto-warning-600 dark:text-crypto-warning-400'
                            }`}>
                              {allocationCategory.icon} {allocationCategory.label}
                            </div>
                          )}
                          <button
                            onClick={() => copyResult(`${positionAllocationPercent.toFixed(1)}%`, 'allocation')}
                            className="text-xs text-crypto-muted-foreground hover:text-primary mt-1 transition-colors min-h-[24px]"
                            aria-label={copiedField === 'allocation' ? 'Copied position allocation' : 'Copy position allocation'}
                          >
                            {copiedField === 'allocation' ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        {insufficientCapital && (
                          <div className="col-span-1 sm:col-span-2 p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40">
                            <div className="text-crypto-muted-foreground text-xs">Minimum Leverage Required</div>
                            <div className="font-medium text-crypto-foreground text-base mt-0.5">
                              {requiredLeverage.toFixed(2)}×
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {allocationCategory?.description && (
                      <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-muted/20">
                        <p className="text-xs text-crypto-muted-foreground leading-relaxed">
                          {allocationCategory.description}
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-crypto-border">
                      <div className="text-xs text-crypto-muted-foreground space-y-1">
                        <p>Entry: {formatCurrency(parsed.entryPrice)}</p>
                        <p>Stop: {formatCurrency(parsed.stopLossPrice)}</p>
                        <p>Risk: {parsed.riskPercentage}% of {formatCurrency(parsed.accountSize)}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        ℹ️ How position sizing works: Your risk amount determines how much you can lose. The distance between your entry and stop loss determines how large your position can be. Wider stops require smaller positions. Tighter stops allow larger positions. This helps traders keep losses consistent across different trades.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-crypto-muted-foreground">
                    <div className="text-4xl mb-4">📏</div>
                    <p>Enter your account size, risk %, entry price, and stop loss to calculate position size</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {riskExamples && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Account Risk Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-crypto-muted-foreground mb-3">
                  Based on your account of {formatCurrency(parsed.accountSize)}:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  {riskExamples.map(({ percent, amount }) => {
                    const isHighRisk = percent >= 5;
                    const isMediumRisk = percent >= 2;
                    return (
                      <div
                        key={percent}
                        className={`p-3 rounded-lg border ${
                          isHighRisk
                            ? 'border-crypto-error-200 dark:border-crypto-error-800 bg-crypto-error-50 dark:bg-crypto-error-950/30'
                            : isMediumRisk
                            ? 'border-crypto-warning-200 dark:border-crypto-warning-800 bg-crypto-warning-50 dark:bg-crypto-warning-950/30'
                            : 'border-crypto-success-200 dark:border-crypto-success-800 bg-crypto-success-50 dark:bg-crypto-success-950/30'
                        }`}
                      >
                        <div className="text-xs text-crypto-muted-foreground mb-1">
                          {percent}% Risk
                        </div>
                        <div className={`font-medium ${
                          isHighRisk
                            ? 'text-crypto-error-600 dark:text-crypto-error-400'
                            : isMediumRisk
                            ? 'text-crypto-warning-600 dark:text-crypto-warning-400'
                            : 'text-crypto-success-600 dark:text-crypto-success-400'
                        }`}>
                          {formatCurrency(amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-10 p-4 border border-crypto-border rounded-lg bg-crypto-muted/20 text-sm text-crypto-muted-foreground text-center">
            This tool provides educational estimates only and is not financial advice. Always verify with your exchange and broker.
          </div>
        </div>
      </div>
    </div>
  );
}
