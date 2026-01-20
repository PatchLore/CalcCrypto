# CalCrypto — Phase 2 (Decision Context)

## Internal Summary

## Purpose
Phase 2 adds an optional Decision Context layer to CalCrypto that explains what calculator outputs mean using live market structure data — without changing calculator math, giving advice, or introducing regulatory risk.

This is a read-only interpretation layer, not a trading tool.

## What was implemented (high level)
Phase 2 sits alongside the existing Profit/Loss calculator and does not interfere with it.

The system consists of:
- Token Snapshot (data layer)
- Deterministic Risk Context logic (interpretation layer)
- Non-blocking UI integration (presentation layer)

All Phase 2 code is isolated under `src/features/phase2/`.

## Core design principles (non-negotiable)
- Calculator math remains the source of truth
- Phase 2 is optional and non-blocking
- Read-only public data only
- Deterministic rules (no AI, no guessing)
- No predictions, recommendations, or advice
- No user accounts, wallets, or stored data
- Clear “Context, not advice” labeling everywhere

---

## 1. Token Snapshot (Data Input)

### Input
- Ethereum contract address (user-supplied)

### Data source
- DexScreener (public, read-only)

### Fetched fields
- Price (USD)
- Liquidity (USD)
- Fully Diluted Valuation (FDV)
- 24h trading volume

### Guarantees
- No API keys
- No writes
- No persistence
- Graceful handling of invalid input, unsupported chains, and API failure

**Purpose**: provide objective market structure facts.

---

## 2. Risk Context (“Super Gem”) Logic
Implemented as a pure, deterministic function.

### Inputs
- Normalized Token Snapshot data

### Computed signals
- Liquidity-to-FDV ratio
- Volume-to-liquidity ratio

### Outputs
- Risk level: Low / Medium / High
- Numeric score (internal transparency)
- Human-readable warnings
- Short explanatory summary

### Key properties
- Same input → same output
- No future-looking language
- No personalization
- No buy/sell or “safety” language

This layer explains structural conditions, not outcomes.

---

## 3. UI & Integration

### Integration point
- Integrated into one calculator only (Profit/Loss)

### UX / reliability guarantees
- Calculator renders instantly
- Phase 2 loads lazily using React Suspense
- Phase 2 failure never blocks the calculator
- Clear visual separation between calculator and context
- Public explanation section: “What is Risk Context?”

### Rollout safety
- Phase 2 is feature-flagged and can be enabled/disabled without redeploying code.

---

## 4. Feature Flag
Set:

```text
NEXT_PUBLIC_PHASE_2=true
```

Operational notes:
- Enabled in production only
- Allows safe rollout and instant rollback
- Internal naming (“Phase 2”) is not customer-facing

---

## 5. Legal & Risk Posture
Current implementation is positioned as:
- Informational
- Educational
- Non-advisory

Safeguards include:
- Deterministic rules
- Transparent explanations
- Explicit disclaimers
- No user data collection
- Privacy Policy and Terms of Service live

This keeps the product outside regulated financial advice.

---

## What Phase 2 deliberately does NOT do
- No predictions or forecasts
- No recommendations or signals
- No personalization
- No portfolio analysis
- No alerts or automation
- No monetisation logic

These are explicitly out of scope and reserved for later phases (if ever).

---

## Mental model (for internal use)
- Calculator = facts
- Decision Context = explanation
- User = decision maker

Nothing crosses that boundary.

---

## Status
Phase 2 is:
- Fully implemented
- Tested with real Ethereum contracts
- Deterministic and explainable
- Publicly enabled behind a feature flag
- Considered complete and frozen

Further changes increase scope and legal complexity and should be treated as a new phase.

