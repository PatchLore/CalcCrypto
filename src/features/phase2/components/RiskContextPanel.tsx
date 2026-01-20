'use client';

import React from 'react';
import type { RiskContext } from '../types/phase2';

export function RiskContextPanel(props: { riskContext: RiskContext | null }) {
  if (!props.riskContext) {
    return (
      <section className="rounded-lg border border-crypto-border bg-crypto-background/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-crypto-foreground">Risk Context</div>
          </div>
        </div>
        <div className="mt-3 rounded-md border border-crypto-border bg-crypto-muted/40 p-3 text-sm text-crypto-muted-foreground">
          Load a token snapshot to generate risk context.
        </div>
      </section>
    );
  }

  const { riskLevel, score, warnings, summary } = props.riskContext;

  return (
    <section className="rounded-lg border border-crypto-border bg-crypto-background/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-crypto-foreground">Risk Context</div>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge level={riskLevel} />
          <div className="text-xs text-crypto-muted-foreground">score {score}</div>
        </div>
      </div>

      <div className="mt-3 text-sm text-crypto-foreground">
        {summary}
      </div>

      {warnings.length > 0 && (
        <ul className="mt-3 list-disc pl-5 text-sm text-crypto-muted-foreground space-y-1 break-words whitespace-normal">
          {warnings.map((w) => (
            <li key={w} className="break-words whitespace-normal">
              {presentWarning(w)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function presentWarning(warning: string): string {
  // Presentation-only copy mapping. Risk scoring and thresholds remain unchanged.
  if (warning === 'Very low liquidity relative to FDV (liq/FDV < 0.002).') {
    return 'Liquidity is low relative to overall valuation (FDV) (liq/FDV < 0.002).';
  }
  return warning;
}

function RiskBadge(props: { level: RiskContext['riskLevel'] }) {
  const classes =
    props.level === 'low'
      ? 'bg-crypto-success-50 text-crypto-success-600 dark:bg-crypto-success-950 dark:text-crypto-success-400 border-crypto-success-200 dark:border-crypto-success-800'
      : props.level === 'medium'
      ? 'bg-crypto-warning-50 text-crypto-warning-700 dark:bg-crypto-warning-950 dark:text-crypto-warning-400 border-crypto-warning-200 dark:border-crypto-warning-800'
      : 'bg-crypto-error-50 text-crypto-error-700 dark:bg-crypto-error-950 dark:text-crypto-error-400 border-crypto-error-200 dark:border-crypto-error-800';

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${classes}`}>
      {props.level.toUpperCase()}
    </span>
  );
}

