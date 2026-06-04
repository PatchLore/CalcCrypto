import { PERCENTAGE_BASE, VALIDATION_MAX_DEFAULT, SECONDS_PER_DAY, HOURS_PER_DAY, DAYS_PER_MONTH, DAYS_PER_YEAR, WATTS_TO_KILOWATTS, HASHRATE_TH_TO_HS, DIFFICULTY_SCALE, COMPOUND_PERIODS } from '@/lib/constants';

export function toNumber(value: unknown): number {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? 0 : num;
}

export function percentToDecimal(percent: unknown): number {
  return toNumber(percent) / PERCENTAGE_BASE;
}

function validateInput(value: unknown, name: string, { min = 0, max = VALIDATION_MAX_DEFAULT } = {}): number {
  const num = Number(value);
  if (isNaN(num)) throw new Error(`${name} must be a valid number`);
  if (!isFinite(num)) throw new Error(`${name} must be finite`);
  if (num < min) throw new Error(`${name} must be ≥ ${min}`);
  if (num > max) throw new Error(`${name} exceeds maximum allowed value`);
  return num;
}

function safeDivide(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}

export interface TradeInput {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  feePercent: number;
}

export interface TradeResult {
  buyValue: number;
  sellValue: number;
  buyFee: number;
  sellFee: number;
  totalFees: number;
  grossProfit: number;
  netProfit: number;
  roi: number;
}

export function calculateTrade(input: TradeInput): TradeResult {
  const { buyPrice, sellPrice, quantity, feePercent } = input;
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
  const roi = safeDivide(netProfit, buyValue) * PERCENTAGE_BASE;

  return { buyValue, sellValue, buyFee, sellFee, totalFees, grossProfit, netProfit, roi };
}

export interface DCAInput {
  monthlyInvestment: number;
  months: number;
  avgBuyPrice: number;
  currentPrice: number;
  feePercent: number;
}

export interface DCAResult {
  totalInvestment: number;
  totalFees: number;
  netInvestment: number;
  coins: number;
  currentValue: number;
  profit: number;
  roi: number;
}

export function calculateDCA(input: DCAInput): DCAResult {
  const { monthlyInvestment, months, avgBuyPrice, currentPrice, feePercent } = input;
  const monthlyInvestmentNum = validateInput(monthlyInvestment, 'Monthly Investment');
  const monthsNum = validateInput(months, 'Months');
  const avgBuyPriceNum = validateInput(avgBuyPrice, 'Average Buy Price');
  const currentPriceNum = validateInput(currentPrice, 'Current Price');
  const feePercentNum = validateInput(feePercent, 'Fee Percent', { max: 100 });

  const totalInvestment = monthlyInvestmentNum * monthsNum;
  const feeRate = percentToDecimal(feePercentNum);
  const totalFees = totalInvestment * feeRate;
  const netInvestment = totalInvestment - totalFees;
  const coins = safeDivide(netInvestment, avgBuyPriceNum);
  const currentValue = coins * currentPriceNum;
  const profit = currentValue - totalInvestment;
  const roi = safeDivide(profit, totalInvestment) * PERCENTAGE_BASE;

  return { totalInvestment, totalFees, netInvestment, coins, currentValue, profit, roi };
}

export interface MiningInput {
  hashrate: number;
  powerConsumption: number;
  electricityCost: number;
  poolFeePercent: number;
  difficulty: number;
  price: number;
  blockReward?: number;
  blockTimeSeconds?: number;
}

export interface MiningResult {
  dailyHashrate: number;
  dailyReward: number;
  dailyRevenue: number;
  dailyPoolFee: number;
  dailyElectricityCost: number;
  dailyTotalCosts: number;
  dailyProfit: number;
  monthlyProfit: number;
}

export function calculateMining(input: MiningInput): MiningResult {
  const { hashrate, powerConsumption, electricityCost, poolFeePercent, difficulty, price, blockReward = 3.125, blockTimeSeconds = 600 } = input;

  const hashrateTH = validateInput(hashrate, 'Hashrate');
  const watts = validateInput(powerConsumption, 'Power Consumption');
  const electricityCostNum = validateInput(electricityCost, 'Electricity Cost');
  const poolFee = validateInput(poolFeePercent, 'Pool Fee', { max: 100 });
  const difficultyNum = validateInput(difficulty, 'Difficulty');
  const cryptoPrice = validateInput(price, 'Price');
  const blockRewardNum = validateInput(blockReward, 'Block Reward');
  const blockTimeNum = validateInput(blockTimeSeconds, 'Block Time');

  if (difficultyNum <= 0) {
    const dailyElectricityCost = (watts / WATTS_TO_KILOWATTS) * HOURS_PER_DAY * electricityCostNum;
    return {
      dailyHashrate: hashrateTH,
      dailyReward: 0,
      dailyRevenue: 0,
      dailyPoolFee: 0,
      dailyElectricityCost,
      dailyTotalCosts: dailyElectricityCost,
      dailyProfit: -dailyElectricityCost,
      monthlyProfit: -dailyElectricityCost * DAYS_PER_MONTH,
    };
  }

  const minerHashrateHs = hashrateTH * HASHRATE_TH_TO_HS;
  const networkHashrateHs = safeDivide(difficultyNum * DIFFICULTY_SCALE, blockTimeNum);
  const minerShare = safeDivide(minerHashrateHs, networkHashrateHs);
  const blocksPerDay = safeDivide(SECONDS_PER_DAY, blockTimeNum);
  const dailyCoins = minerShare * blocksPerDay * blockRewardNum;
  const poolFeeRate = poolFee / PERCENTAGE_BASE;
  const dailyRevenueGross = dailyCoins * cryptoPrice;
  const dailyPoolFeeUSD = dailyRevenueGross * poolFeeRate;
  const dailyRevenueUSD = dailyRevenueGross - dailyPoolFeeUSD;
  const dailyElectricityCost = (watts / WATTS_TO_KILOWATTS) * HOURS_PER_DAY * electricityCostNum;
  const dailyTotalCosts = dailyElectricityCost;
  const dailyProfit = dailyRevenueUSD - dailyTotalCosts;
  const monthlyProfit = dailyProfit * DAYS_PER_MONTH;

  return {
    dailyHashrate: hashrateTH,
    dailyReward: dailyCoins,
    dailyRevenue: dailyRevenueUSD,
    dailyPoolFee: dailyPoolFeeUSD,
    dailyElectricityCost,
    dailyTotalCosts,
    dailyProfit,
    monthlyProfit,
  };
}

export interface StakingInput {
  amount: number;
  stakingRatePercent: number;
  durationDays: number;
  compoundFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface StakingResult {
  finalAmount: number;
  totalRewards: number;
}

export function calculateStaking(input: StakingInput): StakingResult {
  const { amount, stakingRatePercent, durationDays, compoundFrequency = 'yearly' } = input;
  const amountNum = validateInput(amount, 'Amount');
  const stakingRatePercentNum = validateInput(stakingRatePercent, 'Staking Rate Percent', { max: 1000 });
  const durationDaysNum = validateInput(durationDays, 'Duration Days');

  const periodsPerYear = getCompoundPeriods(compoundFrequency);
  const totalPeriods = periodsPerYear === 0 ? 0 : safeDivide((durationDaysNum / DAYS_PER_YEAR) * periodsPerYear, 1);
  const ratePerPeriod = safeDivide(percentToDecimal(stakingRatePercentNum), periodsPerYear);
  const finalAmount = amountNum * Math.pow(1 + ratePerPeriod, totalPeriods);
  const totalRewards = finalAmount - amountNum;

  return { finalAmount, totalRewards };
}

function getCompoundPeriods(frequency: string): number {
  return COMPOUND_PERIODS[frequency] ?? 1;
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  const oldNum = validateInput(oldValue, 'Old Value');
  const newNum = validateInput(newValue, 'New Value');
  return safeDivide(newNum - oldNum, oldNum) * PERCENTAGE_BASE;
}

export interface CGTInput {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  jurisdiction: 'UK' | 'US' | 'AU' | 'EU';
  isHigherRateTaxpayer?: boolean;
}

export interface CGTResult {
  costBasis: number;
  proceeds: number;
  grossGain: number;
  allowance: number;
  taxableGain: number;
  estimatedTax: number;
  netGain: number;
  effectiveRate: number;
  rate: number;
  rules: {
    allowance: number;
    basicRate: number;
    higherRate: number;
    currency: string;
    label: string;
    taxYear: string;
    note: string;
  };
}

export function calculateCGT(input: CGTInput): CGTResult {
  const { buyPrice, sellPrice, quantity, jurisdiction, isHigherRateTaxpayer = false } = input;
  const buyPriceNum = validateInput(buyPrice, 'Buy Price');
  const sellPriceNum = validateInput(sellPrice, 'Sell Price');
  const quantityNum = validateInput(quantity, 'Quantity');

  const costBasis = buyPriceNum * quantityNum;
  const proceedsNum = sellPriceNum * quantityNum;
  const grossGain = proceedsNum - costBasis;

  const jurisdictionRules: Record<string, { allowance: number; basicRate: number; higherRate: number; currency: string; label: string; taxYear: string; note: string }> = {
    UK: { allowance: 3000, basicRate: 0.18, higherRate: 0.24, currency: 'GBP', label: 'United Kingdom', taxYear: 'Apr 6 – Apr 5', note: 'UK CGT rates for crypto: 18% basic rate, 24% higher rate (2024/25)' },
    US: { allowance: 0, basicRate: 0.15, higherRate: 0.20, currency: 'USD', label: 'United States', taxYear: 'Jan 1 – Dec 31', note: 'Long-term CGT rates (held >1 year). Short-term gains taxed as income.' },
    AU: { allowance: 0, basicRate: 0.235, higherRate: 0.47, currency: 'AUD', label: 'Australia', taxYear: 'Jul 1 – Jun 30', note: 'Australia: 50% CGT discount applies if held >12 months.' },
    EU: { allowance: 0, basicRate: 0.20, higherRate: 0.20, currency: 'EUR', label: 'European Union', taxYear: 'Jan 1 – Dec 31', note: 'EU rates vary by country. This uses a general 20% estimate.' },
  };

  const rules = jurisdictionRules[jurisdiction] || jurisdictionRules['UK'];
  const taxableGain = Math.max(0, grossGain - rules.allowance);
  const rate = isHigherRateTaxpayer ? rules.higherRate : rules.basicRate;
  const estimatedTax = taxableGain > 0 ? taxableGain * rate : 0;
  const netGain = grossGain - estimatedTax;
  const effectiveRate = safeDivide(estimatedTax, grossGain) * PERCENTAGE_BASE;

  return {
    costBasis,
    proceeds: proceedsNum,
    grossGain,
    allowance: rules.allowance,
    taxableGain,
    estimatedTax,
    netGain,
    effectiveRate,
    rate: rate * PERCENTAGE_BASE,
    rules,
  };
}
