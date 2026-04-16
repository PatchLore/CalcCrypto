# CalcCrypto – Social Sentiment Risk Monitor
## Feature Proposal (Future Roadmap)

### Overview

The Social Sentiment Risk Monitor is an early-warning system for crypto traders.

Instead of tracking only price movements, this feature monitors community discussions across selected platforms (e.g., Reddit, news feeds, public comment streams) to detect sudden spikes in negative risk-related keywords.

The goal is to act as a "Digital Smoke Alarm" for:

- Exchange withdrawal issues
- Liquidity problems
- Scam accusations
- Rug pull signals
- Account freezes
- Regulatory investigations

This feature does not provide financial advice. It provides community signal monitoring.

### Problem Statement

Retail crypto users often discover exchange issues or project failures too late.

By the time mainstream media reports:
- Withdrawals are paused
- Tokens collapse
- Funds are inaccessible

Users need early signals based on:
- Sudden complaint spikes
- Unusual negative language clusters
- Volume-based anomaly detection

CalcCrypto currently focuses on calculation and utility tools. This feature adds risk intelligence and retention value.

### Feature Objectives

- Increase user retention (alerts encourage return visits)
- Expand CalcCrypto beyond calculators into risk monitoring
- Enable recurring monetization (Pro tier)
- Provide lightweight, scalable sentiment detection
- Avoid complex scraping infrastructure initially

### MVP Scope (Phase 1)

#### Supported Assets
- Top 20 cryptocurrencies
- Top 5–10 exchanges

#### Data Sources (API-first approach)
- Reddit API (approved subreddits only)
- Google News RSS feeds
- Public crypto news APIs
- Optional: X/Twitter API if viable

**No unofficial scraping in MVP.**

#### Keyword Detection System

Track predefined risk keywords:

**Exchange Risk Keywords**
- withdrawal
- frozen
- locked
- delayed
- support not responding
- unable to withdraw
- liquidity
- bankruptcy

**Project Risk Keywords**
- scam
- rug
- hacked
- exploit
- investigation
- SEC
- lawsuit
- insolvency

#### Detection Logic (MVP)

- Collect mentions per asset/exchange
- Count keyword frequency within time window
- Compare against rolling baseline average
- If spike exceeds threshold → trigger alert

**Example logic:**
```python
if keyword_frequency_today > (7_day_avg * 2.5):
    trigger_alert()
```

This is anomaly detection, not advanced NLP.

### User Interface Concept

**New Tab in CalcCrypto:**
"Risk Monitor"

**User sees:**
- Asset/Exchange name
- Risk Level Indicator (Green / Yellow / Red)
- Keyword spike summary
- Recent flagged mentions
- Timestamp of last update

**Optional:**
- Toggle for custom watchlist

### Alert System (Phase 2)

**For Pro Users:**
- Email alerts
- Telegram alerts
- In-app push notifications (if PWA)

**Alert example:**
"⚠️ Spike detected: 'withdrawal issues' mentions up 320% for Exchange X in last 24 hours."

### Monetization Strategy

**Free Tier:**
- View current risk status
- Limited asset coverage
- No alerts

**Pro Tier ($5–$9/month):**
- Custom watchlists
- Real-time alerts
- Historical sentiment charts
- Early anomaly detection

### Legal & Compliance Considerations

**Important:**
- Clearly state this is community signal monitoring
- No financial advice
- No guarantee of accuracy
- Avoid defamatory framing

**Suggested disclaimer:**
"Risk indicators are based on publicly available discussion trends and do not constitute financial advice."

### Technical Architecture (High-Level)

**Frontend:**
- Existing CalcCrypto UI
- Risk tab dashboard
- Simple traffic light indicators

**Backend:**
- Scheduled job (cron)
- Fetch API data
- Store counts in Neon DB
- Basic anomaly detection logic

**Deployment:**
- Vercel scheduled functions
- Lightweight DB tables
- No heavy AI dependency in MVP

### Future Enhancements (Phase 3+)

- NLP sentiment scoring
- Exchange health score model
- Historical risk chart
- Community credibility weighting
- AI summarised risk report
- Correlation of sentiment spikes vs price drops

### Strategic Impact on CalcCrypto

**Current Positioning:**
Crypto calculation utility tool.

**With Risk Monitor:**
Crypto utility + risk intelligence dashboard.

**This increases:**
- Stickiness
- Authority perception
- Subscription potential
- Differentiation from generic calculators

### Risks

- API rate limits
- False positives
- Legal sensitivity
- User trust management

**Mitigation:**
- Conservative alert thresholds
- Clear disclaimers
- Transparent data sources

### Summary

The Social Sentiment Risk Monitor transforms CalcCrypto from a transactional calculator tool into a proactive risk intelligence platform.

**It should be built in phases:**
- Phase 1 → Basic anomaly detection
- Phase 2 → Alerts + monetization
- Phase 3 → Advanced sentiment scoring

**This feature aligns with:**
- Crypto volatility trends
- User fear psychology
- Subscription monetization
- Increased user retention