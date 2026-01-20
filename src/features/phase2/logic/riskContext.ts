import type { RiskContext, TokenSnapshot } from '../types/phase2';

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

