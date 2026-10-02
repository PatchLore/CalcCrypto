export type Point = { date: string; value: number };
export type StoragePolicy = 'persistable' | 'short-cache' | 'no-persistence' | 'display-not-permitted';
export type Asset = {
  id: string; name: string; symbol: string; category: 'crypto' | 'macro';
  unit: string; kind: 'price' | 'rate' | 'index' | 'supply'; color: string;
  provider: string; sourceUrl: string; enabled: boolean; licensed: boolean;
  storage: StoragePolicy; disclosure: string; frequency: string;
};
export type Series = Asset & {
  points: Point[]; status: 'available' | 'unavailable' | 'stale' | 'error' | 'empty';
  retrievedAt: string | null; sourceUpdatedAt: string | null; lastSuccessAt: string | null;
  message: string;
};
export type Snapshot = { series: Series[]; development: boolean; asOf: string; databaseAvailable: boolean };
export type Metric = { value: number | null; n: number };
export type ReturnPoint = Point & { from: string; days: number };
