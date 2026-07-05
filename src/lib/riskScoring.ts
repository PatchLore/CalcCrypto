export function calculateRiskScore(ratioPercent: number): number {
  if (ratioPercent <= 0) return 100;
  if (ratioPercent < 0.1) return 95;
  if (ratioPercent < 0.5) return 80;
  if (ratioPercent < 1) return 65;
  if (ratioPercent < 5) return 45;
  if (ratioPercent < 10) return 25;
  return Math.max(0, Math.round(20 - (ratioPercent - 10) / 2));
}

export function getRiskLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Poor';
  return 'Dangerous';
}

export function getRiskColor(score: number): {
  text: string;
  bg: string;
  border: string;
} {
  if (score >= 80) {
    return {
      text: 'text-crypto-success-600 dark:text-crypto-success-400',
      bg: 'bg-crypto-success-50 dark:bg-crypto-success-950/30',
      border: 'border-crypto-success-200 dark:border-crypto-success-800',
    };
  }
  if (score >= 60) {
    return {
      text: 'text-crypto-foreground',
      bg: 'bg-crypto-background/40',
      border: 'border-crypto-border/60',
    };
  }
  if (score >= 40) {
    return {
      text: 'text-crypto-warning-600 dark:text-crypto-warning-400',
      bg: 'bg-crypto-warning-50 dark:bg-crypto-warning-950/30',
      border: 'border-crypto-warning-200 dark:border-crypto-warning-800',
    };
  }
  return {
    text: 'text-crypto-error-600 dark:text-crypto-error-400',
    bg: 'bg-crypto-error-50 dark:bg-crypto-error-950/30',
    border: 'border-crypto-error-200 dark:border-crypto-error-800',
  };
}

export function getSlippageColor(slippage: number): string {
  if (slippage < 1) return 'text-crypto-success-600 dark:text-crypto-success-400';
  if (slippage < 3) return 'text-crypto-warning-600 dark:text-crypto-warning-400';
  return 'text-crypto-error-600 dark:text-crypto-error-400';
}
