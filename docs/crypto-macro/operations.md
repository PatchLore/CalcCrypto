# Crypto Macro operations

Run `npm run crypto-macro:migrate` and `npm run crypto-macro:refresh` only against the Neon development branch. Both scripts enforce `CRYPTO_MACRO_DB_ENV=development` and reject the known production endpoint. The Vercel cron calls `/api/crypto-macro/refresh` with `Authorization: Bearer $CRON_SECRET`; missing secrets or database variables return 503.

Provider adapters should be enabled only after current public-display and storage terms are confirmed. If a refresh fails, the dashboard must expose an unavailable or stale state rather than issue visitor-triggered retries.

The refresh job acquires the `daily-refresh` row in `crypto_macro_refresh_leases` for a bounded lease before fetching providers. A valid existing lease causes the job to skip; successful and failed runs release it, and the expiry provides recovery after an interrupted run.
