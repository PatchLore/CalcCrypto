# CalCrypto Phase 2 — Breakdown & Execution Checklist
*(Super Gems–Driven Upgrade | Final Spec with Refinements)*

## 1. Purpose of This Document
This document defines exactly what Phase 2 is, what it is not, and how to execute it cleanly using Cursor — without breaking the existing CalCrypto app.

This is the single source of truth for Phase 2.  
If something is not in this document, it is out of scope.

## 2. Phase 2 Goal (Lock This In)

### One-sentence goal
Upgrade CalCrypto from a pure crypto calculator into a **read-only crypto decision assistant**, using **Super Gem–style deterministic logic** layered on top of existing calculators.

### What success looks like
- Existing calculators still work unchanged
- One calculator shows Token Snapshot + Risk Context
- Risk output is deterministic and explainable
- Phase 2 streams in after calculator loads
- Phase 2 is demoable, explainable, and monetisable
- No scope creep

## 3. Non-Negotiable Constraints (Do Not Break)
- ❌ Do NOT change existing calculator math
- ❌ Do NOT add wallets, auth, or transactions
- ❌ Do NOT store user data
- ❌ Do NOT introduce dashboards or charts
- ❌ Do NOT add predictions or buy/sell advice
- ❌ Do NOT over-engineer monetisation
- ✅ Read-only data only
- ✅ Phase 2 must be fully isolated
- ✅ Existing pages must remain unaffected
- ✅ Risk logic must be deterministic (no “AI guessing”)

If a change violates this section → do not do it.

## 4. Current App Context (Assumed State)

### Stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Deployed on Vercel

### Structure
- `src/app/*`
- `/calculators/*`
- `/about/page.tsx`
- `src/lib/formulas.ts`
- `src/components/ui/*`
- `src/types/*`
- `src/features/phase2/*`

### Status
- Existing calculators run client-side
- Phase 2 folder exists but is not wired into routes
- DexScreener fetch already tested in isolation
- Turbopack disabled locally for stability

## 5. Phase 2 Architecture (Mental Model)
- Calculators = Truth layer
- Super Gems = Interpretation layer

Phase 2 does not replace calculators.  
It explains what the numbers mean.

## 6. Phase 2 Feature Breakdown (MVP — ONLY)

### ✅ Feature 1 — Token Snapshot

#### Input
- Ethereum contract address

#### Fetches (read-only)
- price (USD)
- liquidity (USD)
- FDV
- 24h volume

#### Handles
- loading
- invalid address
- unsupported chain
- API failure

### ✅ Feature 2 — Risk Context Super Gem (Core)
Consumes Token Snapshot data. Produces deterministic interpretation.

#### Outputs
- risk level: low | medium | high
- warnings array (plain English)
- short explanatory summary

#### Rules
- No predictions
- No buy/sell advice
- No future price language
- Explanation only
- Same inputs → same outputs (always)

### ✅ Feature 3 — Integration into ONE Calculator

#### Chosen calculator
- Token price / return calculator (**locked choice**)

#### Rules
- Calculator logic remains untouched
- Phase 2 panel is:
  - optional
  - visually separated
  - non-blocking
  - collapsible if needed
- Phase 2 can be feature-flagged on/off

## 7. Deterministic “Vibe-Check” Risk Model (Mandatory)
Risk Context must be **point-based**, not heuristic or “AI-felt”.

### Derived metrics
- liquidityUSD
- fdvUSD
- volume24hUSD
- liqToFdv = liquidity / fdv
- volToLiq = volume / liquidity

### Example scoring system (guideline)

#### Liquidity
- < $50k → +35
- $50k–$250k → +20
- $250k–$1m → +10
- $1m+ → +0

#### FDV vs Liquidity
- liqToFdv < 0.002 → +25
- 0.002–0.01 → +15
- 0.01–0.03 → +5
- 0.03+ → +0

#### Volume Quality
- volToLiq < 0.05 → +20
- 0.05–0.2 → +10
- 0.2–1.0 → +0
- 1.0+ → +10

### Risk mapping
- Score 0–24 → Low
- Score 25–54 → Medium
- Score 55+ → High

Warnings and summaries must be generated from triggered rules, not free-text AI output.

## 8. Streaming UI Requirement (Premium Feel)
- Calculator loads instantly
- Phase 2 panel streams in afterwards
- Use React Suspense for:
  - Token Snapshot
  - Risk Context panel
- Skeleton or fallback UI required
- Phase 2 failure must NOT block calculator

## 9. Feature Flag (Safe Rollout)
Phase 2 must be toggleable.

```ts
// src/features/phase2/config.ts
export const FEATURE_FLAGS = {
  PHASE_2_ENABLED: process.env.NEXT_PUBLIC_PHASE_2 === 'true'
}
```

Phase 2 UI is gated at the integration point.

When disabled:
- Calculator behaves exactly as before

Used for safe production testing.

## 10. Folder & Code Structure (Strict)

```text
src/features/phase2/
├── components/
│   ├── TokenSnapshotPanel.tsx
│   └── RiskContextPanel.tsx
├── logic/
│   └── riskContext.ts
├── services/
│   ├── dexscreener.ts
│   └── analytics.ts
├── types/
│   └── phase2.ts
├── config.ts
└── index.ts
```

All Phase 2 logic lives here.  
No leakage into calculator logic.

## 11. Minimal Analytics (One Event Only)
Allowed: one lightweight engagement signal

```ts
trackEvent('phase2_risk_context_viewed', {
  calculator: 'token-price',
  risk_level: result.riskLevel
})
```

Rules:
- No wallet addresses
- No contract addresses
- No user identifiers
- No persistence

This is for early signal only, not tracking users.

## 12. Detailed Build Checklist (Cursor-Friendly)

### A. Data Layer
- Create DexScreener fetch service
- Normalise API response
- Guard against partial / missing data
- Read-only, no API keys

### B. Super Gem Logic
- Accept Token Snapshot input
- Compute derived ratios
- Apply deterministic scoring
- Generate warnings + summary
- Zero randomness

### C. UI Components
- Token Snapshot panel with clear states
- Risk Context panel with:
  - badge
  - bullet warnings
  - short explanation
  - “Context, not advice” label

### D. Calculator Integration
- Token price calculator only
- Phase 2 optional and non-blocking
- Feature-flagged
- No calculator logic changes

## 13. Testing Checklist

### Functional
- Valid ETH contract
- Invalid contract
- Unsupported chain
- Zero liquidity
- API failure

### Regression
- All calculators still work
- No console errors
- No hydration warnings

## 14. Stop Conditions (Very Important)
Phase 2 is DONE when:
- One calculator shows Snapshot + Risk Context
- Risk output is deterministic
- Calculator logic unchanged
- Phase 2 streams in cleanly
- Feature is demoable on video
- Code is isolated and clean

Do NOT add (Phase 3):
- auth
- pricing
- alerts
- saved scenarios
- portfolio tracking

## 15. Demo Script (Pre-Defined — 60s)
- Show existing calculator working
- Enter ETH contract address
- Display Token Snapshot
- Risk Context panel streams in
- Show 2–3 prepared tokens (low / medium / high)
- Close with:
  - “Math is truth. Super Gems are interpretation.”

## 16. Strategic Reminder
CalCrypto Phase 2 is not a feature upgrade.  
It is public proof of Super Gem–style decision intelligence.

Ship it small.  
Ship it clean.  
Ship it fast.

