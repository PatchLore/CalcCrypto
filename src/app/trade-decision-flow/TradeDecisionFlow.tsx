'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { StepOneToken } from './steps/StepOneToken';
import { StepTwoPosition } from './steps/StepTwoPosition';
import { StepThreeLiquidity } from './steps/StepThreeLiquidity';
import { StepFourVerdict } from './steps/StepFourVerdict';
import { calculatePositionSize, parsePositionSizeInputs } from '@/lib/positionSize';
import { calculateMarketImpact, calculateSlippage } from '@/lib/liquidityCalculations';
import { calculateRiskScore } from '@/lib/riskScoring';
import { getWarnings } from '@/lib/warnings';
import { trackEvent } from '@/lib/analytics';
import { useEffect } from 'react';
import type { PositionSizeInput, LiquidityImpactInput } from '@/types';

export interface FlowInputs {
  tokenTicker: string;
  tokenPrice: string;
  tokenVolume24h: string;
  tokenMarketCap: string;
  accountSize: string;
  riskPercentage: string;
  entryPrice: string;
  stopLossPrice: string;
}

type Step = 1 | 2 | 3 | 4;

const STEPS: { step: Step; label: string; icon: string }[] = [
  { step: 1, label: 'Token', icon: '📊' },
  { step: 2, label: 'Sizing', icon: '🎯' },
  { step: 3, label: 'Liquidity', icon: '🌊' },
  { step: 4, label: 'Verdict', icon: '✅' },
];

export function TradeDecisionFlow() {
  const [step, setStep] = useState<Step>(1);
  const [inputs, setInputs] = useState<FlowInputs>({
    tokenTicker: '',
    tokenPrice: '',
    tokenVolume24h: '',
    tokenMarketCap: '',
    accountSize: '',
    riskPercentage: '',
    entryPrice: '',
    stopLossPrice: '',
  });

  const updateInput = (field: keyof FlowInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => { trackEvent('calculator_loaded', 'TradeDecision', 'trade-decision-flow'); }, []);

  const positionParsed = useMemo<PositionSizeInput>(() => parsePositionSizeInputs({
    accountSize: inputs.accountSize,
    riskPercentage: inputs.riskPercentage,
    entryPrice: inputs.entryPrice,
    stopLossPrice: inputs.stopLossPrice,
  } as Record<keyof PositionSizeInput, string>), [inputs.accountSize, inputs.riskPercentage, inputs.entryPrice, inputs.stopLossPrice]);

  const positionResult = useMemo(() => calculatePositionSize(positionParsed), [positionParsed]);

  const liquidityInput = useMemo<LiquidityImpactInput>(() => ({
    tradeSize: (positionResult?.capitalRequired ?? parseFloat(inputs.tokenPrice)) || 0,
    volume24h: parseFloat(inputs.tokenVolume24h) || 0,
    marketCap: parseFloat(inputs.tokenMarketCap) || undefined,
  }), [positionResult, inputs.tokenPrice, inputs.tokenVolume24h, inputs.tokenMarketCap]);

  const marketImpact = useMemo(() => calculateMarketImpact(liquidityInput), [liquidityInput]);
  const slippage = useMemo(() => marketImpact ? calculateSlippage(marketImpact.impactPercent) : null, [marketImpact]);
  const liquidityScore = useMemo(() => marketImpact ? calculateRiskScore(marketImpact.ratioPercent) : 0, [marketImpact]);
  const liquidityWarnings = useMemo(() => marketImpact ? getWarnings(marketImpact.ratioPercent) : [], [marketImpact]);

  const canProceed = (s: Step): boolean => {
    switch (s) {
      case 1: return inputs.tokenPrice !== '' && inputs.tokenVolume24h !== '';
      case 2: return positionResult !== null;
      case 3: return marketImpact !== null;
      default: return true;
    }
  };

  const goNext = () => { if (step < 4 && canProceed(step)) { trackEvent('step_advance', 'TradeDecision', `step_${step}_to_${step + 1}`); setStep((step + 1) as Step); } };
  const goBack = () => { if (step > 1) setStep((step - 1) as Step); };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="text-5xl mb-3">🧭</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
              Trade Decision Flow
            </h1>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              A step-by-step guide to evaluate whether a trade is worth taking — combining position sizing, liquidity analysis, and risk context.
            </p>
          </div>

          {/* Step Progress Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => s.step < step && setStep(s.step)}
                  disabled={s.step >= step}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === s.step
                      ? 'bg-primary text-primary-foreground'
                      : step > s.step
                      ? 'bg-crypto-success-100 dark:bg-crypto-success-900/40 text-crypto-success-700 dark:text-crypto-success-300 cursor-pointer'
                      : 'bg-crypto-muted/40 text-crypto-muted-foreground cursor-default'
                  }`}
                  aria-current={step === s.step ? 'step' : undefined}
                >
                  <span>{s.icon}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-4 sm:w-8 ${step > s.step ? 'bg-crypto-success-400' : 'bg-crypto-border/40'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main content area */}
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && (
                <StepOneToken
                  inputs={inputs}
                  updateInput={updateInput}
                  onNext={goNext}
                  canProceed={canProceed(1)}
                />
              )}
              {step === 2 && (
                <StepTwoPosition
                  inputs={inputs}
                  updateInput={updateInput}
                  result={positionResult}
                  onNext={goNext}
                  onBack={goBack}
                  canProceed={canProceed(2)}
                />
              )}
              {step === 3 && (
                <StepThreeLiquidity
                  tradeSize={(positionResult?.capitalRequired ?? parseFloat(inputs.tokenPrice)) || 0}
                  volume24h={parseFloat(inputs.tokenVolume24h) || 0}
                  marketImpact={marketImpact}
                  slippage={slippage}
                  liquidityScore={liquidityScore}
                  warnings={liquidityWarnings}
                  onNext={goNext}
                  onBack={goBack}
                  canProceed={canProceed(3)}
                />
              )}
              {step === 4 && (
                <StepFourVerdict
                  tokenTicker={inputs.tokenTicker}
                  tokenPrice={parseFloat(inputs.tokenPrice) || 0}
                  tokenVolume24h={parseFloat(inputs.tokenVolume24h) || 0}
                  positionResult={positionResult}
                  positionParsed={positionParsed}
                  liquidityScore={liquidityScore}
                  liquidityWarnings={liquidityWarnings}
                  slippage={slippage}
                  marketImpact={marketImpact}
                  onBack={goBack}
                />
              )}
            </div>

            {/* Sticky summary panel */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8 space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-crypto-foreground">Current Summary</h3>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="text-crypto-muted-foreground">Token Price</div>
                        <div className="font-medium">{inputs.tokenPrice ? `$${parseFloat(inputs.tokenPrice).toLocaleString()}` : '—'}</div>
                      </div>
                      <div>
                        <div className="text-crypto-muted-foreground">24h Volume</div>
                        <div className="font-medium">{inputs.tokenVolume24h ? `$${parseFloat(inputs.tokenVolume24h).toLocaleString()}` : '—'}</div>
                      </div>
                      {positionResult && (
                        <>
                          <hr className="border-crypto-border/40" />
                          <div>
                            <div className="text-crypto-muted-foreground">Position Size</div>
                            <div className="font-medium">{positionResult.positionSize.toFixed(4)} units</div>
                          </div>
                          <div>
                            <div className="text-crypto-muted-foreground">Trade Value</div>
                            <div className="font-medium">${positionResult.capitalRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          </div>
                          <div>
                            <div className="text-crypto-muted-foreground">Risk Amount</div>
                            <div className="font-medium">${positionResult.riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          </div>
                        </>
                      )}
                      {liquidityScore > 0 && (
                        <>
                          <hr className="border-crypto-border/40" />
                          <div>
                            <div className="text-crypto-muted-foreground">Liquidity Score</div>
                            <div className="font-medium">{liquidityScore}/100</div>
                          </div>
                          {slippage && (
                            <div>
                              <div className="text-crypto-muted-foreground">Round Trip Cost</div>
                              <div className="font-medium">{slippage.totalRoundTrip.toFixed(2)}%</div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="p-3 rounded-lg border border-crypto-border/60 bg-crypto-muted/20 text-xs text-crypto-muted-foreground leading-relaxed">
                  This is a decision support tool. Always verify with your exchange and consider market conditions before trading.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
