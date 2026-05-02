export function toNumber(value: unknown): number;

export function percentToDecimal(percent: unknown): number;

export function calculateTrade(input: {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  feePercent: number;
}): {
  buyValue: number;
  sellValue: number;
  buyFee: number;
  sellFee: number;
  totalFees: number;
  grossProfit: number;
  netProfit: number;
  roi: number;
};

export function calculateDCA(input: {
  monthlyInvestment: number;
  months: number;
  avgBuyPrice: number;
  currentPrice: number;
  feePercent: number;
}): {
  totalInvestment: number;
  totalFees: number;
  netInvestment: number;
  coins: number;
  currentValue: number;
  profit: number;
  roi: number;
};

export function calculateMining(input: {
  hashrate: number;
  powerConsumption: number;
  electricityCost: number;
  poolFeePercent: number;
  difficulty: number;
  price: number;
  blockReward?: number;
  blockTimeSeconds?: number;
}): {
  dailyHashrate: number;
  dailyReward: number;
  dailyRevenue: number;
  dailyPoolFee: number;
  dailyElectricityCost: number;
  dailyTotalCosts: number;
  dailyProfit: number;
  monthlyProfit: number;
};

export function calculateStaking(input: {
  amount: number;
  stakingRatePercent: number;
  durationDays: number;
  compoundFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}): {
  finalAmount: number;
  totalRewards: number;
};

export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number;

export function calculateCGT(input: {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  jurisdiction: 'UK' | 'US' | 'AU' | 'EU';
  isHigherRateTaxpayer?: boolean;
}): {
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
};