import { fetchEcbReferenceRates } from './providers/ecb';
import { ASSETS } from '../assets';
import { acquireRefreshLease, releaseRefreshLease, upsertSeries } from '../db/repository';
export async function refreshEnabledSources() {
  const leaseName = 'daily-refresh';
  if (!(await acquireRefreshLease(leaseName))) {
    return { refreshed: [], unavailable: ASSETS.filter(asset => asset.enabled).map(asset => asset.id), skipped: true };
  }
  const retrievedAt = new Date().toISOString();
  try {
    const refreshed = [] as { id: string; points: { date: string; value: number }[]; retrievedAt: string }[];
    for (const [id, points] of await fetchEcbReferenceRates()) {
      const asset = ASSETS.find(candidate => candidate.id === id);
      if (!asset || !asset.enabled || !asset.licensed) continue;
      await upsertSeries({ id: asset.id, name: asset.name, symbol: asset.symbol, provider: asset.provider, sourceUrl: asset.sourceUrl, status: 'available', licensed: asset.licensed, storagePolicy: asset.storage, frequency: asset.frequency, disclosure: asset.disclosure, points, retrievedAt, sourceUpdatedAt: points.at(-1)?.date ?? null });
      refreshed.push({ id, points, retrievedAt });
    }
    const refreshedIds = new Set(refreshed.map(item => item.id));
    return { refreshed, unavailable: ASSETS.filter(asset => asset.enabled && !refreshedIds.has(asset.id)).map(asset => asset.id), skipped: false };
  } finally {
    await releaseRefreshLease(leaseName);
  }
}
