export const ENV_KEYS = {
  pooled: 'CRYPTO_MACRO_DATABASE_URL',
  direct: 'CRYPTO_MACRO_DATABASE_URL_UNPOOLED',
  environment: 'CRYPTO_MACRO_DB_ENV',
} as const;

export type EnvSource = Record<string, string | undefined>;

export type ConnectionKind = 'pooled' | 'direct';

export class CryptoMacroEnvError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'CryptoMacroEnvError';
    this.code = code;
  }
}

export type ResolvedEnv = {
  environment: string;
  pooledUrl: string;
  directUrl: string;
  endpointId: string;
  database: string;
  pooledUsesPooler: boolean;
  directUsesPooler: boolean;
};

export type SafeEnvSummary = {
  environment: string | null;
  pooledConfigured: boolean;
  directConfigured: boolean;
  pooledUsesPooler: boolean | null;
  directUsesPooler: boolean | null;
  endpointIdsMatch: boolean | null;
  database: string | null;
  isPooledEndpoint: boolean | null;
};

function requireValue(source: EnvSource, key: string): string {
  const raw = source[key];
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    throw new CryptoMacroEnvError(
      'missing_variable',
      `Required environment variable ${key} is not set. Set it in the local environment; do not add a fallback alias.`
    );
  }
  return raw.trim();
}

function parsePostgresUrl(key: string, value: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new CryptoMacroEnvError('malformed_url', `Environment variable ${key} is not a valid URL.`);
  }
  if (parsed.protocol !== 'postgresql:' && parsed.protocol !== 'postgres:') {
    throw new CryptoMacroEnvError('unexpected_scheme', `Environment variable ${key} must use a postgresql:// or postgres:// scheme.`);
  }
  if (!parsed.hostname) {
    throw new CryptoMacroEnvError('missing_host', `Environment variable ${key} has no hostname.`);
  }
  return parsed;
}

function firstLabel(parsed: URL): string {
  return parsed.hostname.split('.')[0] ?? '';
}

function stripPooler(label: string): string {
  return label.replace(/-pooler$/i, '');
}

function databaseOf(parsed: URL): string {
  const name = parsed.pathname.replace(/^\//, '');
  return name.length > 0 ? decodeURIComponent(name) : '';
}

export function readEnv(source: EnvSource = process.env as EnvSource): ResolvedEnv {
  const environment = requireValue(source, ENV_KEYS.environment);
  const pooledUrl = requireValue(source, ENV_KEYS.pooled);
  const directUrl = requireValue(source, ENV_KEYS.direct);

  const pooledParsed = parsePostgresUrl(ENV_KEYS.pooled, pooledUrl);
  const directParsed = parsePostgresUrl(ENV_KEYS.direct, directUrl);

  const pooledLabel = firstLabel(pooledParsed);
  const directLabel = firstLabel(directParsed);
  const pooledUsesPooler = /-pooler$/i.test(pooledLabel);
  const directUsesPooler = /-pooler$/i.test(directLabel);

  if (!pooledUsesPooler) {
    throw new CryptoMacroEnvError(
      'pooled_not_pooled',
      `${ENV_KEYS.pooled} must point at the Neon pooled endpoint (hostname first label ending in -pooler).`
    );
  }

  if (directUsesPooler) {
    throw new CryptoMacroEnvError(
      'direct_is_pooled',
      `${ENV_KEYS.direct} must point at the Neon direct endpoint and must not use -pooler.`
    );
  }

  const pooledEndpoint = stripPooler(pooledLabel).toLowerCase();
  const directEndpoint = stripPooler(directLabel).toLowerCase();

  if (!pooledEndpoint || !directEndpoint) {
    throw new CryptoMacroEnvError('unparseable_endpoint', 'Could not derive the Neon endpoint identifier from the configured hostnames.');
  }

  if (pooledEndpoint !== directEndpoint) {
    throw new CryptoMacroEnvError(
      'endpoint_mismatch',
      'The pooled and direct variables point at different Neon endpoints. Both must address the same branch.'
    );
  }

  return {
    environment,
    pooledUrl,
    directUrl,
    endpointId: pooledEndpoint,
    database: databaseOf(pooledParsed),
    pooledUsesPooler,
    directUsesPooler,
  };
}

export function tryReadEnv(source: EnvSource = process.env as EnvSource): { ok: true; env: ResolvedEnv } | { ok: false; code: string; message: string } {
  try {
    return { ok: true, env: readEnv(source) };
  } catch (error) {
    if (error instanceof CryptoMacroEnvError) {
      return { ok: false, code: error.code, message: error.message };
    }
    return { ok: false, code: 'unknown', message: 'Unexpected failure while resolving the Crypto Macro environment.' };
  }
}

export function summarizeEnv(source: EnvSource = process.env as EnvSource): SafeEnvSummary {
  const result = tryReadEnv(source);
  if (!result.ok) {
    return {
      environment: typeof source[ENV_KEYS.environment] === 'string' ? source[ENV_KEYS.environment]! : null,
      pooledConfigured: Boolean(source[ENV_KEYS.pooled]),
      directConfigured: Boolean(source[ENV_KEYS.direct]),
      pooledUsesPooler: null,
      directUsesPooler: null,
      endpointIdsMatch: null,
      database: null,
      isPooledEndpoint: null,
    };
  }

  const { env } = result;
  return {
    environment: env.environment,
    pooledConfigured: true,
    directConfigured: true,
    pooledUsesPooler: env.pooledUsesPooler,
    directUsesPooler: env.directUsesPooler,
    endpointIdsMatch: true,
    database: env.database,
    isPooledEndpoint: true,
  };
}

export function connectionStringFor(env: ResolvedEnv, kind: ConnectionKind): string {
  return kind === 'pooled' ? env.pooledUrl : env.directUrl;
}
