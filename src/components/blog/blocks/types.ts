/**
 * Typed block components for flagship blog guides.
 *
 * Content stays in Markdown. A block is authored as a fenced code block whose
 * info string is `cc-<block-name>`, with a JSON body:
 *
 *   ```cc-key-takeaway
 *   { "title": "The short version", "points": ["..."] }
 *   ```
 *
 * The `pre` renderer in the post template intercepts these and dispatches to a
 * typed component. Using fenced code rather than raw HTML means no `rehype-raw`
 * dependency and no HTML injection surface, and an unrecognised or malformed
 * block degrades to an ordinary code block rather than breaking the page.
 */

/**
 * Status of a rule, so law is never visually confused with a proposal.
 *
 * The distinctions are deliberately fine-grained: a government revenue
 * announcement, a live bill, and a bill parliament has already voted down are
 * three different things, and collapsing them misleads readers about risk.
 */
export type RuleStatus =
  | 'current-law'
  | 'enacted-future'
  | 'proposed'
  | 'rejected-proposal'
  | 'policy-signal'
  | 'policy-discussion';

export const RULE_STATUS_LABEL: Record<RuleStatus, string> = {
  'current-law': 'Current law',
  'enacted-future': 'Enacted: future effect',
  proposed: 'Proposed, not law',
  'rejected-proposal': 'Proposal rejected',
  'policy-signal': 'Policy signal, not law',
  'policy-discussion': 'Policy discussion',
};

export interface CountryFact {
  label: string;
  value: string;
  /** Optional short qualifier rendered smaller beneath the value. */
  note?: string;
}

export interface CountryCardData {
  country: string;
  flag: string;
  /** One-line positioning, e.g. "Two regimes, no holding-period relief". */
  summary?: string;
  facts: CountryFact[];
  /** Optional footer flag for a pending change. */
  changeNote?: { status: RuleStatus; text: string };
}

export interface CountryComparisonData {
  countries: CountryCardData[];
}

export interface KeyTakeawayData {
  title?: string;
  points: string[];
}

export type CalloutTone = 'info' | 'law' | 'proposed' | 'warning';

export interface CalloutData {
  tone: CalloutTone;
  title: string;
  /** Optional status chip, e.g. "Enacted: future effect". */
  status?: RuleStatus;
  body: string[];
  /** Optional labelled rows, used for "2026 vs 2027" contrasts. */
  rows?: { label: string; text: string }[];
}

export interface TaxActivityJurisdiction {
  country: string;
  flag: string;
  treatment: string;
}

export interface TaxActivityData {
  activity: string;
  icon?: string;
  question?: string;
  jurisdictions: TaxActivityJurisdiction[];
}

export interface TaxActivityGridData {
  activities: TaxActivityData[];
}

export interface TimelineEntry {
  date: string;
  title: string;
  detail: string;
  /** Drives the marker colour and the status chip. */
  status: RuleStatus;
  region?: string;
}

export interface TimelineData {
  items: TimelineEntry[];
}

export interface ExampleScenarioData {
  title: string;
  flag?: string;
  country?: string;
  setup: string;
  steps: { label: string; value: string }[];
  outcome: string;
  caveat?: string;
}

export interface CalculatorCtaData {
  headline: string;
  body: string;
  buttonText: string;
  /** Internal CalcCrypto route. External URLs are rejected at render time. */
  href: string;
}

export interface FaqBlockData {
  title?: string;
  items: { question: string; answer: string }[];
}

export interface SourceEntry {
  authority: string;
  title: string;
  url: string;
  region?: string;
}

export interface SourceListData {
  title?: string;
  sources: SourceEntry[];
}

export interface ProsConsEntry {
  country: string;
  flag: string;
  advantage: string;
  disadvantage: string;
}

export interface ProsConsData {
  entries: ProsConsEntry[];
}

/* ------------------------------------------------------------------ *
 * Runtime guards. Block JSON is authored by hand, so each block is
 * validated before render and reports its own failure rather than
 * throwing during a static build.
 * ------------------------------------------------------------------ */

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

export function isArrayOfRecords(v: unknown): v is Record<string, unknown>[] {
  return Array.isArray(v) && v.every(isRecord);
}

export function str(rec: Record<string, unknown>, key: string): string {
  const v = rec[key];
  return typeof v === 'string' ? v : '';
}

export function optStr(rec: Record<string, unknown>, key: string): string | undefined {
  const v = rec[key];
  return typeof v === 'string' ? v : undefined;
}

const RULE_STATUSES = Object.keys(RULE_STATUS_LABEL) as RuleStatus[];

export function asRuleStatus(v: unknown): RuleStatus {
  return typeof v === 'string' && (RULE_STATUSES as string[]).includes(v) ? (v as RuleStatus) : 'current-law';
}
