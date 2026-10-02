# Crypto Macro architecture

The feature is isolated under `src/app/crypto-macro`, `src/app/api/crypto-macro`, `src/components/crypto-macro` and `src/lib/crypto-macro`. The provider boundary is `data/providers`, which normalises untrusted responses into dated points before calculations. Dashboard requests do not call upstream providers in the browser. Fixture mode is development-only and is rejected on Vercel preview and production.

The existing database client and health route from checkpoint `19a034c` are preserved. The namespaced tables are created by the development-only migration script. Future identity, entitlements and Chart Analyzer work can add tables without changing the dashboard or calculators.

The dashboard uses a scoped native SVG renderer for the current charts. Apache ECharts remains the approved future chart dependency, but could not be installed in the restricted build environment; no substitute chart library is used.
