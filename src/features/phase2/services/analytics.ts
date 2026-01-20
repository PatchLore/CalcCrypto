import type { RiskLevel } from '../types/phase2';

type Phase2RiskContextViewedPayload = {
  calculator: 'token-price';
  risk_level: RiskLevel;
};

/**
 * Phase 2-only analytics wrapper.
 * - Emits ONE lightweight engagement signal
 * - No user identifiers
 * - No wallet addresses
 * - No contract addresses
 * - No persistence
 */
export function trackPhase2RiskContextViewed(payload: Phase2RiskContextViewedPayload): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;

  gtag('event', 'phase2_risk_context_viewed', payload);
}

