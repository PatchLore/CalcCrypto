import type { LiquidityImpactInput } from '@/types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function calculateMarketImpact(input: LiquidityImpactInput): {
  impactPercent: number;
  ratioPercent: number;
} | null {
  const { tradeSize, volume24h } = input;

  if (tradeSize <= 0 || volume24h <= 0) return null;

  const ratio = tradeSize / volume24h;
  const ratioPercent = ratio * 100;
  const impactPercent = clamp(ratio * 2 * 100, 0, 100);

  return { impactPercent: round(impactPercent), ratioPercent: round(ratioPercent, 4) };
}

export function calculateSlippage(impactPercent: number): {
  entrySlippage: number;
  exitSlippage: number;
  totalRoundTrip: number;
} {
  const entrySlippage = round(impactPercent * 0.4);
  const exitSlippage = round(impactPercent * 0.6);
  const totalRoundTrip = round(entrySlippage + exitSlippage);

  return { entrySlippage, exitSlippage, totalRoundTrip };
}
