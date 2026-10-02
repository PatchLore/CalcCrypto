import { ASSETS } from '../assets';
import { fixturesAllowed } from '../config';
import { fixtureSnapshot } from './fixtures';
import type { Series, Snapshot } from '../types';
import { readStoredSeries } from '../db/repository';

function unavailable(asset: (typeof ASSETS)[number], message = asset.disclosure): Series {
  return { ...asset, points: [], status: 'unavailable', retrievedAt: null, sourceUpdatedAt: null, lastSuccessAt: null, message };
}

export async function getSnapshot(): Promise<Snapshot> {
  if (fixturesAllowed()) return fixtureSnapshot();
  const series = ASSETS.map(asset => unavailable(asset));
  let databaseAvailable = false;
  try {
    const stored = await readStoredSeries();
    databaseAvailable = true;
    for (const row of stored) {
      const asset = ASSETS.find(candidate => candidate.id === row.id);
      if (!asset) continue;
      const index = series.findIndex(candidate => candidate.id === row.id);
      series[index] = { ...asset, points: row.points, status: 'available', retrievedAt: row.retrieved_at, sourceUpdatedAt: row.source_updated_at, lastSuccessAt: row.last_success_at, message: asset.disclosure };
    }
  } catch {
    // Production pages degrade to explicit unavailable states; provider details stay server-side.
  }
  return { series, development: false, asOf: new Date().toISOString(), databaseAvailable };
}
