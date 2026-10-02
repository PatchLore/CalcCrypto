import { healthReport, type ConnectionKind } from '@/lib/crypto-macro/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function requestedKinds(url: string): ConnectionKind[] {
  const requested = new URL(url).searchParams.get('connections');
  if (requested === 'both') {
    return ['pooled', 'direct'];
  }
  if (requested === 'direct') {
    return ['direct'];
  }
  return ['pooled'];
}

export async function GET(request: Request) {
  const kinds = requestedKinds(request.url);
  const report = await healthReport({ kinds });

  const configured = report.env.pooledConfigured && report.env.directConfigured;
  const allOk = configured && report.connections.length > 0 && report.connections.every((entry) => entry.ok);

  const body = {
    status: allOk ? 'ok' : 'degraded',
    environment: report.environment,
    checkedAt: report.checkedAt,
    configuration: {
      pooledConfigured: report.env.pooledConfigured,
      directConfigured: report.env.directConfigured,
      pooledUsesPooler: report.env.pooledUsesPooler,
      directUsesPooler: report.env.directUsesPooler,
      endpointIdsMatch: report.env.endpointIdsMatch,
      database: report.env.database,
    },
    connections: report.connections.map((entry) => ({
      kind: entry.kind,
      ok: entry.ok,
      database: entry.database,
      latencyMs: entry.latencyMs,
      errorCategory: entry.errorCategory,
    })),
  };

  return Response.json(body, {
    status: allOk ? 200 : 503,
    headers: { 'cache-control': 'no-store' },
  });
}
