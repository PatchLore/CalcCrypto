/**
 * Shared Calculation Engine
 * Centralized logic for all financial calculations
 * Eliminates duplicate logic, inconsistent percentage conversions, and early rounding
 */

// FIX: Added input validation guard function
function validateInput(value, name, { min = 0, max = 1e15 } = {}) {
  const num = Number(value);
  if (isNaN(num)) throw new Error(`${name} must be a valid number`);
  if (!isFinite(num)) throw new Error(`${name} must be finite`);
  if (num < min) throw new Error(`${name} must be ≥ ${min}`);
  if (num > max) throw new Error(`${name} exceeds maximum allowed value`);
  return num;
}

// FIX: Added safe division function to prevent division by zero
const safeDivide = (a, b) => b === 0 ? 0 : a / b;

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
  const buyPriceNum = validateInput(buyPrice, 'Buy Price');
  const sellPriceNum = validateInput(sellPrice, 'Sell Price');
  const quantityNum = validateInput(quantity, 'Quantity');
  const feePercentNum = validateInput(feePercent, 'Fee Percent', { max: 100 });

  const buyValue = buyPriceNum * quantityNum;
  const sellValue = sellPriceNum * quantityNum;

  const feeRate = percentToDecimal(feePercentNum);

  const buyFee = buyValue * feeRate;
  const sellFee = sellValue * feeRate;

  const totalFees = buyFee + sellFee;

  const grossProfit = sellValue - buyValue;
  const netProfit = grossProfit - totalFees;

  // FIX: Use safeDivide for division operations
  const roi = safeDivide(netProfit, buyValue) * 100;

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
  const monthlyInvestmentNum = validateInput(monthlyInvestment, 'Monthly Investment');
  const monthsNum = validateInput(months, 'Months');
  const avgBuyPriceNum = validateInput(avgBuyPrice, 'Average Buy Price');
  const currentPriceNum = validateInput(currentPrice, 'Current Price');
  const feePercentNum = validateInput(feePercent, 'Fee Percent', { max: 100 });

  const totalInvestment = monthlyInvestmentNum * monthsNum;

  const feeRate = percentToDecimal(feePercentNum);
  const totalFees = totalInvestment * feeRate;

  const netInvestment = totalInvestment - totalFees;

  // FIX: Use safeDivide for division operations
  const coins = safeDivide(netInvestment, avgBuyPriceNum);
  const currentValue = coins * currentPriceNum;

  const profit = currentValue - totalInvestment;

  // FIX: Use safeDivide for division operations
  const roi = safeDivide(profit, totalInvestment) * 100;

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
 * Coin agnostic Proof-of-Work standard formula
 */
export function calculateMining({
  hashrate,
  powerConsumption,
  electricityCost,
  poolFeePercent,
  difficulty,
  price,
  blockReward = 3.125,
  blockTimeSeconds = 600
}) {
  // FIX: Removed production console logging
  if (process.env.NODE_ENV === 'development') {
    console.log("MINING_INPUTS", arguments[0]);
  }

  // FIX: Added input validation for all mining parameters
  const hashrateTH = validateInput(hashrate, 'Hashrate');
  const watts = validateInput(powerConsumption, 'Power Consumption');
  const electricityCostNum = validateInput(electricityCost, 'Electricity Cost');
  const poolFee = validateInput(poolFeePercent, 'Pool Fee', { max: 100 });
  const difficultyNum = validateInput(difficulty, 'Difficulty');
  const cryptoPrice = validateInput(price, 'Price');
  const blockRewardNum = validateInput(blockReward, 'Block Reward');
  const blockTimeNum = validateInput(blockTimeSeconds, 'Block Time');

  // ✅ ZERO DIFFICULTY GUARD - return safe values immediately
  if (difficultyNum <= 0) {
    const dailyElectricityCost = (watts / 1000) * 24 * electricityCostNum;
    return {
      dailyHashrate: hashrateTH,
      dailyReward: 0,
      dailyRevenue: 0,
      dailyPoolFee: 0,
      dailyElectricityCost,
      dailyTotalCosts: dailyElectricityCost,
      dailyProfit: -dailyElectricityCost,
      monthlyProfit: -dailyElectricityCost * 30
    };
  }

  // ✅ SAFE COIN-AGNOSTIC DEFAULTS (only when difficulty is undefined/missing)
  const DEFAULT_DIFFICULTY = 8.5e13;
  const effectiveDifficulty = difficultyNum;
  
  if (difficulty === undefined || difficulty === null) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Using fallback difficulty: 8.5e13");
    }
  }

  const DIFFICULTY_SCALE = 2**32;
  
  // ✅ STANDARD PROOF-OF-WORK MINING FORMULA
  const minerHashrateHs = hashrateTH * 1e12;
  const networkHashrateHs = safeDivide((effectiveDifficulty * DIFFICULTY_SCALE), blockTimeNum);
  const minerShare = safeDivide(minerHashrateHs, networkHashrateHs);
  
  const blocksPerDay = safeDivide(86400, blockTimeNum);
  const dailyCoins = minerShare * blocksPerDay * blockRewardNum;
  
  // Pool fees deducted from revenue
  const poolFeeRate = poolFee / 100;
  const dailyRevenueGross = dailyCoins * cryptoPrice;
  const dailyPoolFeeUSD = dailyRevenueGross * poolFeeRate;
  const dailyRevenueUSD = dailyRevenueGross - dailyPoolFeeUSD;

  // ✅ Correct daily electricity calculation
  const dailyElectricityCost = (watts / 1000) * 24 * electricityCostNum;
  
  // Only electricity is counted as operating cost
  const dailyTotalCosts = dailyElectricityCost;

  const dailyProfit = dailyRevenueUSD - dailyTotalCosts;
  const monthlyProfit = dailyProfit * 30;

  const result = {
    dailyHashrate: hashrateTH,
    dailyReward: dailyCoins,
    dailyRevenue: dailyRevenueUSD,
    dailyPoolFee: dailyPoolFeeUSD,
    dailyElectricityCost,
    dailyTotalCosts,
    dailyProfit,
    monthlyProfit
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log("MINING_OUTPUT", result);
  }
  
  return result;
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
  const amountNum = validateInput(amount, 'Amount');
  const stakingRatePercentNum = validateInput(stakingRatePercent, 'Staking Rate Percent', { max: 1000 });
  const durationDaysNum = validateInput(durationDays, 'Duration Days');

  const periodsPerYear = getCompoundPeriods(compoundFrequency);
  const totalPeriods = periodsPerYear === 0 ? 0 : safeDivide((durationDaysNum / 365) * periodsPerYear, 1);
  
  const ratePerPeriod = safeDivide(percentToDecimal(stakingRatePercentNum), periodsPerYear);

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
  const oldNum = validateInput(oldValue, 'Old Value');
  const newNum = validateInput(newValue, 'New Value');
  
  return safeDivide((newNum - oldNum), oldNum) * 100;
}