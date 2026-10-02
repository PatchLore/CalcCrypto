import type { Point, Series, Snapshot } from '../types';
import { ASSETS } from '../assets';

function makePoints(seed: number, drift: number, count = 420): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(2024, 0, 1 + index)).toISOString().slice(0, 10);
    const wave = Math.sin(index / 17 + seed) * 0.018 + Math.cos(index / 31 + seed) * 0.009;
    return { date, value: seed * 100 * Math.exp((drift * index) + wave) };
  });
}

export function fixtureSnapshot(now = new Date('2026-10-02T00:00:00.000Z')): Snapshot {
  const active = ASSETS.filter(asset => ['btc', 'eth', 'eurusd', 'eurgbp', 'eurjpy'].includes(asset.id));
  const series: Series[] = active.map((asset, index) => ({
    ...asset,
    enabled: true,
    licensed: true,
    storage: 'persistable',
    status: 'available',
    points: makePoints(index + 1, [0.0012, 0.0007, -0.0001, 0.0002, -0.00015][index]),
    retrievedAt: now.toISOString(),
    sourceUpdatedAt: now.toISOString(),
    lastSuccessAt: now.toISOString(),
    message: 'SYNTHETIC TEST DATA — development fixture only; never live market data.',
    disclosure: 'SYNTHETIC TEST DATA — development fixture only; never live market data.',
  }));
  return { series, development: true, asOf: now.toISOString(), databaseAvailable: false };
}
