import { z } from 'zod';
import type { Point } from '../types';

const pointSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), value: z.number().finite() });
export function normalizePoints(input: unknown): Point[] {
  if (!Array.isArray(input)) return [];
  const points = input.flatMap(value => {
    const parsed = pointSchema.safeParse(value);
    return parsed.success ? [parsed.data] : [];
  });
  return [...new Map(points.map(point => [point.date, point])).values()].sort((a, b) => a.date.localeCompare(b.date));
}
export const ecbResponseSchema = z.object({
  data: z.object({ dataSets: z.array(z.object({ series: z.record(z.string(), z.object({ observations: z.record(z.string(), z.number()) })) })) }),
  meta: z.unknown().optional(),
});
export function normalizeEcbJson(input: unknown): Point[] {
  const parsed = ecbResponseSchema.safeParse(input);
  if (!parsed.success) return [];
  const series = parsed.data.data.dataSets[0]?.series;
  if (!series) return [];
  const observations = Object.values(series)[0]?.observations ?? {};
  return Object.entries(observations).map(([date, value]) => ({ date, value })).filter(point => pointSchema.safeParse(point).success);
}

