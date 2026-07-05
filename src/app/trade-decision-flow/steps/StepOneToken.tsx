'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TooltipIcon } from '@/components/ui/TooltipIcon';
import { Button } from '@/components/ui/Button';
import type { FlowInputs } from '../TradeDecisionFlow';

interface Props {
  inputs: FlowInputs;
  updateInput: (field: keyof FlowInputs, value: string) => void;
  onNext: () => void;
  canProceed: boolean;
}

export function StepOneToken({ inputs, updateInput, onNext, canProceed }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <div>
            <CardTitle>Step 1: Token Overview</CardTitle>
            <CardDescription>
              Enter the token&apos;s current market data
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Input
          label="Token Ticker / Symbol"
          type="text"
          value={inputs.tokenTicker}
          onChange={(e) => updateInput('tokenTicker', e.target.value.toUpperCase())}
          placeholder="e.g. BTC, SOL, PEPE"
          helperText="Used only for labelling your export"
        />

        <Input
          label={
            <span className="inline-flex items-center">
              Token Price (USD)
              <TooltipIcon text="Current market price of the token from your exchange or DEX." />
            </span>
          }
          type="number"
          step="0.00000001"
          min="0"
          value={inputs.tokenPrice}
          onChange={(e) => updateInput('tokenPrice', e.target.value)}
          placeholder="e.g. 0.10"
        />

        <Input
          label={
            <span className="inline-flex items-center">
              24h Volume (USD)
              <TooltipIcon text="Total trading volume over the last 24 hours. Available on DexScreener, CoinGecko, or your exchange." />
            </span>
          }
          type="number"
          step="0.01"
          min="0"
          value={inputs.tokenVolume24h}
          onChange={(e) => updateInput('tokenVolume24h', e.target.value)}
          placeholder="e.g. 100000"
        />

        <Input
          label="Market Cap (USD, optional)"
          type="number"
          step="0.01"
          min="0"
          value={inputs.tokenMarketCap}
          onChange={(e) => updateInput('tokenMarketCap', e.target.value)}
          placeholder="e.g. 1000000"
        />

        <div className="flex justify-end">
          <Button onClick={onNext} disabled={!canProceed}>
            Next: Position Sizing →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
