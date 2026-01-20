# CalCrypto — Phase 2 (High Priority)
## Repositioning as an Agent-Driven Crypto Decision Platform

## 1. Current State (Confirmed & Stable)

### Tech Stack (unchanged)
- **Framework**: Next.js (App Router)
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Architecture**: Static-first, client-side calculators

### App Structure

```text
src/
├── app/
│   ├── page.tsx                 // Homepage
│   ├── calculators/
│   │   ├── page.tsx             // Calculators index
│   │   └── [calculator]/page.tsx
│   └── about/page.tsx           // Fixed 404
├── components/ui/*              // Shared UI kit
├── lib/formulas.ts              // Existing calculator logic
├── types/*
└── features/
    └── phase2/
```

### Existing Functionality (Do Not Break)
All calculators remain:
- **client-side**
- **deterministic**
- **local state only**

And the platform continues to have:
- **No auth**
- **No wallets**
- **No transactions**
- **No write actions**

**This is a non-negotiable constraint.**

---

## 2. Phase 2: Strategic Shift (Important)

### Old Mental Model (Discard)
“Add more crypto calculators”

### New Mental Model
“Add crypto decision intelligence around calculators.”

Phase 2 is not about more math.  
It’s about **context, insight, and judgement**.

This is where **Super Gems** come in.

---

## 3. Phase 2 Core Concept
CalCrypto becomes:

> A read-only crypto analysis & decision assistant, powered by agent workflows (Super Gems), layered on top of existing calculators.

Key principle:
- **Calculators = truth layer**
- **Super Gems = interpretation layer**

---

## 4. Phase 2 Architecture (Clean & Safe)

### 4.1 Frontend (Next.js)
Remains mostly unchanged.

Phase 2 UI lives under:
- `src/features/phase2/*`

Exposed to users via:
- **new routes (later)**, or
- embedded panels inside existing calculators

**No calculator logic is modified.**

### 4.2 Data Sources (Read-Only)
- DexScreener API
  - price
  - liquidity
  - FDV
  - 24h volume

(Future-safe: CoinGecko, DefiLlama — optional)

All fetches:
- client-side or edge
- no keys stored
- no user wallets

---

## 5. Phase 2 Super Gems (This Is the Upgrade)
Phase 2 introduces **Agent Modules (Super Gems)** that consume:
- calculator outputs + token snapshot data

These are not UI widgets first — they are **decision engines**.

---

## 6. Super Gem #1 (Phase 2 MVP)
### Token Snapshot & Risk Context Gem
✅ This is already started — correct instinct.

#### Inputs
- Ethereum contract address
- DexScreener snapshot data
- Optional: user-entered assumptions (entry price, size)

#### Outputs
Plain-English summary:
- Liquidity health
- FDV vs liquidity ratio
- Volume consistency

Risk flags:
- thin liquidity
- extreme FDV
- low volume relative to market cap

Confidence level:
- low / medium / high risk

This augments, not replaces, calculators.

---

## 7. Phase 2 Expansion: Decision-Focused Gems

### Super Gem #2 — Take-Profit Reasoning Agent
Inputs:
- current price
- entry price
- position size
- liquidity + volume

Outputs:
- “Taking partial profit here reduces risk by X”
- “Remaining upside vs downside profile”

No financial advice. Just reasoned context.

### Super Gem #3 — Moonbag Logic Agent
Inputs:
- total position
- realised profit
- liquidity constraints

Outputs:
- Suggested moonbag sizing
- Risk-neutral framing (“house money” logic)

### Super Gem #4 — Timing Sensitivity Agent
Inputs:
- volume spikes
- liquidity depth
- recent price action (from API)

Outputs:
- “High slippage risk right now”
- “Low liquidity window — caution”

Still read-only. Still safe.

---

## 8. How Super Gems Integrate Technically (Important)
At this stage, Super Gems can run:
- locally (logic + prompts)
- or via a thin serverless layer later

They do not:
- store user data
- persist identity
- execute trades

This keeps:
- compliance risk low
- complexity low
- shipping speed high

---

## 9. Monetisation Path (Phase 2 → Phase 3)

### Phase 2 (Now)
All Phase 2 Gems:
- visible
- usable
- rate-limited

Soft “Pro” indicators (locked insights)

### Phase 3 (Later)
Pro unlocks:
- deeper explanations
- saved scenarios
- batch token analysis
- alerts (via Super Gems)

---

## 10. Why This Is Now High Priority
CalCrypto Phase 2 now:
- aligns with your Super Gem strategy
- becomes a proof platform
- is no longer “just a calculator”

It can later become:
- a public Super Gem demo
- a marketplace product
- or a lead engine

Most importantly:
> It compounds your skills instead of fragmenting them.

---

## 11. Immediate Next Actions (Concrete)

### Step 1 — Finalise Phase 2 MVP Scope (Today)
Lock:
- Token Snapshot Gem
- Risk Context output
- No new routes yet

### Step 2 — Wire Phase 2 into One Calculator
Example:
- “Position Size Calculator + Risk Context”

Minimal UI. Maximum insight.

### Step 3 — Document It Publicly
This becomes:
- a YouTube build-in-public video
- a SaaSpertise case study
- proof you design agentic systems

---

## Final Framing (Save This)
CalCrypto Phase 2 is not a feature upgrade.  
It is your first public, opinionated **Super Gem** product.

If you want next, we can:
- turn this into a Cursor-ready build checklist
- design the exact UI placement
- decide which Super Gem ships first
- map CalCrypto directly into your SaaSpertise repositioning

