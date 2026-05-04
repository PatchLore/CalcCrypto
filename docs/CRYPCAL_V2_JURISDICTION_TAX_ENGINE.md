# CrypCal v2 — Jurisdiction Tax Engine (Accuracy Expansion)

## 🎯 Goal

Evolve CrypCal from a simplified estimator into a jurisdiction-aware tax calculation system with progressively higher accuracy per country.

---

## ⚠️ Key Reality Constraint

100% accuracy is only achievable when:
- The system is restricted per jurisdiction
- All required user inputs are collected
- Full tax rule sets are implemented per country
- Outputs are explicitly tied to a specific tax year + residency status

Without this, the system remains an estimator by definition.

---

## 🧠 Core Design Decision

We choose between two modes:

| Mode | Characteristics |
|------|-----------------|
| **Estimator Mode (current system)** | Fast<br>Simple UX<br>~90–95% practical accuracy<br>No legal complexity handling |
| **Compliance Mode (new upgrade path)** | Country-specific logic engines<br>Full rule sets per jurisdiction<br>User classification inputs required<br>Can reach near-100% accuracy per supported country |

---

## 🏗️ Proposed Architecture

### Country Engine Structure

Each country becomes a full rules module:

```javascript
calculateTax({
  country,
  taxYear,
  residencyStatus,
  traderClassification,
  holdingPeriod,
  trades
})
```

Each module includes:
- income classification rules
- capital gains rules
- exemptions
- thresholds
- edge-case logic

---

## 📊 Accuracy Reality

| Mode | Accuracy | Scope |
|------|----------|-------|
| Estimator Mode | 90–95% | Global |
| Compliance Mode | ~100% | Per-country only |

---

## 🚨 Important Product Insight

Trying to make global + 100% accurate is impossible because:
- rules conflict between jurisdictions
- definitions differ legally
- inputs required vary per country

> 👉 Accuracy increases only by narrowing scope, not expanding it

---

## 🧭 Recommended Roadmap

| Phase | Implementation |
|-------|----------------|
| **Phase 1** | UK full compliance engine (highest trust market) |
| **Phase 2** | US (LT/ST capital gains full logic) |
| **Phase 3** | 3–5 additional countries (EU/AU simplified compliance modules) |
| **Phase 4** | Global estimator fallback (non-compliant countries) |

---

## 💡 Strategic Outcome

CrypCal evolves into:

> **"Hybrid crypto tax system: estimator globally, compliance-grade per jurisdiction"**

---

## 🧠 Final Insight

If your goal is:
- speed + UX → estimator wins
- trust + accuracy → country-specific engines win
- scalability → hybrid model is required