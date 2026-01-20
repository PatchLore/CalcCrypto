'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/formulas';

type PositionSizeInputs = {
  accountSize: string;
  riskPercent: string;
  entryPrice: string;
  stopLossPrice: string;
};

type PositionSizeResult = {
  riskAmountUsd: number;
  riskPerUnitUsd: number;
  positionSizeUnits: number;
  investAmountUsd: number;
  maxLossUsd: number;
};

function formatUnits(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 8,
  }).format(value);
}

export function PositionSizeClient() {
  const [inputs, setInputs] = useState<PositionSizeInputs>({
    accountSize: '',
    riskPercent: '',
    entryPrice: '',
    stopLossPrice: '',
  });

  const [showErrors, setShowErrors] = useState(false);
  const [result, setResult] = useState<PositionSizeResult | null>(null);

  const accountSize = parseFloat(inputs.accountSize);
  const riskPercent = parseFloat(inputs.riskPercent);
  const entryPrice = parseFloat(inputs.entryPrice);
  const stopLossPrice = parseFloat(inputs.stopLossPrice);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof PositionSizeInputs, string>> = {};

    const requirePositive = (key: keyof PositionSizeInputs, value: number, label: string) => {
      const raw = inputs[key];
      if (!showErrors && raw.trim() === '') return;
      if (!Number.isFinite(value) || value <= 0) next[key] = `${label} must be a positive number.`;
    };

    requirePositive('accountSize', accountSize, 'Account Size');
    requirePositive('riskPercent', riskPercent, 'Risk Per Trade');
    requirePositive('entryPrice', entryPrice, 'Entry Price');
    requirePositive('stopLossPrice', stopLossPrice, 'Stop-Loss Price');

    if ((showErrors || inputs.riskPercent.trim() !== '') && Number.isFinite(riskPercent)) {
      if (riskPercent <= 0 || riskPercent > 100) {
        next.riskPercent = 'Risk Per Trade must be greater than 0% and no more than 100%.';
      }
    }

    if ((showErrors || inputs.stopLossPrice.trim() !== '' || inputs.entryPrice.trim() !== '') &&
      Number.isFinite(entryPrice) && Number.isFinite(stopLossPrice)
    ) {
      if (stopLossPrice >= entryPrice) {
        next.stopLossPrice = 'Stop-Loss Price must be less than Entry Price.';
      }
    }

    return next;
  }, [accountSize, entryPrice, inputs, riskPercent, showErrors, stopLossPrice]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleInputChange = (field: keyof PositionSizeInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    setShowErrors(true);

    if (hasErrors) {
      setResult(null);
      return;
    }

    const riskAmountUsd = accountSize * (riskPercent / 100);
    const riskPerUnitUsd = entryPrice - stopLossPrice;

    // Guard (should be unreachable with validation, but keeps the calc safe)
    if (!(riskPerUnitUsd > 0)) {
      setResult(null);
      return;
    }

    const positionSizeUnits = riskAmountUsd / riskPerUnitUsd;
    const investAmountUsd = positionSizeUnits * entryPrice;
    const maxLossUsd = riskAmountUsd;

    setResult({
      riskAmountUsd,
      riskPerUnitUsd,
      positionSizeUnits,
      investAmountUsd,
      maxLossUsd,
    });
  };

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
              <div className="text-2xl font-bold text-primary">
                CrypCal
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
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

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Position Size Calculator
            </h1>
            <p className="text-xl text-secondary">
              Calculate how much to buy based on risk tolerance and stop-loss.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Parameters</CardTitle>
                <CardDescription>
                  Enter your account size, risk %, entry, and stop-loss.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Account Size (USD)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.accountSize}
                  onChange={(e) => handleInputChange('accountSize', e.target.value)}
                  placeholder="e.g., 5000"
                  error={errors.accountSize}
                />

                <Input
                  label="Risk Per Trade (%)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={inputs.riskPercent}
                  onChange={(e) => handleInputChange('riskPercent', e.target.value)}
                  placeholder="e.g., 1"
                  error={errors.riskPercent}
                />

                <Input
                  label="Entry Price (USD)"
                  type="number"
                  step="0.00000001"
                  min="0"
                  value={inputs.entryPrice}
                  onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                  placeholder="e.g., 2.50"
                  error={errors.entryPrice}
                />

                <Input
                  label="Stop-Loss Price (USD)"
                  type="number"
                  step="0.00000001"
                  min="0"
                  value={inputs.stopLossPrice}
                  onChange={(e) => handleInputChange('stopLossPrice', e.target.value)}
                  placeholder="e.g., 2.25"
                  error={errors.stopLossPrice}
                  helperText="Stop-loss must be below entry price."
                />

                <Button
                  onClick={handleCalculate}
                  className="w-full"
                >
                  Calculate Position Size
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  Position size based on your risk tolerance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="rounded-lg border border-crypto-border bg-crypto-muted p-4">
                        <div className="text-crypto-muted-foreground">Position Size</div>
                        <div className="mt-1 text-xl font-bold text-crypto-foreground">
                          {formatUnits(result.positionSizeUnits)}
                        </div>
                        <div className="mt-1 text-xs text-crypto-muted-foreground">units of crypto</div>
                      </div>

                      <div className="rounded-lg border border-crypto-border bg-crypto-muted p-4">
                        <div className="text-crypto-muted-foreground">Dollar Amount to Invest</div>
                        <div className="mt-1 text-xl font-bold text-crypto-foreground">
                          {formatCurrency(result.investAmountUsd)}
                        </div>
                      </div>

                      <div className="rounded-lg border border-crypto-border bg-crypto-muted p-4">
                        <div className="text-crypto-muted-foreground">Maximum Loss (stop-loss hit)</div>
                        <div className="mt-1 text-xl font-bold text-crypto-foreground">
                          {formatCurrency(result.maxLossUsd)}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-crypto-muted-foreground">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          Risk Amount: <span className="font-medium text-crypto-foreground">{formatCurrency(result.riskAmountUsd)}</span>
                        </div>
                        <div>
                          Risk Per Unit: <span className="font-medium text-crypto-foreground">{formatCurrency(result.riskPerUnitUsd)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-crypto-muted-foreground border-t border-crypto-border pt-4">
                      Context only. Not financial advice.
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-crypto-muted-foreground">
                    Enter your inputs and calculate to see results.
                    {showErrors && hasErrors && (
                      <div className="mt-3 text-crypto-error-500">
                        Please fix the highlighted fields.
                      </div>
                    )}
                    <div className="mt-4 text-xs text-crypto-muted-foreground">
                      Context only. Not financial advice.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

