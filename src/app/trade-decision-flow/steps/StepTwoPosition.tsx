'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TooltipIcon } from '@/components/ui/TooltipIcon';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/formulas';
import { calculatePositionSize, parsePositionSizeInputs } from '@/lib/positionSize';
import type { PositionSizeInput, PositionSizeResult } from '@/types';
import type { FlowInputs } from '../TradeDecisionFlow';

const RISK_PRESETS = [0.5, 1, 2, 3, 5];

interface Props {
  inputs: FlowInputs;
  updateInput: (field: keyof FlowInputs, value: string) => void;
  result: PositionSizeResult | null;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function StepTwoPosition({ inputs, updateInput, result, onNext, onBack, canProceed }: Props) {
  const parsed = useMemo(() => parsePositionSizeInputs({
    accountSize: inputs.accountSize,
    riskPercentage: inputs.riskPercentage,
    entryPrice: inputs.entryPrice,
    stopLossPrice: inputs.stopLossPrice,
  } as Record<keyof PositionSizeInput, string>), [inputs.accountSize, inputs.riskPercentage, inputs.entryPrice, inputs.stopLossPrice]);

  const entryStopError = parsed.entryPrice > 0 && parsed.stopLossPrice > 0 && parsed.entryPrice <= parsed.stopLossPrice;

  const selectedPreset = parsed.riskPercentage > 0
    ? RISK_PRESETS.find(p => Math.abs(p - parsed.riskPercentage) < 0.01) ?? null
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <div>
            <CardTitle>Step 2: Position Sizing</CardTitle>
            <CardDescription>
              Define your trade size based on risk management
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Input
          label="Account Size (USD)"
          type="number"
          step="0.01"
          min="0"
          value={inputs.accountSize}
          onChange={(e) => updateInput('accountSize', e.target.value)}
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
                onClick={() => updateInput('riskPercentage', String(value))}
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
          onChange={(e) => updateInput('riskPercentage', e.target.value)}
          placeholder="e.g. 1"
        />

        <Input
          label="Entry Price (USD)"
          type="number"
          step="0.00000001"
          min="0"
          value={inputs.entryPrice}
          onChange={(e) => updateInput('entryPrice', e.target.value)}
          placeholder="e.g. 50000"
        />

        <Input
          label="Stop Loss Price (USD)"
          type="number"
          step="0.00000001"
          min="0"
          value={inputs.stopLossPrice}
          onChange={(e) => updateInput('stopLossPrice', e.target.value)}
          placeholder="e.g. 45000"
          error={entryStopError ? 'Stop loss must be below entry price' : undefined}
        />

        {result && (
          <div className="rounded-lg border border-crypto-border/60 bg-crypto-muted/20 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-crypto-muted-foreground">Position Size</span>
              <span className="font-medium text-primary">{result.positionSize.toFixed(6)} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-muted-foreground">Trade Value</span>
              <span className="font-medium">{formatCurrency(result.capitalRequired)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-muted-foreground">Risk Amount</span>
              <span className="font-medium text-crypto-error-600 dark:text-crypto-error-400">{formatCurrency(result.riskAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-muted-foreground">Stop Distance</span>
              <span className="font-medium text-crypto-warning-600 dark:text-crypto-warning-400">{result.stopDistancePercent.toFixed(2)}%</span>
            </div>
          </div>
        )}

        {!result && (inputs.accountSize || inputs.riskPercentage || inputs.entryPrice || inputs.stopLossPrice) && (
          <div className="text-sm text-crypto-muted-foreground text-center py-2">
            Fill in all fields above to see your position details.
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <Button onClick={onNext} disabled={!canProceed}>
            Next: Liquidity Check →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
