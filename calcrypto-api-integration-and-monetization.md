# CalcCrypto — API Integration Feature Ideas

Candidate data sources: DexScreener API (free, keyless, best for micro-cap/DEX-only tokens) and CoinMarketCap API (free Basic tier, best for established coins with broader metadata).

## 1. Live "what's this worth" calculator (core use case)
Convert any amount of a token into USD/BTC/ETH in real time. DexScreener covers micro-caps CMC won't list; CMC covers majors. Directly matches the site's core premise.

## 2. Portfolio / DCA calculator with live prices
User enters an entry price/date manually (free tiers don't provide historical data), current price pulled live via API to show live P&L.

## 3. Liquidity / rug-risk checker for micro-caps
DexScreener-powered widget showing liquidity depth, 24h volume, and pool size alongside any calculation, useful safety context for low-cap tokens.

## 4. Multi-token comparison tool
Side-by-side calculator for 2-3 tokens at once, live price/market cap for each, refreshed on a timer.

## 5. "Trending on DEX" ticker/widget
Free, keyless DexScreener trending/boosted endpoints as a sidebar widget, engagement + content angle.

## 6. Gas-adjusted profit calculator
Combine token price with rough network fee data so users see net profit after fees on a trade.

## 7. Price alerts / watchlist (later-stage)
Not doable on free tiers, needs a paid plan or a polling cron job. Flag as a future phase.

### Suggested build order
Start with #1 (core calculator) and #3 (liquidity/risk context), DexScreener as primary feed for speculative/micro-cap tokens, CoinMarketCap as secondary lookup for blue-chip names.

---

# CalcCrypto — Monetization Deep Research Prompt

Ready to run whenever, refined with near-term/long-term balance, FCA-weighted compliance scope, and both crypto-native and mature-adjacent (mortgage/forex calculator) comparisons.

```
Research monetization strategies for CalcCrypto.com, a UK-based cryptocurrency
calculator and converter website with an existing loyal YouTube audience
crossover. Currently running a single a-ads.com ad unit, homepage copy
references "no ads" (inconsistency to note, not fix). Site consists of
individual crypto calculator/converter tools (mining profitability, staking
returns, currency conversion, etc.) plus SEO/AEO-driven explainer content
attached to each tool.

Investigate and compare:

1. Affiliate/referral programs relevant to crypto calculator traffic
   specifically: crypto tax software affiliates (Koinly, CoinTracker,
   CoinLedger), hardware wallet affiliates (Ledger, Trezor), and mining
   hardware/cloud mining affiliates if relevant to the mining calculators.
   Commission structures and typical EPC (earnings per click) for crypto
   niches.

   DO NOT investigate or propose exchange sign-up affiliates (Binance,
   Coinbase, Kraken, Bybit or any other exchange). That line is ruled out
   permanently on compliance grounds, see "Exchange affiliates: ruled out"
   below. Do not reintroduce it as an option in any future research pass.

2. Programmatic advertising alternatives to a-ads.com for crypto-niche sites:
   Google AdSense crypto policy restrictions, crypto-specific ad networks
   (A-ADS, Coinzilla, Bitmedia), realistic RPM benchmarks for crypto
   calculator/tool traffic vs content traffic.

3. Direct sponsorship or native placement opportunities: crypto exchanges,
   wallets, or tax software sponsoring specific calculator pages or
   "powered by" placements, and how comparable calculator/tool sites
   (mortgage calculators, currency converters) have monetized via direct deals.

4. Premium/freemium tool tiers: what calculator-based sites successfully
   gate behind a paywall or email capture (e.g. saved calculations, API
   access, advanced/bulk calculators, portfolio tracking) versus what
   should stay free for SEO/traffic purposes.

5. Email list monetization: using calculator usage as a lead-gen point for
   a newsletter, then monetizing the list via affiliate offers or
   sponsorships, given the existing YouTube audience already trusts this
   creator.

6. API/data licensing: whether the calculator logic or aggregated usage
   data has any resale value to third parties (fintech apps, other crypto
   sites, researchers).

7. Timing consideration: current Bitcoin price momentum (Aug 2026) and
   whether monetization approaches should be weighted toward capturing a
   near-term traffic spike (fast-to-implement affiliate/ad options) versus
   longer-term structural monetization (premium tiers, sponsorships) that
   takes longer to set up.

For each option, estimate realistic revenue potential for a solo-operator
site with moderate but growing organic + YouTube-referred traffic,
implementation effort, and any UK-specific regulatory or compliance
considerations for crypto-adjacent advertising and affiliate promotion.

Framing notes:
- Weight the writeup toward near-term first (quick wins deployable in days)
  while still covering longer-term structural options, rather than treating
  them as equal priority.
- Compliance: go deep on UK FCA financial promotion rules for promoting
  exchanges/crypto products (higher risk area), cover GDPR/data usage for
  lead capture and email monetization as a lighter checklist (standard
  practice, lower risk).
- Comparable sites: keep crypto-native calculator sites as the primary
  comparison, but explicitly include mature adjacent categories (mortgage
  calculators, forex converters) since they have more battle-tested
  monetization playbooks crypto-native sites haven't tried yet.
```

---

# CalcCrypto — Monetization Research Findings (two reports run Aug 2026)

Two independent research passes came back. They agree on the overall shape (affiliate + ad network swap first, premium/email/sponsorship later, API licensing last) but disagree on some specific numbers, flagged below where it matters.

## FCA compliance, the part to get right before anything else

This is the load-bearing constraint on the whole plan, both reports treat it as such.

### Exchange affiliates: ruled out (decision, not an open question)

**Status: permanently excluded. Do not re-propose in any future audit, research pass or monetisation review.**

Exchange sign-up and referral affiliates (Binance, Coinbase, Kraken, Bybit, and any equivalent) are dropped from the CalcCrypto monetisation plan entirely.

Reason: promoting a qualifying cryptoasset to UK consumers is a regulated financial promotion. It can lawfully be made only by an FCA-authorised person or approved by one through the regulatory gateway. CalcCrypto is neither. Communicating an unapproved financial promotion is a criminal offence under section 21 of the Financial Services and Markets Act 2000, not a civil or reputational matter. The exposure is not proportional to the revenue, and no framing, disclaimer or "neutral comparison" wording makes an unauthorised promotion lawful.

Scope of the exclusion:
- No exchange affiliate or referral links anywhere on the site.
- No "sign up here", "start investing", "set up recurring buys" or equivalent calls to action pointing at an exchange, whether or not a commission is earned. A financial promotion does not require payment to exist; an inducement is enough.
- No sponsored or paid placements from exchanges.

What remains permitted, and why it is a different category:
- **Tax software affiliates (Koinly, and comparable)**: an ancillary compliance service, not a qualifying cryptoasset and not an inducement to invest. Assessed as low risk and currently live.
- **Hardware wallet affiliates (Ledger, Trezor)**: custody hardware, not an investment call to action. Lower risk, though not yet assessed in detail.
- **Programmatic display advertising**: no investment inducement authored by CalcCrypto.

This section exists so the decision survives staff turnover, future audits and future research prompts. If it is ever revisited, that must start from taking regulatory advice, not from a revenue estimate.

- Since October 2023, any promotion of a "qualifying cryptoasset" (includes Bitcoin, Ethereum, and most tokens) to UK consumers is regulated by the FCA. This applies to affiliate links, sponsored content, and explainer copy, not just paid ads, and it applies even to overseas firms if the promotion reaches UK consumers.
- Promotions can only lawfully be made by an FCA-authorised person, or approved by one via the "regulatory gateway." As a sole proprietorship, CalcCrypto can't self-approve promotions for others, this is the single biggest structural constraint on affiliate marketing.
- The two source reports disagreed on whether exchange affiliate programmes could be used if framed carefully. That question is now closed: exchange affiliates are ruled out entirely. See "Exchange affiliates: ruled out" below.
- The mandatory risk warning wherever a crypto promotion appears: *"Don't invest unless you're prepared to lose all the money you invest. This is a high-risk investment and you are unlikely to be protected if something goes wrong. Take 2 mins to learn more."* Must be prominent, not buried.
- Lower-risk affiliate categories (both reports agree): tax software (Koinly, CoinLedger, CoinTracker) and hardware wallets (Ledger, Trezor) are ancillary services, not direct investment calls-to-action, and sit in a meaningfully safer compliance position than exchange affiliates.
- FCA enforcement is active and increasing, first enforcement action against an offshore platform was Feb 2026, plus a coordinated crackdown on unlicensed peer-to-peer trading platforms. Not a theoretical risk.
- Email marketing: UK PECR/GDPR requires freely-given, specific, informed opt-in, no pre-ticked boxes. Double opt-in is the ICO's recommended "strong evidence of valid consent" standard.

## Near-term quick wins (days to implement)

| Channel | Report 1 estimate | Report 2 estimate | Notes |
|---|---|---|---|
| Tax software affiliates (Koinly/CoinLedger/CoinTracker) | $50-300/mo | £500-2,500/mo | Both agree this is the safest, most natural fit. Wide estimate spread, treat as directional not precise. |
| Hardware wallet affiliates (Ledger/Trezor) | $50-200/mo | £300-1,500/mo | Low regulatory risk, natural fit on mining calculator pages. |
| Ad network swap off A-ADS | Coinzilla/Bitmedia, $50-500/mo, 5-15x current RPM | Mediavine/Raptive, £2,000-8,000/mo via RPM uplift ($15-25 vs $3-5) | Big gap between reports, one assumes crypto-niche networks, the other assumes premium general publisher networks. Worth checking whether Mediavine/Raptive even accept crypto-content sites before banking on the higher number. |

Both reports flag the same first move regardless of exact numbers: replace the single A-ADS unit and add tax software + hardware wallet affiliate links this week, low effort, low compliance risk, revenue starts immediately.

## Medium-term structural (weeks to a few months)

- **Email list via calculator usage**: post-calculation prompt to save results or get notified of parameter changes (network difficulty, staking APY, exchange rates). YouTube-driven traffic converts to email signup 3-5x better than cold organic. Lead magnet conversion benchmarks cited around 23%. Double opt-in required for compliance.
- **Premium/freemium tier**: core calculators stay free (they're the SEO engine, never gate these). Gate saved calculations, bulk/multi-scenario calculation, portfolio tracking, and API access behind a £5-10/month tier or an email-capture soft gate. Free-to-paid conversion benchmarks are low (0.35-2.8%) but a stable recurring line once list size grows.
- **Direct sponsorships**: "Powered by [Exchange]" or "Powered by [Wallet]" placements on specific calculator pages. Both reports point to mortgage/forex calculator sites as the proven playbook for this exact model. Requires a media kit with real traffic data, so this comes after the affiliate/ad baseline is established, not before. YouTube cross-sell angle is a genuine advantage here, existing finance-niche YouTube CPMs plus a bundled web placement deal is a real lever unique to this project.

## Long-term / lower priority

- **API/data licensing**: both reports agree this is the weakest near-term option. Calculator logic is easily replicated (open-source alternatives exist), and usage data volume from a moderate-traffic solo site is unlikely to be commercially meaningful yet. Treat as a premium-tier feature (API access as a paid perk) rather than a standalone B2B data business. Revisit only after significant scale.

## Suggested action order (synthesized from both reports)

1. **This week**: add tax software + hardware wallet affiliate links to relevant calculator pages, with compliant neutral framing and risk warnings. Investigate whether a premium ad network (Mediavine/Raptive) will actually accept a crypto site before committing to that path over crypto-native networks (Coinzilla/Bitmedia).
2. **Weeks 2-4**: add email capture on calculator completion, double opt-in, start weekly/bi-weekly newsletter.
3. **Month 2-3**: build 1-2 premium features (saved calculations, bulk calculator) behind a low-cost tier; start compiling a media kit from real GA4/traffic data for future sponsorship outreach.
4. **Month 3+**: begin direct sponsorship conversations once there's a real media kit to show; treat API/data licensing as a distant, scale-dependent option, not a near-term priority.

**Open item before acting on exchange affiliates specifically**: get clarity on the bonus/incentive conflict above, worth a direct read of the FCA's actual "ban on incentives to invest" text before placing any exchange links, since the two reports disagree and this is the highest-risk category.
