// Phase 2 Risk Monitoring Types

export interface TokenRiskData {
  liquidity: number; // USD liquidity
  volume24h: number; // 24h volume in USD
  priceChange24h: number; // 24h price change percentage
  priceUsd: number; // Current price in USD
  ageDays: number; // Token age in days
  holderConcentration: number; // Percentage held by top 10 holders (0-100)
  mintAuthorityRenounced: boolean; // Whether mint authority has been renounced
}

export interface RiskScore {
  score: number; // 0-100, higher means riskier
  level: RiskLevel;
  factors: {
    liquidityRisk: number;
    ageRisk: number;
    holderRisk: number;
    mintRisk: number;
  };
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'extreme';