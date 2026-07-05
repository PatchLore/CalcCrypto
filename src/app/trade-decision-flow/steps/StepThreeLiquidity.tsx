'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getRiskColor, getRiskLabel, getSlippageColor } from '@/lib/riskScoring';
import { formatCurrency } from '@/lib/formulas';
import type { LiquidityWarning } from '@/types';

interface Props {
  tradeSize: number;
  volume24h: number;
  marketImpact: { impactPercent: number; ratioPercent: number } | null;
  slippage: { entrySlippage: number; exitSlippage: number; totalRoundTrip: number } | null;
  liquidityScore: number;
  warnings: LiquidityWarning[];
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function StepThreeLiquidity({ tradeSize, volume24h, marketImpact, slippage, liquidityScore, warnings, onNext, onBack, canProceed }: Props) {
  const riskColor = getRiskColor(liquidityScore);
  const hasData = marketImpact && slippage;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌊</span>
          <div>
            <CardTitle>Step 3: Liquidity Check</CardTitle>
            <CardDescription>
              Assess whether your trade size is realistic for this token
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-crypto-border/60 bg-crypto-muted/20 p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-crypto-muted-foreground">Trade Size (auto)</span>
            <span className="font-medium">{formatCurrency(tradeSize)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-crypto-muted-foreground">24h Volume</span>
            <span className="font-medium">{formatCurrency(volume24h)}</span>
          </div>
        </div>

        {hasData ? (
          <>
            <div className={`p-5 rounded-lg border ${riskColor.bg} ${riskColor.border} text-center`}>
              <div className="text-sm text-crypto-muted-foreground mb-1">Liquidity Score</div>
              <div className={`text-3xl font-bold ${riskColor.text}`}>
                {liquidityScore}
                <span className="text-base font-normal text-crypto-muted-foreground">/100</span>
              </div>
              <div className={`text-sm font-medium mt-1 ${riskColor.text}`}>{getRiskLabel(liquidityScore)}</div>
            </div>

            {warnings.length > 0 && warnings.map(w => (
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

            <div>
              <h3 className="text-sm font-semibold text-crypto-foreground mb-3">Slippage Estimates</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40 text-center">
                  <div className="text-crypto-muted-foreground text-xs">Entry</div>
                  <div className={`font-medium text-lg ${getSlippageColor(slippage.entrySlippage)}`}>
                    {slippage.entrySlippage.toFixed(2)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40 text-center">
                  <div className="text-crypto-muted-foreground text-xs">Exit</div>
                  <div className={`font-medium text-lg ${getSlippageColor(slippage.exitSlippage)}`}>
                    {slippage.exitSlippage.toFixed(2)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40 text-center">
                  <div className="text-crypto-muted-foreground text-xs">Round Trip</div>
                  <div className={`font-medium text-lg ${getSlippageColor(slippage.totalRoundTrip)}`}>
                    {slippage.totalRoundTrip.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-crypto-foreground mb-3">Market Impact</h3>
              <div className="p-4 rounded-lg border border-crypto-border/60 bg-crypto-muted/20 text-center">
                <div className={`text-2xl font-bold ${getSlippageColor(marketImpact.impactPercent)}`}>
                  {marketImpact.impactPercent.toFixed(2)}%
                </div>
                <div className="text-xs text-crypto-muted-foreground mt-1">
                  Trade is {marketImpact.ratioPercent.toFixed(2)}% of 24h volume
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-crypto-muted-foreground text-sm">
            {volume24h <= 0
              ? 'Enter the token\'s 24h volume in Step 1 to enable the liquidity check.'
              : 'Complete Step 2 to auto-populate the trade size.'}
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <Button onClick={onNext} disabled={!canProceed}>
            Next: Trade Verdict →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
