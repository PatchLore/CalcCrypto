import type { 
  ProfitLossInput, 
  DCAInput, 
  StakingInput, 
  MiningInput,
  CalculatorResult 
} from '@/types';

/**
 * Calculate profit/loss for crypto trading
 */
export function calculateProfitLoss(input: ProfitLossInput): CalculatorResult {
  const { buyPrice, sellPrice, quantity, fees = 0 } = input;
  
  const buyTotal = buyPrice * quantity;
  const sellTotal = sellPrice * quantity;
  const totalFees = fees * 2; // Buy and sell fees
  
  const grossProfit = sellTotal - buyTotal;
  const netProfit = grossProfit - totalFees;
  
  return {
    result: netProfit,
    breakdown: {
      principal: buyTotal,
      gains: grossProfit,
      fees: totalFees,
      net: netProfit,
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
 */
export function calculateDCA(input: DCAInput): CalculatorResult {
  const { amount, timeframe = 0, averagePrice, fees = 0 } = input;
  
  const totalInvested = amount * timeframe;
  const totalFees = fees * timeframe;
  const totalCoins = (totalInvested - totalFees) / averagePrice;
  const currentValue = totalCoins * input.price; // Current market price
  
  const profit = currentValue - totalInvested;
  
  return {
    result: currentValue,
    breakdown: {
      principal: totalInvested,
      gains: profit,
      fees: totalFees,
      net: currentValue,
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
 */
export function calculateStaking(input: StakingInput): CalculatorResult {
  const { amount, stakingRate, duration, compoundFrequency } = input;
  
  const periodsPerYear = getCompoundPeriods(compoundFrequency);
  const totalPeriods = (duration / 365) * periodsPerYear;
  const ratePerPeriod = stakingRate / periodsPerYear / 100;
  
  const finalAmount = amount * Math.pow(1 + ratePerPeriod, totalPeriods);
  const totalRewards = finalAmount - amount;
  
  return {
    result: finalAmount,
    breakdown: {
      principal: amount,
      gains: totalRewards,
      fees: 0,
      net: finalAmount,
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
  
  // Simplified mining calculation
  const dailyHashrate = hashrate * 24 * 3600; // TH/day
  const dailyReward = (dailyHashrate / difficulty) * 6.25; // Assuming Bitcoin block reward
  const dailyRevenue = dailyReward * price;
  const dailyPoolFee = dailyRevenue * (poolFee / 100);
  const dailyElectricityCost = (powerConsumption / 1000) * 24 * electricityCost;
  
  const dailyProfit = dailyRevenue - dailyPoolFee - dailyElectricityCost;
  const monthlyProfit = dailyProfit * 30;
  
  return {
    result: monthlyProfit,
    breakdown: {
      principal: 0,
      gains: dailyRevenue,
      fees: dailyPoolFee + dailyElectricityCost,
      net: dailyProfit,
    },
    metadata: {
      calculationType: 'mining',
      timestamp: new Date(),
      inputs: input as unknown as Record<string, unknown>,
    },
  };
}

/**
 * Helper function to get compound periods per year
 */
function getCompoundPeriods(frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'): number {
  switch (frequency) {
    case 'daily': return 365;
    case 'weekly': return 52;
    case 'monthly': return 12;
    case 'yearly': return 1;
    default: return 1;
  }
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



