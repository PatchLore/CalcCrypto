import { neon } from '@neondatabase/serverless';
import {
  connectionStringFor,
  CryptoMacroEnvError,
  readEnv,
  summarizeEnv,
  type ConnectionKind,
  type EnvSource,
  type ResolvedEnv,
  type SafeEnvSummary,
} from './env';

type QueryFunction = ReturnType<typeof neon>;

let cached: { env: ResolvedEnv; pooled: QueryFunction; direct: QueryFunction } | null = null;

export type QueryOptions = {
  readOnly?: boolean;
  timeoutMs?: number;
};

function build(env: ResolvedEnv): { pooled: QueryFunction; direct: QueryFunction } {
  return {
    pooled: neon(connectionStringFor(env, 'pooled')),
    direct: neon(connectionStringFor(env, 'direct')),
  };
}

export function getEnv(source?: EnvSource): ResolvedEnv {
  if (source) {
    return readEnv(source);
  }
  if (!cached) {
    const env = readEnv();
    cached = { env, ...build(env) };
  }
  return cached.env;
}

function getQueryFunction(kind: ConnectionKind): QueryFunction {
  if (!cached) {
    getEnv();
  }
  if (!cached) {
    throw new CryptoMacroEnvError('client_unavailable', 'Crypto Macro database client failed to initialise.');
  }
  return kind === 'pooled' ? cached.pooled : cached.direct;
}

function withTimeout(signal: AbortSignal | undefined, timeoutMs: number): { signal: AbortSignal; cancel: () => void } {
  if (signal) {
    return { signal, cancel: () => undefined };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

export async function queryPooled<TRow = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
  options: QueryOptions = {}
): Promise<TRow[]> {
  return runQuery<TRow>('pooled', text, params, options);
}

export async function queryDirect<TRow = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
  options: QueryOptions = {}
): Promise<TRow[]> {
  return runQuery<TRow>('direct', text, params, options);
}

async function runQuery<TRow>(
  kind: ConnectionKind,
  text: string,
  params: unknown[],
  options: QueryOptions
): Promise<TRow[]> {
  const sql = getQueryFunction(kind);
  const timeoutMs = options.timeoutMs ?? 10000;
  const timeout = withTimeout(undefined, timeoutMs);
  try {
    const result = await sql.query(text, params, { fetchOptions: { signal: timeout.signal } });
    return result as unknown as TRow[];
  } finally {
    timeout.cancel();
  }
}

export async function transactionPooled<TRow = Record<string, unknown>>(
  statements: string[],
  params: unknown[][] = [],
  options: QueryOptions = {}
): Promise<TRow[][]> {
  const sql = getQueryFunction('pooled');
  const timeoutMs = options.timeoutMs ?? 15000;
  const timeout = withTimeout(undefined, timeoutMs);
  try {
    const pending = statements.map((statement, index) => sql.query(statement, params[index] ?? []));
    const settled = await sql.transaction(pending, {
      readOnly: options.readOnly ?? true,
      fetchOptions: { signal: timeout.signal },
    });
    return settled as unknown as TRow[][];
  } finally {
    timeout.cancel();
  }
}

export type ConnectionReport = {
  kind: ConnectionKind;
  ok: boolean;
  database: string | null;
  latencyMs: number;
  errorCategory: string | null;
};

const PROBE_SQL = 'SELECT 1 AS ok, current_database() AS db';

export async function checkConnection(kind: ConnectionKind, options: QueryOptions = {}): Promise<ConnectionReport> {
  const startedAt = Date.now();
  try {
    const rows = await runQuery<{ ok: number; db: string }>(kind, PROBE_SQL, [], options);
    const first = rows[0];
    return {
      kind,
      ok: Boolean(first) && String(first.ok) === '1',
      database: first?.db ?? null,
      latencyMs: Date.now() - startedAt,
      errorCategory: null,
    };
  } catch (error) {
    return {
      kind,
      ok: false,
      database: null,
      latencyMs: Date.now() - startedAt,
      errorCategory: categoriseError(error),
    };
  }
}

function categoriseError(error: unknown): string {
  if (error instanceof CryptoMacroEnvError) {
    return `env:${error.code}`;
  }
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return 'timeout';
    }
    const message = error.message.toLowerCase();
    if (message.includes('fetch failed') || message.includes('network')) {
      return 'network';
    }
    if (message.includes('password authentication') || message.includes('authentication')) {
      return 'authentication';
    }
    if (message.includes('ssl') || message.includes('tls')) {
      return 'tls';
    }
    if (message.includes('does not exist')) {
      return 'missing_relation';
    }
    return `driver:${error.name}`;
  }
  return 'unknown';
}

export type HealthReport = {
  environment: string | null;
  env: SafeEnvSummary;
  connections: ConnectionReport[];
  checkedAt: string;
};

export async function healthReport(
  options: { kinds?: ConnectionKind[]; source?: EnvSource } = {}
): Promise<HealthReport> {
  const kinds = options.kinds ?? ['pooled'];
  const envSummary = summarizeEnv(options.source);
  const connections: ConnectionReport[] = [];

  if (envSummary.pooledConfigured && envSummary.directConfigured) {
    for (const kind of kinds) {
      connections.push(await checkConnection(kind));
    }
  }

  return {
    environment: envSummary.environment,
    env: envSummary,
    connections,
    checkedAt: new Date().toISOString(),
  };
}
