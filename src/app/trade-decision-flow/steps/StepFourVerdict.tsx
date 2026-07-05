'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/formulas';
import { getRiskColor, getRiskLabel, getSlippageColor } from '@/lib/riskScoring';
import type { PositionSizeResult, PositionSizeInput, LiquidityWarning } from '@/types';

interface Props {
  tokenTicker: string;
  tokenPrice: number;
  tokenVolume24h: number;
  positionResult: PositionSizeResult | null;
  positionParsed: PositionSizeInput;
  liquidityScore: number;
  liquidityWarnings: LiquidityWarning[];
  slippage: { entrySlippage: number; exitSlippage: number; totalRoundTrip: number } | null;
  marketImpact: { impactPercent: number; ratioPercent: number } | null;
  onBack: () => void;
}

export function StepFourVerdict({ tokenTicker, tokenPrice, tokenVolume24h, positionResult, positionParsed, liquidityScore, liquidityWarnings, slippage, marketImpact, onBack }: Props) {
  const [copied, setCopied] = useState(false);

  const ticker = tokenTicker || 'Token';

  const verdict = useMemo(() => {
    const items: { icon: string; label: string; color: string }[] = [];

    if (positionParsed.riskPercentage > 10) {
      items.push({ icon: '🚨', label: 'Very high risk per trade', color: 'text-crypto-error-600 dark:text-crypto-error-400' });
    } else if (positionParsed.riskPercentage > 5) {
      items.push({ icon: '⚠️', label: 'High risk per trade', color: 'text-crypto-warning-600 dark:text-crypto-warning-400' });
    } else if (positionParsed.riskPercentage > 0) {
      items.push({ icon: '✔', label: 'Risk controlled', color: 'text-crypto-success-600 dark:text-crypto-success-400' });
    }

    if (liquidityScore >= 80) {
      items.push({ icon: '✔', label: 'Excellent liquidity', color: 'text-crypto-success-600 dark:text-crypto-success-400' });
    } else if (liquidityScore >= 60) {
      items.push({ icon: '✔', label: 'Good liquidity', color: 'text-crypto-foreground' });
    } else if (liquidityScore >= 40) {
      items.push({ icon: '⚠️', label: 'Moderate liquidity risk', color: 'text-crypto-warning-600 dark:text-crypto-warning-400' });
    } else if (liquidityScore >= 20) {
      items.push({ icon: '🚨', label: 'Poor liquidity', color: 'text-crypto-warning-600 dark:text-crypto-warning-400' });
    } else if (liquidityScore > 0) {
      items.push({ icon: '🚨', label: 'Dangerous liquidity', color: 'text-crypto-error-600 dark:text-crypto-error-400' });
    }

    if (slippage) {
      if (slippage.totalRoundTrip >= 10) {
        items.push({ icon: '🚨', label: 'High execution cost', color: 'text-crypto-error-600 dark:text-crypto-error-400' });
      } else if (slippage.totalRoundTrip >= 3) {
        items.push({ icon: '⚠️', label: 'Moderate execution cost', color: 'text-crypto-warning-600 dark:text-crypto-warning-400' });
      } else {
        items.push({ icon: '✔', label: 'Low execution cost', color: 'text-crypto-success-600 dark:text-crypto-success-400' });
      }
    }

    return items;
  }, [positionParsed.riskPercentage, liquidityScore, slippage]);

  const finalVerdict = useMemo(() => {
    const parts: string[] = [];

    if (liquidityScore >= 60 && slippage && slippage.totalRoundTrip < 3 && positionParsed.riskPercentage <= 5) {
      parts.push('Trade is viable with controlled risk and good liquidity.');
    } else if (liquidityScore >= 40 && slippage && slippage.totalRoundTrip < 10) {
      parts.push('Trade is viable but expect slippage and reduced exit efficiency.');
    } else if (liquidityScore >= 20) {
      parts.push('Trade carries significant risk. Consider reducing position size or choosing a more liquid token.');
    } else {
      parts.push('This trade is not recommended. Liquidity is too low for safe execution.');
    }

    if (liquidityWarnings.some(w => w.type === 'extreme')) {
      parts.push('The trade size is extremely large relative to daily volume.');
    }

    return parts.join(' ');
  }, [liquidityScore, slippage, positionParsed.riskPercentage, liquidityWarnings]);

  const finalScore = useMemo(() => {
    let riskScore = 0;
    if (positionParsed.riskPercentage > 0 && positionParsed.riskPercentage <= 1) riskScore = 40;
    else if (positionParsed.riskPercentage <= 2) riskScore = 35;
    else if (positionParsed.riskPercentage <= 3) riskScore = 30;
    else if (positionParsed.riskPercentage <= 5) riskScore = 20;
    else if (positionParsed.riskPercentage <= 10) riskScore = 10;
    else riskScore = 0;

    const liquidityComponent = (liquidityScore / 100) * 40;

    let slippageScore = 0;
    const rt = slippage?.totalRoundTrip ?? Infinity;
    if (rt <= 1) slippageScore = 20;
    else if (rt <= 3) slippageScore = 15;
    else if (rt <= 5) slippageScore = 10;
    else if (rt <= 10) slippageScore = 5;
    else slippageScore = 0;

    return Math.min(100, Math.max(0, Math.round(riskScore + liquidityComponent + slippageScore)));
  }, [positionParsed.riskPercentage, liquidityScore, slippage]);

  const finalScoreColor = useMemo(() => {
    if (finalScore >= 80) return 'text-crypto-success-600 dark:text-crypto-success-400';
    if (finalScore >= 60) return 'text-crypto-foreground';
    if (finalScore >= 40) return 'text-crypto-warning-600 dark:text-crypto-warning-400';
    return 'text-crypto-error-600 dark:text-crypto-error-400';
  }, [finalScore]);

  const finalScoreLabel = useMemo(() => {
    if (finalScore >= 80) return 'Recommended';
    if (finalScore >= 60) return 'Acceptable';
    if (finalScore >= 40) return 'Caution';
    return 'Avoid';
  }, [finalScore]);

  const exportText = useMemo(() => {
    const lines: string[] = [];
    lines.push('TRADE PLAN SUMMARY');
    lines.push('');
    lines.push(`Token: ${ticker}`);
    if (tokenPrice > 0) lines.push(`Price: $${tokenPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`);
    if (tokenVolume24h > 0) lines.push(`24h Volume: $${tokenVolume24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    lines.push('');
    if (positionResult) {
      lines.push(`Position Size: ${positionResult.positionSize.toFixed(6)} ${ticker}`);
      lines.push(`Trade Value: $${positionResult.capitalRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      lines.push(`Risk: $${positionResult.riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      lines.push('');
    }
    if (liquidityScore > 0 || slippage) {
      lines.push(`Liquidity Score: ${liquidityScore}/100`);
      if (slippage) lines.push(`Estimated Slippage (Round Trip): ${slippage.totalRoundTrip.toFixed(2)}%`);
      if (marketImpact) lines.push(`Market Impact: ${marketImpact.impactPercent.toFixed(2)}%`);
      lines.push('');
    }
    lines.push(`Final Score: ${finalScore}/100`);
    lines.push('');
    lines.push(`Verdict: ${finalVerdict}`);
    return lines.join('\n');
  }, [ticker, tokenPrice, tokenVolume24h, positionResult, liquidityScore, slippage, marketImpact, finalScore, finalVerdict]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trade-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <div>
            <CardTitle>Step 4: Trade Feasibility Summary</CardTitle>
            <CardDescription>
              Combined assessment of all factors
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Final Score */}
        <div className={`p-6 rounded-xl border-2 text-center ${finalScoreColor.replace('text-', 'border-')}`}>
          <div className="text-sm text-crypto-muted-foreground mb-1">Trade Score</div>
          <div className={`text-5xl sm:text-6xl font-bold ${finalScoreColor}`}>
            {finalScore}
            <span className="text-xl sm:text-2xl font-normal text-crypto-muted-foreground">/100</span>
          </div>
          <div className={`text-base font-semibold mt-2 ${finalScoreColor}`}>{finalScoreLabel}</div>
        </div>

        {/* Assessment items */}
        <div className="space-y-3">
          {verdict.map((v, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border border-crypto-border/60 bg-crypto-background/40 ${v.color}`}>
              <span className="text-lg">{v.icon}</span>
              <span className="text-sm font-medium">{v.label}</span>
            </div>
          ))}
        </div>

        {/* Risk score overview */}
        {positionResult && (
          <div className="rounded-lg border border-crypto-border/60 bg-crypto-muted/20 p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-crypto-muted-foreground">Account</span>
              <span className="font-medium">{formatCurrency(positionParsed.accountSize)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-muted-foreground">Trade Value</span>
              <span className="font-medium">{formatCurrency(positionResult.capitalRequired)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-muted-foreground">Risk Amount</span>
              <span className="font-medium text-crypto-error-600 dark:text-crypto-error-400">{formatCurrency(positionResult.riskAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-muted-foreground">Liquidity Score</span>
              <span className={`font-medium ${getRiskColor(liquidityScore).text}`}>{liquidityScore}/100 — {getRiskLabel(liquidityScore)}</span>
            </div>
            {slippage && (
              <div className="flex justify-between">
                <span className="text-crypto-muted-foreground">Round Trip Cost</span>
                <span className={`font-medium ${getSlippageColor(slippage.totalRoundTrip)}`}>{slippage.totalRoundTrip.toFixed(2)}%</span>
              </div>
            )}
            {marketImpact && (
              <div className="flex justify-between">
                <span className="text-crypto-muted-foreground">Market Impact</span>
                <span className={`font-medium ${getSlippageColor(marketImpact.impactPercent)}`}>{marketImpact.impactPercent.toFixed(2)}%</span>
              </div>
            )}
          </div>
        )}

        {/* Final verdict */}
        <div className="p-4 rounded-lg border border-crypto-border bg-crypto-background/60">
          <h3 className="text-sm font-semibold text-crypto-foreground mb-2">Final Verdict</h3>
          <p className="text-sm text-crypto-muted-foreground leading-relaxed">{finalVerdict}</p>
        </div>

        {/* Export */}
        <div className="rounded-lg border border-crypto-border/60 bg-crypto-muted/20 p-4">
          <h3 className="text-sm font-semibold text-crypto-foreground mb-3">Export Trade Plan</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCopy} variant="outline" size="sm">
              {copied ? '✓ Copied' : 'Copy to Clipboard'}
            </Button>
            <Button onClick={handleDownloadTxt} variant="outline" size="sm">
              Download .txt
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm">
              Print / Save as PDF
            </Button>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            ℹ️ This is a decision support assessment based on the data you entered. Always verify with your exchange and consider market conditions before trading.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
