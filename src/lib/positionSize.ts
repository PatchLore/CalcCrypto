import type { PositionSizeInput, PositionSizeResult } from '@/types';

export interface ValidationError {
  field: keyof PositionSizeInput;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validatePositionSizeInputs(input: PositionSizeInput): ValidationResult {
  const errors: ValidationError[] = [];

  if (isNaN(input.accountSize) || input.accountSize <= 0) {
    errors.push({ field: 'accountSize', message: 'Account size must be greater than 0.' });
  }
  if (isNaN(input.riskPercentage) || input.riskPercentage <= 0) {
    errors.push({ field: 'riskPercentage', message: 'Risk percentage must be greater than 0.' });
  }
  if (input.riskPercentage > 100) {
    errors.push({ field: 'riskPercentage', message: 'Risk percentage cannot exceed 100%.' });
  }
  if (isNaN(input.entryPrice) || input.entryPrice <= 0) {
    errors.push({ field: 'entryPrice', message: 'Entry price must be greater than 0.' });
  }
  if (isNaN(input.stopLossPrice) || input.stopLossPrice <= 0) {
    errors.push({ field: 'stopLossPrice', message: 'Stop loss price must be greater than 0.' });
  }
  if (input.entryPrice > 0 && input.stopLossPrice > 0 && input.entryPrice <= input.stopLossPrice) {
    errors.push({ field: 'stopLossPrice', message: 'Stop loss must be below entry price.' });
  }

  return { valid: errors.length === 0, errors };
}

export function calculatePositionSize(input: PositionSizeInput): PositionSizeResult | null {
  const validation = validatePositionSizeInputs(input);
  if (!validation.valid) return null;

  const riskAmount = input.accountSize * (input.riskPercentage / 100);
  const priceDiff = input.entryPrice - input.stopLossPrice;
  const positionSize = riskAmount / priceDiff;
  const capitalRequired = positionSize * input.entryPrice;
  const stopDistancePercent = (priceDiff / input.entryPrice) * 100;

  return {
    riskAmount,
    positionSize,
    capitalRequired,
    stopDistancePercent,
  };
}

export function parsePositionSizeInputs(raw: Record<keyof PositionSizeInput, string>): PositionSizeInput {
  return {
    accountSize: parseFloat(raw.accountSize) || 0,
    riskPercentage: parseFloat(raw.riskPercentage) || 0,
    entryPrice: parseFloat(raw.entryPrice) || 0,
    stopLossPrice: parseFloat(raw.stopLossPrice) || 0,
  };
}

export function formatTokenAmount(value: number): string {
  if (value < 0.00001) return value.toExponential(4);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
    useGrouping: true,
  }).format(value);
}

export function getAllocationCategory(percent: number): { icon: string; label: string; description?: string } {
  if (percent < 10) return { icon: '✓', label: 'Conservative Allocation' };
  if (percent < 25) return { icon: 'ℹ️', label: 'Moderate Allocation' };
  if (percent < 50) return { icon: '⚠️', label: 'Large Allocation' };
  return { icon: '🚨', label: 'Very Large Allocation', description: 'Even when risk is controlled, large allocations may increase exposure to liquidity and execution risks.' };
}
