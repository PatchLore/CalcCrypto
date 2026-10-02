# Crypto Macro environment names

Set values only in the local or deployment secret manager. Never commit values.

- `CRYPTO_MACRO_DATABASE_URL`
- `CRYPTO_MACRO_DATABASE_URL_UNPOOLED`
- `CRYPTO_MACRO_DB_ENV`
- `CRYPTO_MACRO_USE_FIXTURES`
- `CRYPTO_MACRO_INDEXABLE`
- `CRYPTO_MACRO_IP_HASH_SECRET`
- `CRON_SECRET`
- `CRYPTO_MACRO_FRED_API_KEY`
- `CRYPTO_MACRO_COINGECKO_API_KEY`
- `CRYPTO_MACRO_ALPHA_VANTAGE_API_KEY`

Fixture mode is accepted only outside production and preview. Database write scripts require `CRYPTO_MACRO_DB_ENV=development` and reject the production Neon endpoint.
