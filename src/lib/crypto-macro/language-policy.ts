export const BANNED = /\b(?:buy|sell|long|short|target|signal|forecast|prediction|bullish|bearish|will\s+rise|will\s+fall|go\s+long|go\s+short)\b/i;
export const FIXED_ALLOWLIST = ['not a trading signal', 'not a prediction', 'not a forecast', 'not financial advice'];
export function languageAllowed(text: string, fixed = false): boolean {
  let input = text;
  if (fixed) for (const phrase of FIXED_ALLOWLIST) input = input.replace(new RegExp(`\\b${phrase}\\b`, 'gi'), '');
  return !BANNED.test(input);
}
