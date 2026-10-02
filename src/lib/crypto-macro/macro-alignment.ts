import type { Series } from './types';
import { THRESHOLDS } from './config';
import { pairedReturns, rolling, regime } from './calculations/metrics';
export function relationship(a: Series, b: Series) {
  const p = pairedReturns(a.points, b.points, a.kind === 'rate', b.kind === 'rate');
  const r30 = rolling(p.a, p.b, p.dates, 30), r90 = rolling(p.a, p.b, p.dates, 90), r180 = rolling(p.a, p.b, p.dates, 180);
  const c30 = r30.at(-1)?.value ?? null, c90 = r90.at(-1)?.value ?? null, c180 = r180.at(-1)?.value ?? null;
  const history = r90.slice(0, -1).map(p => p.value);
  const state = c90 === null ? { label: 'Insufficient history', percentile: null } : regime(c90, history);
  const triggers: string[] = [];
  if (state.percentile !== null && (state.percentile > THRESHOLDS.high || state.percentile < THRESHOLDS.low)) triggers.push(`90-observation correlation: ${state.label.toLowerCase()}`);
  if (c30 !== null && c180 !== null && Math.abs(c30 - c180) >= THRESHOLDS.divergence) triggers.push('30 / 180 correlation difference ≥ 0.40');
  if (c90 !== null && c180 !== null && c90 * c180 < 0 && Math.abs(c90) >= THRESHOLDS.reversal && Math.abs(c180) >= THRESHOLDS.reversal) triggers.push('90 / 180 correlation sign change; both magnitudes ≥ 0.20');
  return { id: `${a.id}:${b.id}`, a: a.id, b: b.id, label: `${a.symbol} / ${b.symbol}`, n: p.a.length, eligible: c30 !== null && c90 !== null && c180 !== null,
    c30, c90, c180, state, triggers, notable: triggers.length > 0, r30, r90, r180, multiDay: p.multiDay };
}
export function macroAlignment(series: Series[]) {
  const usable = series.filter(s => s.enabled && s.status === 'available');
  const relationships = usable.flatMap((a, i) => usable.slice(i + 1).map(b => relationship(a, b)));
  const available = relationships.filter(r => r.eligible);
  return { relationships, available: available.length, notable: available.filter(r => r.notable).length };
}
