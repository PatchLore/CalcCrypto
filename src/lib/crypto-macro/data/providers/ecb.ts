import { normalizeEcbJson } from '../normalize';
const ECB_BASE = 'https://data-api.ecb.europa.eu/service/data/EXR';
export const ECB_SERIES = Object.freeze({
  eurusd: `${ECB_BASE}/D.USD.EUR.SP00.A?format=jsondata`,
  eurgbp: `${ECB_BASE}/D.GBP.EUR.SP00.A?format=jsondata`,
  eurjpy: `${ECB_BASE}/D.JPY.EUR.SP00.A?format=jsondata`,
} as const);
export type EcbAssetId = keyof typeof ECB_SERIES;

export async function fetchEcbSeries(id: EcbAssetId, signal?: AbortSignal) {
  const response = await fetch(ECB_SERIES[id], { signal, next: { revalidate: 86400 } });
  if (!response.ok) throw new Error('ECB request failed');
  const points = normalizeEcbJson(await response.json());
  if (!points.length) throw new Error('ECB returned no observations');
  return points;
}

export function fetchEcbReferenceRates(signal?: AbortSignal) {
  return Promise.all((Object.keys(ECB_SERIES) as EcbAssetId[]).map(async id => [id, await fetchEcbSeries(id, signal)] as const));
}

export const fetchEcbUsd = (signal?: AbortSignal) => fetchEcbSeries('eurusd', signal);
