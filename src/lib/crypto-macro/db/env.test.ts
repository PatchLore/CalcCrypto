import test from 'node:test';
import assert from 'node:assert/strict';

import {
  connectionStringFor,
  CryptoMacroEnvError,
  ENV_KEYS,
  readEnv,
  summarizeEnv,
  tryReadEnv,
  type EnvSource,
} from './env.ts';

const FAKE_USER = 'fixture_user';
const FAKE_PASSWORD = 'fixture_password_not_real';
const DEV_ENDPOINT = 'ep-fixture-branch-aaaaaa1';
const PROD_ENDPOINT = 'ep-fixture-branch-bbbbbb2';

function connectionString(options: { endpoint: string; pooler: boolean; database?: string }): string {
  const suffix = options.pooler ? '-pooler' : '';
  const database = options.database ?? 'neondb';
  return `postgresql://${FAKE_USER}:${FAKE_PASSWORD}@${options.endpoint}${suffix}.us-east-1.aws.neon.tech/${database}?sslmode=require`;
}

function source(overrides: Partial<EnvSource> = {}): EnvSource {
  return {
    [ENV_KEYS.pooled]: connectionString({ endpoint: DEV_ENDPOINT, pooler: true }),
    [ENV_KEYS.direct]: connectionString({ endpoint: DEV_ENDPOINT, pooler: false }),
    [ENV_KEYS.environment]: 'development',
    ...overrides,
  };
}

function expectCode(fn: () => unknown, code: string): void {
  assert.throws(fn, (error: unknown) => {
    assert.ok(error instanceof CryptoMacroEnvError);
    assert.equal(error.code, code);
    return true;
  });
}

test('reads a valid dev configuration', () => {
  const env = readEnv(source());
  assert.equal(env.environment, 'development');
  assert.equal(env.endpointId, DEV_ENDPOINT);
  assert.equal(env.database, 'neondb');
  assert.equal(env.pooledUsesPooler, true);
  assert.equal(env.directUsesPooler, false);
});

test('accepts a postgres:// scheme as well as postgresql://', () => {
  const env = readEnv(
    source({
      [ENV_KEYS.pooled]: connectionString({ endpoint: DEV_ENDPOINT, pooler: true }).replace('postgresql://', 'postgres://'),
    })
  );
  assert.equal(env.endpointId, DEV_ENDPOINT);
});

test('rejects a missing pooled variable', () => {
  expectCode(() => readEnv(source({ [ENV_KEYS.pooled]: undefined })), 'missing_variable');
});

test('rejects an empty pooled variable', () => {
  expectCode(() => readEnv(source({ [ENV_KEYS.pooled]: '   ' })), 'missing_variable');
});

test('rejects a missing direct variable', () => {
  expectCode(() => readEnv(source({ [ENV_KEYS.direct]: undefined })), 'missing_variable');
});

test('rejects a missing environment identifier', () => {
  expectCode(() => readEnv(source({ [ENV_KEYS.environment]: undefined })), 'missing_variable');
});

test('rejects a non-postgres scheme', () => {
  expectCode(() => readEnv(source({ [ENV_KEYS.pooled]: 'https://example.invalid/db' })), 'unexpected_scheme');
});

test('rejects a malformed url', () => {
  expectCode(() => readEnv(source({ [ENV_KEYS.pooled]: 'not-a-url' })), 'malformed_url');
});

test('rejects a pooled variable that is not actually pooled', () => {
  expectCode(
    () => readEnv(source({ [ENV_KEYS.pooled]: connectionString({ endpoint: DEV_ENDPOINT, pooler: false }) })),
    'pooled_not_pooled'
  );
});

test('rejects a direct variable that is pooled', () => {
  expectCode(
    () => readEnv(source({ [ENV_KEYS.direct]: connectionString({ endpoint: DEV_ENDPOINT, pooler: true }) })),
    'direct_is_pooled'
  );
});

test('rejects pooled and direct pointing at different branches', () => {
  expectCode(
    () =>
      readEnv(
        source({
          [ENV_KEYS.pooled]: connectionString({ endpoint: DEV_ENDPOINT, pooler: true }),
          [ENV_KEYS.direct]: connectionString({ endpoint: PROD_ENDPOINT, pooler: false }),
        })
      ),
    'endpoint_mismatch'
  );
});

test('endpoint id comparison is case insensitive', () => {
  const env = readEnv(
    source({
      [ENV_KEYS.direct]: connectionString({ endpoint: DEV_ENDPOINT.toUpperCase(), pooler: false }),
    })
  );
  assert.equal(env.endpointId, DEV_ENDPOINT);
});

test('extracts a non-default database name', () => {
  const env = readEnv(
    source({
      [ENV_KEYS.pooled]: connectionString({ endpoint: DEV_ENDPOINT, pooler: true, database: 'macro_dev' }),
      [ENV_KEYS.direct]: connectionString({ endpoint: DEV_ENDPOINT, pooler: false, database: 'macro_dev' }),
    })
  );
  assert.equal(env.database, 'macro_dev');
});

test('connectionStringFor selects the requested connection', () => {
  const env = readEnv(source());
  assert.match(connectionStringFor(env, 'pooled'), /-pooler\./);
  assert.doesNotMatch(connectionStringFor(env, 'direct'), /-pooler\./);
});

test('tryReadEnv reports a code instead of throwing', () => {
  const result = tryReadEnv(source({ [ENV_KEYS.environment]: undefined }));
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.code, 'missing_variable');
  }
});

test('summarizeEnv never returns credentials or hostnames', () => {
  const summary = summarizeEnv(source());
  const serialised = JSON.stringify(summary);
  assert.equal(summary.environment, 'development');
  assert.equal(summary.pooledUsesPooler, true);
  assert.equal(summary.directUsesPooler, false);
  assert.equal(summary.endpointIdsMatch, true);
  assert.equal(summary.database, 'neondb');
  assert.doesNotMatch(serialised, new RegExp(FAKE_USER));
  assert.doesNotMatch(serialised, new RegExp(FAKE_PASSWORD));
  assert.doesNotMatch(serialised, /aws\.neon\.tech/);
  assert.doesNotMatch(serialised, new RegExp(DEV_ENDPOINT));
});

test('summarizeEnv degrades safely when configuration is absent', () => {
  const summary = summarizeEnv({});
  assert.equal(summary.environment, null);
  assert.equal(summary.pooledConfigured, false);
  assert.equal(summary.directConfigured, false);
  assert.equal(summary.pooledUsesPooler, null);
  assert.equal(summary.database, null);
});

test('summarizeEnv does not throw on a misconfigured endpoint', () => {
  const summary = summarizeEnv(
    source({
      [ENV_KEYS.pooled]: connectionString({ endpoint: DEV_ENDPOINT, pooler: true }),
      [ENV_KEYS.direct]: connectionString({ endpoint: PROD_ENDPOINT, pooler: false }),
    })
  );
  assert.equal(summary.endpointIdsMatch, null);
  assert.equal(summary.pooledConfigured, true);
});
