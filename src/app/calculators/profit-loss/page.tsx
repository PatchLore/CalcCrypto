'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { calculateProfitLoss, formatCurrency, formatPercentage } from '@/lib/formulas';
import type { ProfitLossInput } from '@/types';

export default function ProfitLossCalculator() {
  const [inputs, setInputs] = useState<Record<keyof ProfitLossInput, string>>({
    buyPrice: '',
    sellPrice: '',
    quantity: '',
    fees: '',
  });

  const [result, setResult] = useState<ReturnType<typeof calculateProfitLoss> | null>(null);

  const handleInputChange = (field: keyof ProfitLossInput, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    const buyPrice = parseFloat(inputs.buyPrice) || 0;
    const sellPrice = parseFloat(inputs.sellPrice) || 0;
    const quantity = parseFloat(inputs.quantity) || 0;
    const fees = parseFloat(inputs.fees) || 0;

    if (buyPrice > 0 && sellPrice > 0 && quantity > 0) {
      const calculation = calculateProfitLoss({
        buyPrice,
        sellPrice,
        quantity,
        fees,
      });
      setResult(calculation);
    }
  };

  const isProfit = result && result.result > 0;
  const isLoss = result && result.result < 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card mx-4 mt-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl gold-accent rounded-lg p-2">₿</div>
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
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-4xl font-bold text-primary mb-4">
              Profit/Loss Calculator
            </h2>
            <p className="text-xl text-secondary">
              Calculate your cryptocurrency trading profits and losses with precision.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
                <CardDescription>
                  Enter your trading details to calculate profit or loss
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Buy Price (USD)"
                  type="number"
                  step="0.00000001"
                  value={inputs.buyPrice}
                  onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                  placeholder="Enter buy price per coin"
                />

                <Input
                  label="Sell Price (USD)"
                  type="number"
                  step="0.00000001"
                  value={inputs.sellPrice}
                  onChange={(e) => handleInputChange('sellPrice', e.target.value)}
                  placeholder="Enter sell price per coin"
                />

                <Input
                  label="Quantity"
                  type="number"
                  step="0.00000001"
                  value={inputs.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="Enter quantity of coins"
                />

                <Input
                  label="Trading Fees (%)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.fees}
                  onChange={(e) => handleInputChange('fees', e.target.value)}
                  placeholder="Enter trading fees percentage (e.g., 0.1 for 0.1%)"
                  helperText="Total fees for both buy and sell transactions"
                />

                <Button 
                  onClick={handleCalculate}
                  className="w-full"
                  disabled={!inputs.buyPrice || !inputs.sellPrice || !inputs.quantity}
                >
                  Calculate Profit/Loss
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
                <CardDescription>
                  Your trading performance breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Main Result */}
                    <div className={`text-center p-6 rounded-lg ${
                      isProfit 
                        ? 'bg-crypto-success-50 dark:bg-crypto-success-950 border border-crypto-success-200 dark:border-crypto-success-800' 
                        : isLoss 
                        ? 'bg-crypto-error-50 dark:bg-crypto-error-950 border border-crypto-error-200 dark:border-crypto-error-800'
                        : 'bg-crypto-muted border border-crypto-border'
                    }`}>
                      <div className="text-2xl font-bold mb-2">
                        {isProfit ? '📈 Profit' : isLoss ? '📉 Loss' : '➖ Break Even'}
                      </div>
                      <div className={`text-3xl font-bold ${
                        isProfit 
                          ? 'text-crypto-success-600 dark:text-crypto-success-400' 
                          : isLoss 
                          ? 'text-crypto-error-600 dark:text-crypto-error-400'
                          : 'text-crypto-foreground'
                      }`}>
                        {formatCurrency(result.result)}
                      </div>
                      <div className="text-sm text-crypto-muted-foreground mt-2">
                        {formatPercentage((result.result / result.breakdown!.principal) * 100)} ROI
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-crypto-foreground">Breakdown</h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-crypto-muted-foreground">Initial Investment</div>
                          <div className="font-medium">{formatCurrency(result.breakdown!.principal)}</div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Gross Profit/Loss</div>
                          <div className={`font-medium ${
                            result.breakdown!.gains >= 0 
                              ? 'text-crypto-success-600 dark:text-crypto-success-400' 
                              : 'text-crypto-error-600 dark:text-crypto-error-400'
                          }`}>
                            {formatCurrency(result.breakdown!.gains)}
                          </div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Total Fees</div>
                          <div className="font-medium text-crypto-warning-600 dark:text-crypto-warning-400">
                            {formatCurrency(result.breakdown!.fees)}
                          </div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Net Result</div>
                          <div className={`font-medium ${
                            result.result >= 0 
                              ? 'text-crypto-success-600 dark:text-crypto-success-400' 
                              : 'text-crypto-error-600 dark:text-crypto-error-400'
                          }`}>
                            {formatCurrency(result.result)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-4 border-t border-crypto-border">
                      <div className="text-xs text-crypto-muted-foreground">
                        Calculation performed on {result.metadata?.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-crypto-muted-foreground">
                    <div className="text-4xl mb-4">🧮</div>
                    <p>Enter your trading details and click &quot;Calculate&quot; to see your results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-crypto-muted-foreground">
                <p>
                  The Profit/Loss Calculator helps you determine the financial outcome of your cryptocurrency trades. 
                  It takes into account:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li><strong>Buy Price:</strong> The price at which you purchased the cryptocurrency</li>
                  <li><strong>Sell Price:</strong> The price at which you sold (or plan to sell) the cryptocurrency</li>
                  <li><strong>Quantity:</strong> The amount of cryptocurrency you traded</li>
                  <li><strong>Trading Fees:</strong> The percentage fees charged by the exchange for both buy and sell transactions</li>
                </ul>
                <p className="mt-4">
                  The calculator provides a comprehensive breakdown including gross profit/loss, total fees, 
                  and net result, along with the return on investment (ROI) percentage.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


