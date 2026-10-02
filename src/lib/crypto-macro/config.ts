export const THRESHOLDS = Object.freeze({ minimumPairs: 30, history: 250, low: 10, high: 90, divergence: 0.40, reversal: 0.20 });
export const WINDOWS = [30, 90, 180] as const;
export const DISCLOSURE = 'Statistical observations for information only. Correlation does not imply causation. Not financial advice.';
export const CONSENT = 'Email me about the Crypto Macro VIP suite. Unsubscribe any time.';
export const CONSENT_VERSION = '2026-10-02-v1';
export const BASELINE_COMMIT = '19a034c3724b318b04558e4958f30b50bd9b355b';
export function fixturesAllowed(env: Record<string, string | undefined> = process.env): boolean {
  return env.CRYPTO_MACRO_USE_FIXTURES === 'true' && env.NODE_ENV !== 'production'
    && env.VERCEL_ENV !== 'production' && env.VERCEL_ENV !== 'preview';
}
