import type { LiquidityWarning } from '@/types';

export const WARNING_THRESHOLD = 1;
export const HIGH_RISK_THRESHOLD = 5;
export const EXTREME_RISK_THRESHOLD = 10;

export function getWarnings(ratioPercent: number): LiquidityWarning[] {
  if (ratioPercent >= EXTREME_RISK_THRESHOLD) {
    return [{
      type: 'extreme',
      message: 'This trade represents a very large portion of daily volume. You may experience significant slippage and difficulty exiting the position.',
    }];
  }

  if (ratioPercent >= HIGH_RISK_THRESHOLD) {
    return [{
      type: 'high',
      message: 'This trade represents a significant portion of daily volume. You may experience slippage and difficulty exiting.',
    }];
  }

  if (ratioPercent >= WARNING_THRESHOLD) {
    return [{
      type: 'moderate',
      message: 'This trade is a noticeable portion of daily volume. Consider splitting into smaller orders to reduce slippage.',
    }];
  }

  return [];
}
