import { TokenRiskData, RiskScore, RiskLevel } from '@/features/phase2/types';

/**
 * Calculate deterministic risk score for a token based on on-chain and market data
 * @param tokenData - Token data fetched from DexScreener or other sources
 * @returns RiskScore object with score (0-100), level, and factor breakdown
 */
export function calculateRiskScore(tokenData: TokenRiskData): RiskScore {
  // Initialize risk factors
  let liquidityRisk = 0;
  let ageRisk = 0;
  let holderRisk = 0;
  let mintRisk = 0;

  // Liquidity risk: <$50k = +30pts
  if (tokenData.liquidity < 50000) {
    liquidityRisk = 30;
  }

  // Age risk: <7 days = +25pts
  if (tokenData.ageDays < 7) {
    ageRisk = 25;
  }

  // Holder concentration risk: 
  // >80% held by top 10 = +20pts, 60-80% = +10pts, <60% = +0pts
  if (tokenData.holderConcentration > 80) {
    holderRisk = 20;
  } else if (tokenData.holderConcentration > 60) {
    holderRisk = 10;
  }

  // Mint authority risk: if not renounced = +25pts
  if (!tokenData.mintAuthorityRenounced) {
    mintRisk = 25;
  }

  // Calculate total score
  const totalScore = liquidityRisk + ageRisk + holderRisk + mintRisk;

  // Determine risk level
  let level: RiskLevel;
  if (totalScore <= 25) {
    level = 'low';
  } else if (totalScore <= 50) {
    level = 'medium';
  } else if (totalScore <= 75) {
    level = 'high';
  } else {
    level = 'extreme';
  }

  return {
    score: totalScore,
    level,
    factors: {
      liquidityRisk,
      ageRisk,
      holderRisk,
      mintRisk,
    },
  };
}