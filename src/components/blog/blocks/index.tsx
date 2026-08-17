import type { ReactElement } from 'react';
import { Callout, KeyTakeaway, parseCallout, parseKeyTakeaway } from './Callouts';
import { CountryComparison, parseCountryComparison } from './CountryCards';
import { Timeline, parseTimeline } from './Timeline';
import { TaxActivityGrid, parseTaxActivityGrid } from './TaxActivity';
import { ExampleScenario, ProsCons, parseExampleScenario, parseProsCons } from './ExampleScenario';
import { BlogCalculatorCTA, parseCalculatorCta } from './BlogCalculatorCTA';
import { FaqBlock, SourceList, parseFaqBlock, parseSourceList } from './FaqBlock';

/** Info-string prefix identifying a component block in Markdown. */
export const BLOCK_PREFIX = 'cc-';

/**
 * A block renderer takes the parsed JSON body and returns an element, or null
 * if the payload doesn't match its expected shape.
 */
type BlockRenderer = (raw: unknown) => ReactElement | null;

/**
 * Registry of block name -> renderer. Add new flagship-guide components here;
 * nothing else needs to change for them to become available in Markdown.
 */
const REGISTRY: Record<string, BlockRenderer> = {
  'country-comparison': (raw) => {
    const d = parseCountryComparison(raw);
    return d && <CountryComparison data={d} />;
  },
  'key-takeaway': (raw) => {
    const d = parseKeyTakeaway(raw);
    return d && <KeyTakeaway data={d} />;
  },
  callout: (raw) => {
    const d = parseCallout(raw);
    return d && <Callout data={d} />;
  },
  timeline: (raw) => {
    const d = parseTimeline(raw);
    return d && <Timeline data={d} />;
  },
  'tax-activities': (raw) => {
    const d = parseTaxActivityGrid(raw);
    return d && <TaxActivityGrid data={d} />;
  },
  example: (raw) => {
    const d = parseExampleScenario(raw);
    return d && <ExampleScenario data={d} />;
  },
  'pros-cons': (raw) => {
    const d = parseProsCons(raw);
    return d && <ProsCons data={d} />;
  },
  'calculator-cta': (raw) => {
    const d = parseCalculatorCta(raw);
    return d && <BlogCalculatorCTA data={d} />;
  },
  faq: (raw) => {
    const d = parseFaqBlock(raw);
    return d && <FaqBlock data={d} />;
  },
  sources: (raw) => {
    const d = parseSourceList(raw);
    return d && <SourceList data={d} />;
  },
};

export function isKnownBlock(name: string): boolean {
  return Object.hasOwn(REGISTRY, name);
}

/**
 * Renders a component block. Returns null when the block name is unknown or the
 * JSON is malformed, so the caller can fall back to a plain code block rather
 * than failing the static build.
 */
export function renderBlock(name: string, source: string): ReactElement | null {
  const renderer = REGISTRY[name];
  if (!renderer) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    return null;
  }

  return renderer(parsed);
}

export * from './types';
