import type { Metric } from './types';
export function formatMetric(value: number | null, digits = 2): string {
  return value === null ? 'Unavailable' : value.toFixed(digits);
}

export function correlationObservation(metric: Metric): string {
  return metric.value === null ? 'Insufficient paired observations or variation for this relationship.' :
    `The selected relationship has a ${metric.value >= 0 ? 'positive' : 'negative'} correlation of ${metric.value.toFixed(2)} across ${metric.n} paired return observations.`;
}
