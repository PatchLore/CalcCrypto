CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS crypto_macro_series (
  id text PRIMARY KEY, name text NOT NULL, symbol text NOT NULL, provider text NOT NULL,
  source_url text NOT NULL, status text NOT NULL, licensed boolean NOT NULL DEFAULT false,
  storage_policy text NOT NULL, frequency text NOT NULL, disclosure text NOT NULL,
  retrieved_at timestamptz, source_updated_at timestamptz, last_success_at timestamptz,
  points jsonb NOT NULL DEFAULT '[]'::jsonb, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crypto_macro_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE,
  consent_at timestamptz NOT NULL, consent_version text NOT NULL, consent_wording text NOT NULL,
  signup_source text NOT NULL, ip_hash text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crypto_macro_rate_limits (
  bucket text NOT NULL, bucket_start date NOT NULL, count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (bucket, bucket_start)
);
CREATE TABLE IF NOT EXISTS crypto_macro_refresh_leases (
  name text PRIMARY KEY, lease_until timestamptz NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
