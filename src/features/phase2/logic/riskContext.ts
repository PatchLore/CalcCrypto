import type { RiskContext, TokenSnapshot } from '../types/phase2';

// ── Known major stablecoins & blue-chip tokens ──────────────
// These tokens have well-understood risk profiles that cannot
// be accurately assessed from DEX liquidity alone, as most
// volume occurs on centralised exchanges.
const KNOWN_LOW_RISK_TOKENS: Record<string, string> = {
  // Stablecoins
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT',
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'DAI',
  '0x4fabb145d64652a948d72533023f6e7a623c7c53': 'BUSD',
  '0x956f47f50a910163d8bf957cf5846d573e7f87ca': 'FEI',
  '0x853d955acef822db058eb8505911ed77f175b99e': 'FRAX',
  // Blue-chip tokens
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'WETH',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'WBTC',
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'UNI',
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'AAVE',
};

type RuleHit = {
  points: number;
  warning: string;
};

function computeDerived(snapshot: TokenSnapshot): { liqToFdv: number | null; volToLiq: number | null } {
  const { liquidityUsd, fdvUsd, volume24hUsd } = snapshot;

  const liqToFdv =
    liquidityUsd != null && fdvUsd != null && fdvUsd > 0 ? liquidityUsd / fdvUsd : null;

  const volToLiq =
    volume24hUsd != null && liquidityUsd != null && liquidityUsd > 0 ? volume24hUsd / liquidityUsd : null;

  return { liqToFdv, volToLiq };
}

function scoreLiquidity(liquidityUsd: number | null): RuleHit[] {
  if (liquidityUsd == null) {
    return [{
      points: 35,
      warning: 'Liquidity data unavailable (treated as elevated risk).',
    }];
  }

  if (liquidityUsd < 50_000) return [{ points: 35, warning: 'Thin liquidity (< $50k).' }];
  if (liquidityUsd < 250_000) return [{ points: 20, warning: 'Low liquidity ($50k–$250k).' }];
  if (liquidityUsd < 1_000_000) return [{ points: 10, warning: 'Moderate liquidity ($250k–$1m).' }];
  return [];
}

function scoreFdvVsLiquidity(liqToFdv: number | null, fdvUsd: number | null): RuleHit[] {
  if (fdvUsd == null) {
    return [{
      points: 15,
      warning: 'FDV data unavailable (risk context may be incomplete).',
    }];
  }
  if (fdvUsd <= 0) {
    return [{
      points: 15,
      warning: 'FDV is non-positive (risk context may be incomplete).',
    }];
  }
  if (liqToFdv == null) {
    return [{
      points: 15,
      warning: 'Unable to compute liquidity-to-FDV ratio (risk context may be incomplete).',
    }];
  }

  if (liqToFdv < 0.002) return [{ points: 25, warning: 'Very low liquidity relative to FDV (liq/FDV < 0.002).' }];
  if (liqToFdv < 0.01) return [{ points: 15, warning: 'Low liquidity relative to FDV (liq/FDV 0.002–0.01).' }];
  if (liqToFdv < 0.03) return [{ points: 5, warning: 'Moderate liquidity relative to FDV (liq/FDV 0.01–0.03).' }];
  return [];
}

function scoreVolumeQuality(volToLiq: number | null, volume24hUsd: number | null): RuleHit[] {
  if (volume24hUsd == null) {
    return [{
      points: 10,
      warning: '24h volume data unavailable (risk context may be incomplete).',
    }];
  }
  if (volume24hUsd < 0) {
    return [{
      points: 10,
      warning: '24h volume is negative (risk context may be incomplete).',
    }];
  }
  if (volToLiq == null) {
    return [{
      points: 10,
      warning: 'Unable to compute volume-to-liquidity ratio (risk context may be incomplete).',
    }];
  }

  if (volToLiq < 0.05) return [{ points: 20, warning: 'Low volume relative to liquidity (vol/liq < 0.05).' }];
  if (volToLiq < 0.2) return [{ points: 10, warning: 'Moderate volume relative to liquidity (vol/liq 0.05–0.2).' }];
  if (volToLiq < 1.0) return [];
  return [{ points: 10, warning: 'Very high volume relative to liquidity (vol/liq ≥ 1.0).' }];
}

function mapRisk(score: number): RiskContext['riskLevel'] {
  if (score >= 55) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

function buildSummary(riskLevel: RiskContext['riskLevel'], hits: RuleHit[]): string {
  if (hits.length === 0) {
    return 'No risk flags were triggered by the current snapshot rules. This is context, not advice.';
  }

  if (riskLevel === 'low') {
    return 'Low risk flags based on the snapshot rules. This is context, not advice.';
  }
  if (riskLevel === 'medium') {
    return 'Medium risk flags based on liquidity/valuation/volume signals. This is context, not advice.';
  }
  return 'High risk flags based on liquidity/valuation/volume signals. This is context, not advice.';
}

/**
 * Deterministic, point-based risk context engine.
 * Same inputs -> same outputs.
 * No predictions, no advice, no randomness.
 */
export function computeRiskContext(snapshot: TokenSnapshot): RiskContext {
  // Check if this is a known low-risk token
  const tokenAddress = snapshot.address?.toLowerCase();
  const knownToken = tokenAddress 
    ? KNOWN_LOW_RISK_TOKENS[tokenAddress] 
    : null;

  if (knownToken) {
    return {
      score: 5,
      riskLevel: 'low',
      warnings: [],
      summary: `${knownToken} is a well-established token. DEX liquidity metrics are not representative of its full market depth across centralised exchanges. This is context, not advice.`,
      derived: computeDerived(snapshot),
    };
  }

  const derived = computeDerived(snapshot);

  const hits: RuleHit[] = [
    ...scoreLiquidity(snapshot.liquidityUsd),
    ...scoreFdvVsLiquidity(derived.liqToFdv, snapshot.fdvUsd),
    ...scoreVolumeQuality(derived.volToLiq, snapshot.volume24hUsd),
  ];

  const score = hits.reduce((sum, h) => sum + h.points, 0);
  const riskLevel = mapRisk(score);

  return {
    score,
    riskLevel,
    warnings: hits.map(h => h.warning),
    summary: buildSummary(riskLevel, hits),
    derived,
  };
}

