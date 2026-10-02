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
const ecbObservationDimensionSchema = z.object({
  id: z.string(),
  values: z.array(z.object({ id: z.string() })).optional(),
});
const ecbObservationSchema = z.union([z.number(), z.array(z.union([z.number(), z.null()]))]);
export const ecbResponseSchema = z.object({
  dataSets: z
    .array(z.object({ series: z.record(z.string(), z.object({ observations: z.record(z.string(), ecbObservationSchema) })) }))
    .min(1),
  structure: z
    .object({ dimensions: z.object({ observation: z.array(ecbObservationDimensionSchema).min(1) }) })
    .optional(),
});
export function normalizeEcbJson(input: unknown): Point[] {
  const parsed = ecbResponseSchema.safeParse(input);
  if (!parsed.success) return [];
  const series = parsed.data.dataSets[0]?.series;
  if (!series) return [];
  const periods = parsed.data.structure?.dimensions.observation[0]?.values ?? [];
  const observations = Object.values(series)[0]?.observations ?? {};
  const points = Object.entries(observations).map(([key, value]) => {
    const raw = Array.isArray(value) ? value[0] : value;
    const period = periods[Number(key)];
    return { date: period ? period.id : key, value: typeof raw === 'number' ? raw : Number.NaN };
  });
  return normalizePoints(points);
}

