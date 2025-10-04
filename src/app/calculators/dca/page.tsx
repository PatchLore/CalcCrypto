'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { calculateDCA, formatCurrency, formatPercentage } from '@/lib/formulas';
import type { DCAInput } from '@/types';

export default function DCACalculator() {
  const [inputs, setInputs] = useState<Record<keyof DCAInput, string>>({
    amount: '',
    timeframe: '',
    averagePrice: '',
    fees: '',
    price: '',
  });

  const [result, setResult] = useState<ReturnType<typeof calculateDCA> | null>(null);

  const amount = parseFloat(inputs.amount) || 0;
  const timeframe = parseInt(inputs.timeframe) || 0;
  const averagePrice = parseFloat(inputs.averagePrice) || 0;
  const price = parseFloat(inputs.price) || 0;
  const fees = parseFloat(inputs.fees) || 0;

  const handleInputChange = (field: keyof DCAInput, value: string) => {
    // Store the raw string value to preserve user input like "0", "0.", "0.1"
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    if (amount > 0 && timeframe > 0 && averagePrice > 0 && price > 0) {
      const calculation = calculateDCA({
        amount,
        timeframe,
        averagePrice,
        price,
        fees,
      });
      setResult(calculation);
    }
  };
  
  const isProfit = result && result.result > amount * timeframe;
  const isLoss = result && result.result < amount * timeframe;

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
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-4xl font-bold text-primary mb-4">
              DCA Calculator
            </h2>
            <p className="text-xl text-secondary">
              Calculate your Dollar Cost Averaging strategy results and potential returns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>DCA Parameters</CardTitle>
                <CardDescription>
                  Enter your dollar cost averaging strategy details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Monthly Investment Amount (USD)"
                  type="number"
                  step="0.01"
                  value={inputs.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="Enter monthly investment amount"
                />

                <Input
                  label="Investment Duration (Months)"
                  type="number"
                  step="1"
                  value={inputs.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  placeholder="Enter number of months"
                />

                <Input
                  label="Average Buy Price (USD)"
                  type="number"
                  step="0.00000001"
                  value={inputs.averagePrice}
                  onChange={(e) => handleInputChange('averagePrice', e.target.value)}
                  placeholder="Enter average price per coin"
                />

                <Input
                  label="Current Market Price (USD)"
                  type="number"
                  step="0.00000001"
                  value={inputs.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Enter current market price"
                />

                <Input
                  label="Trading Fees (%)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.fees}
                  onChange={(e) => handleInputChange('fees', e.target.value)}
                  placeholder="Enter trading fees percentage (e.g., 0.1 for 0.1%)"
                  helperText="Total fees for buy transactions"
                />

                <Button 
                  onClick={handleCalculate}
                  className="w-full"
                  disabled={!amount || !timeframe || !averagePrice || !price}
                >
                  Calculate DCA Results
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>DCA Results</CardTitle>
                <CardDescription>
                  Your dollar cost averaging performance
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
                        Current Portfolio Value
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-crypto-foreground">Breakdown</h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-crypto-muted-foreground">Total Invested</div>
                          <div className="font-medium">{formatCurrency(result.breakdown!.principal)}</div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Total Fees</div>
                          <div className="font-medium text-crypto-warning-600 dark:text-crypto-warning-400">
                            {formatCurrency(result.breakdown!.fees)}
                          </div>
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
                          <div className="text-crypto-muted-foreground">Net Portfolio Value</div>
                          <div className={`font-medium ${
                            result.result >= result.breakdown!.principal
                              ? 'text-crypto-success-600 dark:text-crypto-success-400' 
                              : 'text-crypto-error-600 dark:text-crypto-error-400'
                          }`}>
                            {formatCurrency(result.result)}
                          </div>
                        </div>
                      </div>

                      {/* Additional Stats */}
                      <div className="pt-4 border-t border-crypto-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-crypto-muted-foreground">ROI</div>
                            <div className={`font-medium ${
                              result.breakdown!.gains >= 0 
                                ? 'text-crypto-success-600 dark:text-crypto-success-400' 
                                : 'text-crypto-error-600 dark:text-crypto-error-400'
                            }`}>
                              {formatPercentage((result.breakdown!.gains / result.breakdown!.principal) * 100)}
                            </div>
                          </div>
                          <div>
                            <div className="text-crypto-muted-foreground">Coins Acquired</div>
                            <div className="font-medium">
                              {((amount * timeframe - result.breakdown!.fees) / averagePrice).toFixed(8)}
                            </div>
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
                    <div className="text-4xl mb-4">💰</div>
                    <p>Enter your DCA strategy details and click &quot;Calculate&quot; to see your results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>How DCA Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-crypto-muted-foreground">
                <p>
                  Dollar Cost Averaging (DCA) is an investment strategy where you invest a fixed amount 
                  of money at regular intervals, regardless of the asset&apos;s price. This approach helps:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li><strong>Reduce Risk:</strong> Spreads your investment over time to minimize impact of volatility</li>
                  <li><strong>Lower Average Cost:</strong> Buy more when prices are low, less when prices are high</li>
                  <li><strong>Remove Emotion:</strong> Systematic approach eliminates timing decisions</li>
                  <li><strong>Build Discipline:</strong> Consistent investing habit regardless of market conditions</li>
                </ul>
                <p className="mt-4">
                  This calculator shows you the potential results of your DCA strategy, including total 
                  investment, fees paid, and current portfolio value based on current market prices.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
