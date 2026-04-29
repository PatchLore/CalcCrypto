/**
 * Shared Calculation Engine
 * Centralized logic for all financial calculations
 * Eliminates duplicate logic, inconsistent percentage conversions, and early rounding
 */

/**
 * Safely convert any value to a number, defaulting to 0 on failure
 */
export function toNumber(value) {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? 0 : num;
}

/**
 * Convert percentage value to decimal (e.g. 0.1% → 0.001)
 * This is the ONLY place where /100 should be used for percentage conversion
 */
export function percentToDecimal(percent) {
  return toNumber(percent) / 100;
}

/**
 * Calculate trade profit/loss including fees
 */
export function calculateTrade({ buyPrice, sellPrice, quantity, feePercent }) {
  const buyPriceNum = toNumber(buyPrice);
  const sellPriceNum = toNumber(sellPrice);
  const quantityNum = toNumber(quantity);
  const feePercentNum = toNumber(feePercent);

  const buyValue = buyPriceNum * quantityNum;
  const sellValue = sellPriceNum * quantityNum;

  const feeRate = percentToDecimal(feePercentNum);

  const buyFee = buyValue * feeRate;
  const sellFee = sellValue * feeRate;

  const totalFees = buyFee + sellFee;

  const grossProfit = sellValue - buyValue;
  const netProfit = grossProfit - totalFees;

  // Guard against division by zero
  const roi = buyValue === 0 ? 0 : (netProfit / buyValue) * 100;

  return {
    buyValue,
    sellValue,
    buyFee,
    sellFee,
    totalFees,
    grossProfit,
    netProfit,
    roi
  };
}

/**
 * Calculate Dollar Cost Averaging (DCA) results
 */
export function calculateDCA({
  monthlyInvestment,
  months,
  avgBuyPrice,
  currentPrice,
  feePercent
}) {
  const monthlyInvestmentNum = toNumber(monthlyInvestment);
  const monthsNum = toNumber(months);
  const avgBuyPriceNum = toNumber(avgBuyPrice);
  const currentPriceNum = toNumber(currentPrice);
  const feePercentNum = toNumber(feePercent);

  const totalInvestment = monthlyInvestmentNum * monthsNum;

  const feeRate = percentToDecimal(feePercentNum);
  const totalFees = totalInvestment * feeRate;

  const netInvestment = totalInvestment - totalFees;

  // Guard against division by zero
  const coins = avgBuyPriceNum === 0 ? 0 : netInvestment / avgBuyPriceNum;
  const currentValue = coins * currentPriceNum;

  const profit = currentValue - totalInvestment;

  // Guard against division by zero
  const roi = totalInvestment === 0 ? 0 : (profit / totalInvestment) * 100;

  return {
    totalInvestment,
    totalFees,
    netInvestment,
    coins,
    currentValue,
    profit,
    roi
  };
}

/**
 * Calculate mining profitability
 */
export function calculateMining({
  hashrate,
  powerConsumption,
  electricityCost,
  poolFeePercent,
  difficulty,
  price
}) {
  const hashrateNum = toNumber(hashrate);
  const powerConsumptionNum = toNumber(powerConsumption);
  const electricityCostNum = toNumber(electricityCost);
  const poolFeePercentNum = toNumber(poolFeePercent);
  const difficultyNum = toNumber(difficulty);
  const priceNum = toNumber(price);

  // Simplified mining calculation
  const dailyHashrate = hashrateNum * 24 * 3600; // TH/day
  const dailyReward = difficultyNum === 0 ? 0 : (dailyHashrate / difficultyNum) * 6.25; // Bitcoin block reward
  const dailyRevenue = dailyReward * priceNum;
  
  const poolFeeRate = percentToDecimal(poolFeePercentNum);
  const dailyPoolFee = dailyRevenue * poolFeeRate;
  
  const dailyElectricityCost = (powerConsumptionNum / 1000) * 24 * electricityCostNum;
  
  const dailyProfit = dailyRevenue - dailyPoolFee - dailyElectricityCost;
  const monthlyProfit = dailyProfit * 30;

  return {
    dailyHashrate,
    dailyReward,
    dailyRevenue,
    dailyPoolFee,
    dailyElectricityCost,
    dailyProfit,
    monthlyProfit
  };
}

/**
 * Calculate staking rewards with compound interest
 */
export function calculateStaking({
  amount,
  stakingRatePercent,
  durationDays,
  compoundFrequency
}) {
  const amountNum = toNumber(amount);
  const stakingRatePercentNum = toNumber(stakingRatePercent);
  const durationDaysNum = toNumber(durationDays);

  const periodsPerYear = getCompoundPeriods(compoundFrequency);
  const totalPeriods = periodsPerYear === 0 ? 0 : (durationDaysNum / 365) * periodsPerYear;
  
  const ratePerPeriod = percentToDecimal(stakingRatePercentNum) / periodsPerYear;

  const finalAmount = amountNum * Math.pow(1 + ratePerPeriod, totalPeriods);
  const totalRewards = finalAmount - amountNum;

  return {
    finalAmount,
    totalRewards
  };
}

/**
 * Helper function to get compound periods per year
 */
function getCompoundPeriods(frequency) {
  switch (frequency) {
    case 'daily': return 365;
    case 'weekly': return 52;
    case 'monthly': return 12;
    case 'yearly': return 1;
    default: return 1;
  }
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue, newValue) {
  const oldNum = toNumber(oldValue);
  const newNum = toNumber(newValue);
  
  if (oldNum === 0) return 0;
  return ((newNum - oldNum) / oldNum) * 100;
}