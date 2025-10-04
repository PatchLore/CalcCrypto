'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { calculateStaking, formatCurrency, formatPercentage } from '@/lib/formulas';
import type { StakingInput } from '@/types';

export default function StakingCalculator() {
  const [inputs, setInputs] = useState<Record<keyof StakingInput, string>>({
    amount: '',
    stakingRate: '',
    duration: '',
    compoundFrequency: 'daily',
  });

  const [result, setResult] = useState<ReturnType<typeof calculateStaking> | null>(null);

  const handleInputChange = (field: keyof StakingInput, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    const amount = parseFloat(inputs.amount) || 0;
    const stakingRate = parseFloat(inputs.stakingRate) || 0;
    const duration = parseInt(inputs.duration) || 0;
    const compoundFrequency = inputs.compoundFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly';

    if (amount > 0 && stakingRate > 0 && duration > 0) {
      const calculation = calculateStaking({
        amount,
        stakingRate,
        duration,
        compoundFrequency,
      });
      setResult(calculation);
    }
  };

  const totalRewards = result ? result.breakdown!.gains : 0;
  const finalAmount = result ? result.result : 0;

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
            <div className="text-6xl mb-4">🏦</div>
            <h2 className="text-4xl font-bold text-crypto-foreground mb-4">
              Staking Calculator
            </h2>
            <p className="text-xl text-crypto-muted-foreground">
              Calculate your staking rewards with compound interest over time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Staking Parameters</CardTitle>
                <CardDescription>
                  Enter your staking details to calculate potential rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Staking Amount (USD)"
                  type="number"
                  step="0.01"
                  value={inputs.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="Enter amount to stake"
                />

                <Input
                  label="Annual Percentage Yield (APY) %"
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.stakingRate}
                  onChange={(e) => handleInputChange('stakingRate', e.target.value)}
                  placeholder="Enter APY percentage (e.g., 5.5 for 5.5%)"
                />

                <Input
                  label="Staking Duration (Days)"
                  type="number"
                  step="1"
                  value={inputs.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Enter staking duration in days"
                />

                <div>
                  <label className="block text-sm font-medium text-crypto-foreground mb-2">
                    Compound Frequency
                  </label>
                  <select
                    value={inputs.compoundFrequency}
                    onChange={(e) => handleInputChange('compoundFrequency', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-crypto-border rounded-md bg-crypto-background text-crypto-foreground focus:outline-none focus:ring-2 focus:ring-crypto-ring"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <p className="mt-1 text-sm text-crypto-muted-foreground">
                    How often rewards are compounded
                  </p>
                </div>

                <Button 
                  onClick={handleCalculate}
                  className="w-full"
                  disabled={!inputs.amount || !inputs.stakingRate || !inputs.duration}
                >
                  Calculate Staking Rewards
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Staking Results</CardTitle>
                <CardDescription>
                  Your potential staking rewards breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Main Result */}
                    <div className="text-center p-6 rounded-lg bg-crypto-success-50 dark:bg-crypto-success-950 border border-crypto-success-200 dark:border-crypto-success-800">
                      <div className="text-2xl font-bold mb-2">🏦 Total Rewards</div>
                      <div className="text-3xl font-bold text-crypto-success-600 dark:text-crypto-success-400">
                        {formatCurrency(totalRewards)}
                      </div>
                      <div className="text-sm text-crypto-muted-foreground mt-2">
                        Earned over {parseFloat(inputs.duration)} days
                      </div>
                    </div>

                    {/* Final Amount */}
                    <div className="text-center p-4 rounded-lg bg-crypto-primary-50 dark:bg-crypto-primary-950 border border-crypto-primary-200 dark:border-crypto-primary-800">
                      <div className="text-lg font-semibold mb-1">Final Amount</div>
                      <div className="text-2xl font-bold text-crypto-primary-600 dark:text-crypto-primary-400">
                        {formatCurrency(finalAmount)}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-crypto-foreground">Breakdown</h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-crypto-muted-foreground">Initial Stake</div>
                          <div className="font-medium">{formatCurrency(result.breakdown!.principal)}</div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Total Rewards</div>
                          <div className="font-medium text-crypto-success-600 dark:text-crypto-success-400">
                            {formatCurrency(result.breakdown!.gains)}
                          </div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Final Amount</div>
                          <div className="font-medium text-crypto-primary-600 dark:text-crypto-primary-400">
                            {formatCurrency(result.result)}
                          </div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Effective APY</div>
                          <div className="font-medium text-crypto-ethereum-600 dark:text-crypto-ethereum-400">
                             {formatPercentage((totalRewards / parseFloat(inputs.amount)) * (365 / parseFloat(inputs.duration)) * 100)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="pt-4 border-t border-crypto-border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-crypto-muted-foreground">Daily Rewards</div>
                          <div className="font-medium">
                            {formatCurrency(totalRewards / parseFloat(inputs.duration))}
                          </div>
                        </div>
                        <div>
                          <div className="text-crypto-muted-foreground">Compound Frequency</div>
                          <div className="font-medium capitalize">
                            {inputs.compoundFrequency}
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
                    <div className="text-4xl mb-4">🏦</div>
                    <p>Enter your staking details and click &quot;Calculate&quot; to see your potential rewards</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>How Staking Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-crypto-muted-foreground">
                <p>
                  Staking is the process of holding cryptocurrency in a wallet to support the operations 
                  of a blockchain network. In return, you earn rewards. Key factors include:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li><strong>APY (Annual Percentage Yield):</strong> The annual rate of return on your staked amount</li>
                  <li><strong>Compound Frequency:</strong> How often rewards are added to your principal and start earning</li>
                  <li><strong>Duration:</strong> How long you plan to stake your tokens</li>
                  <li><strong>Lock-up Periods:</strong> Some staking requires tokens to be locked for a specific period</li>
                </ul>
                <p className="mt-4">
                  This calculator shows the power of compound interest in staking. The more frequently 
                  rewards compound, the higher your total returns will be over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
