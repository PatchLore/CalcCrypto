## Phase 2 (CalCrypto) — Read-only Decision Context

Phase 2 adds a deterministic “Super Gem” interpretation layer on top of existing calculators.

### What this does
- **Token Snapshot** (Ethereum-only): fetches read-only market metrics (price, liquidity, FDV, 24h volume) from DexScreener.
- **Risk Context**: deterministic, point-based scoring that produces:
  - risk level (low/medium/high)
  - plain-English warnings
  - a short neutral summary (“context, not advice”)

### What this deliberately does NOT do
- No changes to existing calculator math (`src/lib/formulas.ts`)
- No auth, wallets, transactions, or write actions
- No storage/persistence of user data
- No predictions or buy/sell advice
- No dashboards/charts

All Phase 2 code is isolated under `src/features/phase2/`.

