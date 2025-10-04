'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { calculateMining, formatCurrency, formatLargeNumber } from '@/lib/formulas';
import type { MiningInput } from '@/types';

export default function MiningCalculator() {
  const [inputs, setInputs] = useState<Record<keyof MiningInput, string>>({
    hashrate: '',
    powerConsumption: '',
    electricityCost: '',
    poolFee: '',
    difficulty: '1',
    price: '',
  });

  const [result, setResult] = useState<ReturnType<typeof calculateMining> | null>(null);

  const handleInputChange = (field: keyof MiningInput, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    const hashrate = parseFloat(inputs.hashrate) || 0;
    const powerConsumption = parseFloat(inputs.powerConsumption) || 0;
    const electricityCost = parseFloat(inputs.electricityCost) || 0;
    const poolFee = parseFloat(inputs.poolFee) || 0;
    const difficulty = parseFloat(inputs.difficulty) || 1;
    const price = parseFloat(inputs.price) || 0;

    if (hashrate > 0 && powerConsumption > 0 && electricityCost > 0 && price > 0) {
      const calculation = calculateMining({
        hashrate,
        powerConsumption,
        electricityCost,
        poolFee,
        difficulty,
        price,
      });
      setResult(calculation);
    }
  };

  const dailyProfit = result ? result.result / 30 : 0;
  const monthlyProfit = result ? result.result : 0;
  const isProfitable = dailyProfit > 0;

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
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">⛏️</div>
            <h2 className="text-4xl font-bold text-crypto-foreground mb-4">
              Mining Calculator
            </h2>
            <p className="text-xl text-crypto-muted-foreground">
              Calculate cryptocurrency mining profitability and break-even analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Mining Parameters</CardTitle>
                <CardDescription>
                  Enter your mining hardware and operational costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Hashrate (TH/s)"
                  type="number"
                  step="0.1"
                  value={inputs.hashrate}
                  onChange={(e) => handleInputChange('hashrate', e.target.value)}
                  placeholder="Enter hashrate in TH/s"
                />

                <Input
                  label="Power Consumption (Watts)"
                  type="number"
                  step="1"
                  value={inputs.powerConsumption}
                  onChange={(e) => handleInputChange('powerConsumption', e.target.value)}
                  placeholder="Enter power consumption"
                />

                <Input
                  label="Electricity Cost ($/kWh)"
                  type="number"
                  step="0.001"
                  min="0"
                  value={inputs.electricityCost}
                  onChange={(e) => handleInputChange('electricityCost', e.target.value)}
                  placeholder="Enter electricity cost per kWh (e.g., 0.12 for $0.12/kWh)"
                />

                <Input
                  label="Pool Fee (%)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.poolFee}
                  onChange={(e) => handleInputChange('poolFee', e.target.value)}
                  placeholder="Enter mining pool fee percentage (e.g., 1.5 for 1.5%)"
                />

                <Input
                  label="Cryptocurrency Price (USD)"
                  type="number"
                  step="0.01"
                  value={inputs.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Enter current crypto price"
                />

                <Button 
                  onClick={handleCalculate}
                  className="w-full"
                  disabled={!inputs.hashrate || !inputs.powerConsumption || !inputs.electricityCost || !inputs.price}
                >
                  Calculate Mining Profitability
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Mining Results</CardTitle>
                <CardDescription>
                  Your mining profitability analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Main Result */}
                    <div className={`text-center p-6 rounded-lg ${
                      isProfitable 
                        ? 'bg-crypto-success-50 dark:bg-crypto-success-950 border border-crypto-success-200 dark:border-crypto-success-800' 
                        : 'bg-crypto-error-50 dark:bg-crypto-error-950 border border-crypto-error-200 dark:border-crypto-error-800'
                    }`}>
                      <div className="text-2xl font-bold mb-2">
                        {isProfitable ? '⛏️ Profitable' : '❌ Not Profitable'}
                      </div>
                      <div className={`text-3xl font-bold ${
                        isProfitable 
                          ? 'text-crypto-success-600 dark:text-crypto-success-400' 
                          : 'text-crypto-error-600 dark:text-crypto-error-400'
                      }`}>
                        {formatCurrency(monthlyProfit)}
                      </div>
                      <div className="text-sm text-crypto-muted-foreground mt-2">
                        Monthly Profit/Loss
                      </div>
                    </div>

                    {/* Daily Profit */}
                    <div className="text-center p-4 rounded-lg bg-crypto-primary-50 dark:bg-crypto-primary-950 border border-crypto-primary-200 dark:border-crypto-primary-800">
                      <div className="text-lg font-semibold mb-1">Daily Profit</div>
                      <div className={`text-2xl font-bold ${
                        dailyProfit >= 0 
                          ? 'text-crypto-success-600 dark:text-crypto-success-400' 
                          : 'text-crypto-error-600 dark:text-crypto-error-400'
                      }`}>
                        {formatCurrency(dailyProfit)}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-crypto-foreground">Breakdown</h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-crypto-muted-foreground">Daily Revenue</div>
                          <div className="font-medium text-crypto-success-600 dark:text-crypto-success-400">
                            {formatCurrency(result.breakdown!.gains / 30)}
                          </div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Daily Costs</div>
                          <div className="font-medium text-crypto-error-600 dark:text-crypto-error-400">
                            {formatCurrency(result.breakdown!.fees / 30)}
                          </div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Pool Fees</div>
                          <div className="font-medium text-crypto-warning-600 dark:text-crypto-warning-400">
                            {formatCurrency((result.breakdown!.gains * parseFloat(inputs.poolFee) / 100) / 30)}
                          </div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Electricity Cost</div>
                          <div className="font-medium text-crypto-warning-600 dark:text-crypto-warning-400">
                            {formatCurrency((parseFloat(inputs.powerConsumption) / 1000) * 24 * parseFloat(inputs.electricityCost))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="pt-4 border-t border-crypto-border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-crypto-muted-foreground">Hashrate</div>
                          <div className="font-medium">
                            {formatLargeNumber(parseFloat(inputs.hashrate))} TH/s
                          </div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Power Efficiency</div>
                          <div className="font-medium">
                            {(parseFloat(inputs.powerConsumption) / parseFloat(inputs.hashrate)).toFixed(2)} W/TH
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
                    <div className="text-4xl mb-4">⛏️</div>
                    <p>Enter your mining parameters and click &quot;Calculate&quot; to see profitability analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Mining Considerations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-crypto-muted-foreground">
                <p>
                  Cryptocurrency mining profitability depends on several factors. This calculator provides 
                  an estimate based on current conditions:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li><strong>Hashrate:</strong> Your mining hardware&apos;s computational power</li>
                  <li><strong>Power Consumption:</strong> Electricity usage of your mining equipment</li>
                  <li><strong>Electricity Cost:</strong> Your local electricity rate per kWh</li>
                  <li><strong>Pool Fees:</strong> Fees charged by the mining pool</li>
                  <li><strong>Network Difficulty:</strong> Current mining difficulty (affects rewards)</li>
                </ul>
                <p className="mt-4">
                  <strong>Note:</strong> This is a simplified calculation. Real mining involves network 
                  difficulty changes, hardware depreciation, and other variable costs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
