import { queryPooled } from './client';
import type { Point } from '../types';
export async function readStoredSeries() {
  return queryPooled<{ id: string; points: Point[]; status: string; retrieved_at: string | null; source_updated_at: string | null; last_success_at: string | null }>('SELECT id, points, status, retrieved_at, source_updated_at, last_success_at FROM crypto_macro_series WHERE status = $1', ['available'], { readOnly: true });
}
export async function upsertSeries(input: { id: string; name: string; symbol: string; provider: string; sourceUrl: string; status: string; licensed: boolean; storagePolicy: string; frequency: string; disclosure: string; points: Point[]; retrievedAt: string; sourceUpdatedAt: string | null }) {
  await queryPooled(
    'INSERT INTO crypto_macro_series (id, name, symbol, provider, source_url, status, licensed, storage_policy, frequency, disclosure, points, retrieved_at, source_updated_at, last_success_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13,$12,now()) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, symbol=EXCLUDED.symbol, provider=EXCLUDED.provider, source_url=EXCLUDED.source_url, status=EXCLUDED.status, licensed=EXCLUDED.licensed, storage_policy=EXCLUDED.storage_policy, frequency=EXCLUDED.frequency, disclosure=EXCLUDED.disclosure, points=EXCLUDED.points, retrieved_at=EXCLUDED.retrieved_at, source_updated_at=EXCLUDED.source_updated_at, last_success_at=EXCLUDED.last_success_at, updated_at=now()',
    [input.id, input.name, input.symbol, input.provider, input.sourceUrl, input.status, input.licensed, input.storagePolicy, input.frequency, input.disclosure, JSON.stringify(input.points), input.retrievedAt, input.sourceUpdatedAt],
  );
}
export function refreshLeaseActive(leaseUntil: string | Date | null, now = new Date()): boolean {
  if (!leaseUntil) return false;
  const expiry = leaseUntil instanceof Date ? leaseUntil : new Date(leaseUntil);
  return Number.isFinite(expiry.getTime()) && expiry.getTime() > now.getTime();
}
export async function acquireRefreshLease(name = 'daily-refresh', leaseSeconds = 900): Promise<boolean> {
  const rows = await queryPooled<{ name: string }>(
    "INSERT INTO crypto_macro_refresh_leases (name, lease_until, updated_at) VALUES ($1, now() + ($2 * interval '1 second'), now()) ON CONFLICT (name) DO UPDATE SET lease_until = EXCLUDED.lease_until, updated_at = now() WHERE crypto_macro_refresh_leases.lease_until <= now() RETURNING name",
    [name, leaseSeconds],
  );
  return rows.length > 0;
}
export async function releaseRefreshLease(name = 'daily-refresh'): Promise<void> {
  await queryPooled('DELETE FROM crypto_macro_refresh_leases WHERE name = $1', [name]);
}
export async function insertWaitlist(input: { email: string; consentVersion: string; consentWording: string; source: string; ipHash: string | null }) {
  const rows = await queryPooled<{ id: string }>('INSERT INTO crypto_macro_waitlist (email, consent_at, consent_version, consent_wording, signup_source, ip_hash) VALUES ($1, now(), $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING RETURNING id', [input.email, input.consentVersion, input.consentWording, input.source, input.ipHash]);
  return rows.length > 0;
}
export async function incrementRateLimit(bucket: string): Promise<number> {
  const rows = await queryPooled<{ count: number }>('INSERT INTO crypto_macro_rate_limits (bucket, bucket_start, count) VALUES ($1, CURRENT_DATE, 1) ON CONFLICT (bucket, bucket_start) DO UPDATE SET count = crypto_macro_rate_limits.count + 1, updated_at = now() RETURNING count', [bucket]);
  return Number(rows[0]?.count ?? 0);
}
