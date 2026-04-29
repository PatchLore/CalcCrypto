import type { 
  ProfitLossInput, 
  DCAInput, 
  StakingInput, 
  MiningInput,
  CalculatorResult 
} from '@/types';

import {
  calculateTrade,
  calculateDCA as engineCalculateDCA,
  calculateMining as engineCalculateMining,
  calculateStaking as engineCalculateStaking
} from './calcEngine';

/**
 * Calculate profit/loss for crypto trading
 * Uses shared calculation engine
 */
export function calculateProfitLoss(input: ProfitLossInput): CalculatorResult {
  const { buyPrice, sellPrice, quantity, fees = 0 } = input;
  
  const trade = calculateTrade({
    buyPrice,
    sellPrice,
    quantity,
    feePercent: fees
  });
  
  return {
    result: trade.netProfit,
    breakdown: {
      principal: trade.buyValue,
      gains: trade.grossProfit,
      fees: trade.totalFees,
      net: trade.netProfit,
    },
    metadata: {
      calculationType: 'profit-loss',
      timestamp: new Date(),
      inputs: input as unknown as Record<string, unknown>,
    },
  };
}

/**
 * Calculate Dollar Cost Averaging (DCA) results
 * Uses shared calculation engine
 */
export function calculateDCA(input: DCAInput): CalculatorResult {
  const { amount, timeframe = 0, averagePrice, price, fees = 0 } = input;
  
  const dca = engineCalculateDCA({
    monthlyInvestment: amount,
    months: timeframe,
    avgBuyPrice: averagePrice,
    currentPrice: price,
    feePercent: fees
  });
  
  return {
    result: dca.currentValue,
    breakdown: {
      principal: dca.totalInvestment,
      gains: dca.profit,
      fees: dca.totalFees,
      net: dca.currentValue,
    },
    metadata: {
      calculationType: 'dca',
      timestamp: new Date(),
      inputs: input as unknown as Record<string, unknown>,
    },
  };
}

/**
 * Calculate staking rewards with compound interest
 * Uses shared calculation engine
 */
export function calculateStaking(input: StakingInput): CalculatorResult {
  const { amount, stakingRate, duration, compoundFrequency } = input;
  
  const staking = engineCalculateStaking({
    amount,
    stakingRatePercent: stakingRate,
    durationDays: duration,
    compoundFrequency
  });
  
  return {
    result: staking.finalAmount,
    breakdown: {
      principal: amount,
      gains: staking.totalRewards,
      fees: 0,
      net: staking.finalAmount,
    },
    metadata: {
      calculationType: 'staking',
      timestamp: new Date(),
      inputs: input as unknown as Record<string, unknown>,
    },
  };
}

/**
 * Calculate mining profitability
 * Uses shared calculation engine
 */
export function calculateMining(input: MiningInput): CalculatorResult {
  const { 
    hashrate, 
    powerConsumption, 
    electricityCost, 
    poolFee, 
    difficulty,
    price 
  } = input;
  
  // Convert default difficulty 1 → actual Bitcoin difficulty (user never sets this field)
  const effectiveDifficulty = difficulty <= 1 ? 8.5e13 : difficulty;
  
  const mining = engineCalculateMining({
    hashrate,
    powerConsumption,
    electricityCost,
    poolFeePercent: poolFee,
    difficulty: effectiveDifficulty,
    price
  });
  
  return {
    result: mining.monthlyProfit,
    breakdown: {
      principal: 0,
      gains: mining.dailyRevenue * 30,
      fees: mining.dailyTotalCosts * 30,
      net: mining.monthlyProfit,
      poolFee: mining.dailyPoolFee,
      electricityCost: mining.dailyElectricityCost
    },
    metadata: {
      calculationType: 'mining',
      timestamp: new Date(),
      inputs: input as unknown as Record<string, unknown>,
    },
  };
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format currency values
 */
export function formatCurrency(
  value: number, 
  currency: string = 'USD', 
  decimals: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(value: number, decimals: number = 1): string {
  const absValue = Math.abs(value);
  
  if (absValue >= 1e9) {
    return (value / 1e9).toFixed(decimals) + 'B';
  } else if (absValue >= 1e6) {
    return (value / 1e6).toFixed(decimals) + 'M';
  } else if (absValue >= 1e3) {
    return (value / 1e3).toFixed(decimals) + 'K';
  }
  
  return value.toFixed(decimals);
}



