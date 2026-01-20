# CalCrypto Mobile App Strategy
*(Android & iOS — Wrapper-First Approach)*

## 1. Purpose of This Document
This document defines how CalCrypto will become a mobile app, what approach will be used, and—most importantly—what will **NOT** be built yet.

This is a forward-looking implementation plan, not an immediate build mandate.

It exists to:
- Keep mobile work aligned with CalCrypto Phase 2
- Prevent premature native rewrites
- Ensure App Store–safe architecture
- Allow fast conversion from web → app when ready

## 2. High-Level Decision (Locked)
CalCrypto will **NOT** be rewritten as a native app at this stage.

CalCrypto **WILL** be converted into a mobile app by **wrapping the existing web app**.

This preserves:
- One codebase
- Faster iteration
- Lower cost
- Lower risk

## 3. Approved Mobile Approaches (In Order)

### Phase A — Progressive Web App (PWA) ✅
- **Status**: Allowed immediately
- **Purpose**: Early mobile validation

Benefits:
- Installable on Android & iOS
- Zero app store friction
- Instant updates
- Minimal configuration

This is the first mobile step.

### Phase B — Web App Wrapper (Primary Path) ✅
- **Tool of choice**: Capacitor (Ionic)

Benefits:
- Wraps existing Next.js app in a native shell
- Produces Android (`.apk`/`.aab`) and iOS (`.ipa`)
- App Store & Play Store compatible
- Access to native APIs later (push, haptics, etc.)

This is the official mobile app strategy.

### Phase C — Full Native Rewrite ❌ (Not Approved)
Not allowed until:
- Proven mobile demand
- Clear monetisation
- Strong need for native-only features

## 4. Why This Strategy Fits CalCrypto
CalCrypto’s architecture is already mobile-safe by design:
- Read-only data
- No wallets
- No auth
- No storage
- No background processing
- Deterministic logic
- “Context, not advice” positioning

This significantly reduces:
- App Store rejection risk
- Compliance complexity
- Ongoing maintenance

## 5. Impact on Current Codebase

### What changes are allowed
- Add PWA manifest
- Add splash/loading screens
- Minor navigation safeguards
- Environment-based config (already used in Phase 2)

### What must NOT change
- ❌ Calculator logic
- ❌ Phase 2 Super Gem logic
- ❌ API behavior
- ❌ Routing structure
- ❌ App Router assumptions

The mobile app must behave identically to the web app.

## 6. Phase 2 Compatibility (Important)
Phase 2 must remain compatible with mobile:
- Streaming UI via Suspense is encouraged
- Phase 2 panels must be non-blocking
- Feature flags must work in wrapped environments
- “Context, not advice” labels must remain visible
- No Phase 2 feature should require native APIs

## 7. Planned Mobile Rollout (When Activated)

### Step 1 — Enable PWA
- Add `manifest.json`
- Add app icons
- Test install on:
  - Android Chrome
  - iOS Safari

### Step 2 — Android Wrapper (First Store)
- Wrap with Capacitor
- Submit to Google Play
- Soft launch (internal testing or limited rollout)

### Step 3 — iOS Wrapper (After Signal)
- App Store submission
- Same wrapped app
- Same codebase

## 8. Monetisation (Explicitly Out of Scope for Now)
Mobile app will launch as:
- Free
- Read-only
- Same functionality as web

Future monetisation (Phase 3+):
- Premium Super Gems
- Daily insights
- Subscriptions

No monetisation work should block mobile wrapping.

## 9. App Store Safety Notes (Why This Works)
- No financial advice claims
- No transactions
- No wallets
- No user accounts
- No personal data storage
- No background tracking

This dramatically improves approval odds on both stores.

## 10. Stop Conditions (Very Important)
Do NOT begin mobile wrapping if:
- Phase 2 is not complete
- Phase 2 spec is still changing
- Core calculator behavior is unstable

Mobile work starts only after Phase 2 is shipped and demoed.

## 11. Summary (Lock This In)
- CalCrypto will become an Android & iOS app
- The app will be a wrapped web app
- No native rewrite
- No premature optimisation
- Phase 2 architecture already supports mobile
- Mobile is a distribution layer, not a product rewrite

## 12. Cursor Instruction
If mobile work is started later, use this instruction:

> “Wrap the existing CalCrypto web app for mobile using Capacitor.  
> Do not rewrite logic.  
> Do not modify calculators or Phase 2 Super Gems.  
> Treat mobile as a shell only.”

