'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { CalculatorCTA } from '../../../components/ui/CalculatorCTA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { calculateCGT } from '../../../lib/calcEngine';
import { formatCurrency, formatPercentage } from '../../../lib/formulas';
import { AFFILIATE_LINKS } from '../../../lib/constants';

type Jurisdiction = 'UK' | 'US' | 'AU' | 'EU';
type TaxRate = 'basic' | 'higher';

const JURISDICTIONS: { value: Jurisdiction; label: string; taxYear: string }[] = [
  { value: 'UK', label: 'United Kingdom', taxYear: 'Apr 6 – Apr 5' },
  { value: 'US', label: 'United States', taxYear: 'Jan 1 – Dec 31' },
  { value: 'AU', label: 'Australia', taxYear: 'Jul 1 – Jun 30' },
  { value: 'EU', label: 'European Union', taxYear: 'Jan 1 – Dec 31' },
];

export function TaxClient() {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('UK');
  const [taxRate, setTaxRate] = useState<TaxRate>('basic');
  const [result, setResult] = useState<ReturnType<typeof calculateCGT> | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setResult(null);
    setError('');
    try {
      const calc = calculateCGT({
        buyPrice: parseFloat(buyPrice),
        sellPrice: parseFloat(sellPrice),
        quantity: parseFloat(quantity),
        jurisdiction,
        isHigherRateTaxpayer: taxRate === 'higher',
      });
      setResult(calc);
    } catch (e) {
      setError('Please check all inputs are valid numbers greater than zero.');
    }
  };

  const isGain = result && result.grossGain > 0;
  const isLoss = result && result.grossGain < 0;

  const selectedJurisdiction = JURISDICTIONS.find(j => j.value === jurisdiction);

  useEffect(() => {
    setResult(null);
    setError('');
  }, [jurisdiction, taxRate]);

  const CURRENCY_SYMBOLS: Record<Jurisdiction, string> = {
    UK: 'GBP',
    US: 'USD',
    AU: 'AUD',
    EU: 'EUR',
  }

  const formatJurisdictionCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: CURRENCY_SYMBOLS[jurisdiction],
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🧾</div>
        <h1 className="text-4xl font-bold text-crypto-foreground mb-4">
          Tax Calculator
        </h1>
        <p className="text-xl text-crypto-muted-foreground">
          Estimate capital gains tax on your crypto disposals.
        </p>
        <p className="text-sm text-crypto-muted-foreground mt-2">
          Educational estimates only, not tax advice, 
          consult a qualified accountant for your situation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Disposal Details</CardTitle>
            <CardDescription>
              Enter your crypto disposal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">

            {/* Jurisdiction selector */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="tax-jurisdiction"
                className="text-sm font-medium text-crypto-foreground"
              >
                Jurisdiction
              </label>
              <select
                id="tax-jurisdiction"
                value={jurisdiction}
                onChange={e => setJurisdiction(e.target.value as Jurisdiction)}
                className="w-full text-base rounded-md border border-crypto-border bg-crypto-background px-3 py-2 text-crypto-foreground [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-900 dark:[&>option]:text-gray-100"
              >
                {JURISDICTIONS.map(j => (
                  <option key={j.value} value={j.value}>
                    {j.label}
                  </option>
                ))}
              </select>
              {selectedJurisdiction && (
                <p className="text-xs text-crypto-muted-foreground">
                  Tax year: {selectedJurisdiction.taxYear}
                </p>
              )}
            </div>

            {/* Tax rate toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-crypto-foreground">
                Tax Rate Band
              </label>
              <div className="flex rounded-md border border-crypto-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTaxRate('basic')}
                  aria-pressed={taxRate === 'basic'}
                  className={`flex-1 py-3 text-sm font-medium transition-colors
                    ${taxRate === 'basic'
                      ? 'bg-blue-600 text-white'
                      : 'bg-transparent text-crypto-foreground hover:bg-crypto-muted/30'
                    }`}
                >
                  Basic Rate
                </button>
                <button
                  type="button"
                  onClick={() => setTaxRate('higher')}
                  aria-pressed={taxRate === 'higher'}
                  className={`flex-1 py-3 text-sm font-medium transition-colors
                    ${taxRate === 'higher'
                      ? 'bg-blue-600 text-white'
                      : 'bg-transparent text-crypto-foreground hover:bg-crypto-muted/30'
                    }`}
                >
                  Higher Rate
                </button>
              </div>
            </div>

            <Input
              label="Buy Price (USD)"
              id="tax-buy-price"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={buyPrice}
              onChange={e => setBuyPrice(e.target.value)}
              placeholder="Price per coin when you bought"
            />

            <Input
              label="Sell Price (USD)"
              id="tax-sell-price"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={sellPrice}
              onChange={e => setSellPrice(e.target.value)}
              placeholder="Price per coin when you sold"
            />

            <Input
              label="Quantity"
              id="tax-quantity"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="Number of coins disposed"
            />

            {error && (
              <p role="alert" className="text-sm text-red-500">{error}</p>
            )}

            <Button
              onClick={handleCalculate}
              className="w-full"
              disabled={!buyPrice || !sellPrice || !quantity}
            >
              Calculate Tax Estimate
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Estimate</CardTitle>
            <CardDescription>
              Educational estimate based on generic tax rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div 
                role="region"
                aria-live="polite"
                aria-label="Tax calculation results"
                className="space-y-5"
              >
                {/* Main result */}
                <div className={`text-center p-5 rounded-lg border ${
                  isGain 
                    ? 'bg-crypto-error-50 dark:bg-crypto-error-950 border-crypto-error-200 dark:border-crypto-error-800'
                    : isLoss
                    ? 'bg-crypto-success-50 dark:bg-crypto-success-950 border-crypto-success-200 dark:border-crypto-success-800'
                    : 'bg-crypto-muted border-crypto-border'
                }`}>
                  <div className="text-sm text-crypto-muted-foreground mb-1">
                    Estimated Tax Liability
                  </div>
                  <div className="text-3xl font-bold text-crypto-foreground">
                    {formatJurisdictionCurrency(result.estimatedTax)}
                  </div>
                  <div className="text-xs text-crypto-muted-foreground mt-2">
                    {result.rules.note}
                  </div>
                </div>

                {/* Primary Limitation Disclaimer - Immediately after result */}
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
                  <p className="text-sm text-amber-700 dark:text-amber-400 text-center">
                    ⚠️ Estimated result only, does not include full UK tax rules (pooling, 30-day matching, classification differences)
                  </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-crypto-foreground">
                    Breakdown
                  </h2>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-crypto-muted-foreground">Cost Basis</div>
                       <div className="font-medium">
                         {formatJurisdictionCurrency(result.costBasis)}
                       </div>
                    </div>
                    <div>
                      <div className="text-crypto-muted-foreground">Proceeds</div>
                       <div className="font-medium">
                         {formatJurisdictionCurrency(result.proceeds)}
                       </div>
                    </div>
                    <div>
                      <div className="text-crypto-muted-foreground">Gross Gain/Loss</div>
                       <div className={`font-medium ${
                         isGain 
                           ? 'text-crypto-error-600 dark:text-crypto-error-400'
                           : 'text-crypto-success-600 dark:text-crypto-success-400'
                       }`}>
                         {formatJurisdictionCurrency(result.grossGain)}
                       </div>
                    </div>
                    <div>
                      <div className="text-crypto-muted-foreground">
                        Annual Allowance
                      </div>
                       <div className="font-medium text-crypto-success-600 dark:text-crypto-success-400">
                         {formatJurisdictionCurrency(result.allowance)}
                       </div>
                    </div>
                    <div>
                      <div className="text-crypto-muted-foreground">Taxable Gain</div>
                       <div className="font-medium">
                         {formatJurisdictionCurrency(result.taxableGain)}
                       </div>
                    </div>
                    <div>
                      <div className="text-crypto-muted-foreground">CGT Rate</div>
                      <div className="font-medium">{result.rate.toFixed(0)}%</div>
                    </div>
                  </div>

                   <div className="pt-3 border-t border-crypto-border">
                     <div className="grid grid-cols-2 gap-3 text-sm">
                       <div>
                         <div className="text-crypto-muted-foreground">Net Gain After Tax</div>
                        <div className="font-medium">
                          {formatJurisdictionCurrency(result.netGain)}
                        </div>
                       </div>
                       <div>
                         <div className="text-crypto-muted-foreground">Effective Rate</div>
                         <div className="font-medium">
                           {result.effectiveRate.toFixed(1)}%
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                  {/* Loss note */}
                {isLoss && (
                  <div className="text-xs text-crypto-muted-foreground 
                                  bg-crypto-muted/30 rounded-md p-3">
                    📉 A capital loss may be offsettable against other gains 
                    in the same tax year. Rules vary by jurisdiction,
                    consult a qualified accountant.
                  </div>
                )}

                {/* Below allowance note */}
                {result.grossGain > 0 && result.taxableGain === 0 && (
                  <div className="text-xs text-crypto-muted-foreground 
                                  bg-crypto-success-50 dark:bg-crypto-success-950 
                                  rounded-md p-3">
                    ✅ Your gain is within the annual CGT allowance,
                    no tax may be due on this disposal alone.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-crypto-muted-foreground">
                <div className="text-4xl mb-4">🧾</div>
                <p className="text-sm">
                  Enter your disposal details and click Calculate 
                  to see your estimated tax liability
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {result && result.estimatedTax > 0 && (
        <CalculatorCTA
          headline="Dreading crypto tax season?"
          body="Let Koinly automatically track your wallets and generate compliant tax reports."
          buttonText="Automate with Koinly"
          href={AFFILIATE_LINKS.koinly}
        />
      )}

      {/* Global Footer Disclaimer */}
      <div className="mt-10 p-4 border border-crypto-border rounded-lg 
                      bg-crypto-muted/20 text-sm text-crypto-muted-foreground text-center">
        This tool provides estimates only and is not financial or tax advice. For accurate reporting, consult a qualified professional.
      </div>
    </div>
  );
}