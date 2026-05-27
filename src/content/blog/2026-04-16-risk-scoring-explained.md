---
title: "Understanding Our Deterministic Risk Scoring System"
date: "2026-04-16"
excerpt: "No black boxes, no AI guesswork — just transparent, deterministic math that you can verify. Learn how our three-signal risk model works and what each score means."
image: "/blog-images/risk.jpg"
---

How We Detect Crypto Risks — Transparent, Deterministic and Free

As we continue building CalCrypto's Phase 2 risk intelligence features, we want to share detailed insights into how our risk detection system works. This is not about market prediction or trading signals — it is about providing clear, deterministic, and verifiable risk context that any trader can understand and use in their own analysis.

Why Deterministic Risk Scoring Matters

Most risk assessment tools in crypto rely on proprietary algorithms, machine learning models, or subjective analyst opinions. These approaches share a fundamental problem: you cannot independently verify the results. If two different people analyse the same token at the same time, they might get different scores, and neither can explain exactly why.

CalCrypto's approach is fundamentally different. Our risk scoring is fully deterministic — the same contract address always produces the same risk score, every single time. Every factor that contributes to the score is transparent and documented. No AI black boxes, no hidden weighting systems, no guesswork. This allows you to understand exactly why a token received its score and to verify the analysis independently.

Understanding Risk in Crypto

Cryptocurrency risk comes in many forms, and different types of risk affect different trading strategies and investment horizons:

**Smart contract vulnerabilities**: Bugs or exploits in a token's underlying smart contract code can lead to loss of funds. While we do not perform code audits, our on-chain analysis can flag contracts with unusual functions or upgradeability patterns that may warrant further investigation.

**Liquidity issues**: A token may have a high price but very thin order books, meaning large trades cause significant slippage. Low liquidity relative to market capitalisation is one of the most common risk factors for smaller tokens and can be exploited by whales or coordinated groups.

**Market manipulation**: Wash trading, spoofing, and pump-and-dump schemes are unfortunately common in crypto markets. Our volume analysis can flag tokens where trading activity appears inconsistent with normal market behaviour.

**Concentrated ownership**: Tokens where a small number of wallets hold a large percentage of the supply are vulnerable to coordinated sell-offs or governance attacks. Our analysis examines holder distribution patterns to identify excessive concentration.

Our Three-Signal Risk Assessment Framework

The risk scoring engine evaluates three independent signals, each measuring a different aspect of token health:

1. Liquidity Depth (Signal 1)

Liquidity depth measures the total USD value of tokens available in decentralised exchange pools. This is the most direct measure of a token's actual trading viability. Higher liquidity means larger trades can execute without meaningful price impact.

The threshold analysis works as follows:
- **Strong liquidity**: Pools with over $1 million in total liquidity receive the highest score in this category, indicating that normal-sized trades are safe.
- **Moderate liquidity**: Pools with $100,000 to $1 million have adequate depth for smaller trades but may show slippage on larger orders.
- **Weak liquidity**: Pools under $100,000 can experience significant slippage even on modest trades and are more susceptible to manipulation.

2. Liquidity vs Fully Diluted Valuation (Signal 2)

This ratio compares available on-chain liquidity against the token's fully diluted valuation. It answers a crucial question: if all token holders tried to sell simultaneously, how much of that sell pressure could the available liquidity absorb?

- **Healthy ratio**: Liquidity above 10% of FDV suggests the market can handle normal trading activity without extreme price dislocations.
- **Moderate ratio**: Liquidity between 1% and 10% of FDV means the token is moderately liquid but could be vulnerable to coordinated selling.
- **Low ratio**: Liquidity below 1% of FDV is a significant red flag. The market price could potentially be moved dramatically with relatively modest trade sizes.

3. Volume vs Liquidity Ratio (Signal 3)

This ratio measures how actively a token trades relative to its available pool depth. It helps identify both tokens with no genuine trading interest and tokens with potentially artificial volume.

- **Balanced ratio**: Daily volume between 10% and 200% of liquidity suggests normal organic trading activity.
- **Low activity**: Volume below 10% of liquidity suggests the token has little genuine trading interest, which can make it difficult to enter or exit positions.
- **Elevated ratio**: Volume above 200% of daily liquidity can indicate potential wash trading or artificial volume generation. It can also occur naturally during high-volatility events.

How Scores Are Calculated

Each of the three signals is scored independently using predefined thresholds. The three scores are combined using a weighted formula to produce the final context level:

- **Low Risk Context**: All three signals are in the healthy range. The token has strong liquidity, reasonable liquidity relative to its valuation, and normal trading activity.
- **Medium Risk Context**: One or two signals are elevated. The token may have adequate liquidity but a high FDV ratio, or good fundamentals but unusual volume patterns.
- **High Risk Context**: Multiple signals flag concerns. The token likely has weak liquidity, a very unfavourable liquidity-to-FDV ratio, or suspicious volume patterns.

Each score comes with a detailed, plain-English explanation of which signals were triggered and why. No numerical score is hidden behind a proprietary formula — every component is documented.

Integration with Our Calculators

The real power of our risk intelligence comes from its integration with the existing CalCrypto calculator suite. You can analyse a token's risk profile and immediately model different trading scenarios:

- Use the **Profit & Loss Calculator** to set target entries and exits based on risk context.
- Use the **DCA Calculator** to plan gradual accumulation strategies that reduce timing risk.
- Use the **Tax Calculator** to understand the tax implications of trading higher-risk tokens more frequently.

Privacy and Security First

Just like all of our calculators, the risk intelligence features follow the same principles:
- All analysis runs entirely client-side in your browser
- No token addresses, wallet data, or user information is stored on our servers
- No accounts, no signups, no email required
- Fully deterministic and reproducible results

*Want to explore our current calculators? [Check them out here](/calculators).*