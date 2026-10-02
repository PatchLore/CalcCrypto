import type { Metric, Point, ReturnPoint } from '../types';
import { THRESHOLDS } from '../config';

export function align(series: Point[][]): { dates: string[]; values: number[][] } {
  if (!series.length) return { dates: [], values: [] };
  const maps = series.map(points => new Map(points.map(p => [p.date, p.value])));
  const dates = [...maps[0].keys()].filter(date => maps.every(m => m.has(date))).sort();
  return { dates, values: maps.map(m => dates.map(d => m.get(d)!)) };
}
export function returns(points: Point[], kind: 'log' | 'percentage' | 'yield' = 'log'): ReturnPoint[] {
  const result: ReturnPoint[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    if (![a.value, b.value].every(Number.isFinite) || (kind !== 'yield' && (a.value <= 0 || b.value <= 0))) continue;
    const value = kind === 'yield' ? (b.value - a.value) * 100 : kind === 'log' ? Math.log(b.value / a.value) : b.value / a.value - 1;
    result.push({ date: b.date, from: a.date, days: (Date.parse(b.date) - Date.parse(a.date)) / 86400000, value });
  }
  return result;
}
export function pairedReturns(a: Point[], b: Point[], aYield = false, bYield = false) {
  const common = align([a, b]);
  const ra = returns(common.dates.map((date, i) => ({ date, value: common.values[0][i] })), aYield ? 'yield' : 'log');
  const rb = new Map(returns(common.dates.map((date, i) => ({ date, value: common.values[1][i] })), bYield ? 'yield' : 'log').map(p => [p.date, p]));
  const paired = ra.filter(p => rb.get(p.date)?.from === p.from);
  return { dates: paired.map(p => p.date), a: paired.map(p => p.value), b: paired.map(p => rb.get(p.date)!.value), multiDay: paired.filter(p => p.days > 1).length };
}
export function pearson(a: number[], b: number[], minimum = THRESHOLDS.minimumPairs): Metric {
  const n = a.length;
  if (n !== b.length || n < minimum || !a.every(Number.isFinite) || !b.every(Number.isFinite)) return { value: null, n };
  const ma = a.reduce((s, v) => s + v, 0) / n, mb = b.reduce((s, v) => s + v, 0) / n;
  let xx = 0, yy = 0, xy = 0;
  for (let i = 0; i < n; i++) { const x = a[i] - ma, y = b[i] - mb; xx += x * x; yy += y * y; xy += x * y; }
  if (xx / n < 1e-20 || yy / n < 1e-20) return { value: null, n };
  return { value: Math.max(-1, Math.min(1, xy / Math.sqrt(xx * yy))), n };
}
export function rolling(a: number[], b: number[], dates: string[], window: number): Point[] {
  const result: Point[] = [];
  for (let i = window; i <= Math.min(a.length, b.length); i++) {
    const value = pearson(a.slice(i - window, i), b.slice(i - window, i)).value;
    if (value !== null) result.push({ date: dates[i - 1], value });
  }
  return result;
}
export function rebase(points: Point[]): Point[] {
  if (!points.length || points[0].value <= 0) return [];
  return points.map(p => ({ ...p, value: p.value / points[0].value * 100 }));
}
export function ratio(a: Point[], b: Point[]): Point[] {
  const data = align([a, b]);
  return data.dates.flatMap((date, i) => data.values[1][i] > 0 ? [{ date, value: data.values[0][i] / data.values[1][i] }] : []);
}
export function standardDeviation(values: number[]): number | null {
  if (values.length < 2 || !values.every(Number.isFinite)) return null;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  return Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1));
}
export function volatility(points: Point[], crypto: boolean, window = 30): Metric {
  // Native series only: missing crypto days do not become 24-hour returns.
  const r = returns(points).filter(p => !crypto || p.days === 1).slice(-window);
  const sd = standardDeviation(r.map(p => p.value));
  return { value: r.length === window && sd !== null ? sd * Math.sqrt(crypto ? 365 : 252) : null, n: r.length };
}
export function drawdown(points: Point[]) {
  let peak = -Infinity;
  const history = points.filter(p => p.value > 0).map(p => { peak = Math.max(peak, p.value); return { date: p.date, value: p.value / peak - 1 }; });
  return { history, current: history.at(-1)?.value ?? null, maximum: history.length ? Math.min(...history.map(p => p.value)) : null };
}
export function leadLag(a: number[], b: number[], limit = 30) {
  const rows = Array.from({ length: limit * 2 + 1 }, (_, i) => {
    const offset = i - limit;
    const x = offset >= 0 ? a.slice(0, a.length - offset) : a.slice(-offset);
    const y = offset >= 0 ? b.slice(offset) : b.slice(0, b.length + offset);
    return { offset, ...pearson(x, y) };
  });
  const valid = rows.filter((r): r is typeof r & { value: number } => r.value !== null);
  valid.sort((a, b) => Math.abs(b.value) - Math.abs(a.value) || Math.abs(a.offset) - Math.abs(b.offset) || a.offset - b.offset);
  return { rows, best: valid[0] ?? null };
}
export function percentile(current: number, history: number[]): number | null {
  if (history.length < THRESHOLDS.history) return null;
  return 100 * (history.filter(v => v < current).length + history.filter(v => v === current).length / 2) / history.length;
}
export function regime(current: number, history: number[]) {
  const rank = percentile(current, history);
  return { percentile: rank, label: rank === null ? 'Insufficient history' : rank > THRESHOLDS.high ? 'Unusually high' : rank < THRESHOLDS.low ? 'Unusually low' : 'Within historical range' };
}
