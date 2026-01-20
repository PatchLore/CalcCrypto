'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { computeRiskContext } from '../logic/riskContext';
import { trackPhase2RiskContextViewed } from '../services/analytics';
import type { RiskContext, TokenSnapshot } from '../types/phase2';

const LazyTokenSnapshotPanel = React.lazy(async () => {
  const mod = await import('./TokenSnapshotPanel');
  return { default: mod.TokenSnapshotPanel };
});

const LazyRiskContextPanel = React.lazy(async () => {
  const mod = await import('./RiskContextPanel');
  return { default: mod.RiskContextPanel };
});

export function Phase2DecisionPanel(props: { calculator: 'token-price' }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [snapshot, setSnapshot] = useState<TokenSnapshot | null>(null);
  const hasTrackedRef = useRef(false);

  const riskContext: RiskContext | null = useMemo(() => {
    if (!snapshot) return null;
    return computeRiskContext(snapshot);
  }, [snapshot]);

  useEffect(() => {
    if (!riskContext) return;
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;
    trackPhase2RiskContextViewed({
      calculator: props.calculator,
      risk_level: riskContext.riskLevel,
    });
  }, [props.calculator, riskContext]);

  return (
    <section className="mt-8 rounded-xl border border-crypto-border bg-crypto-background/80 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-crypto-foreground">Phase 2 — Decision Context</div>
          <div className="text-xs text-crypto-muted-foreground">Read-only • Deterministic rules • Context, not advice</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-crypto-border px-3 py-2 text-sm text-crypto-foreground hover:bg-white/5"
          onClick={() => setIsOpen(v => !v)}
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4">
          <label className="block">
            <div className="text-sm font-medium text-crypto-foreground">Ethereum contract address</div>
            <input
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x…"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="mt-2 w-full rounded-md border border-crypto-border bg-crypto-background px-3 py-2 text-sm text-crypto-foreground focus:outline-none focus:ring-2 focus:ring-crypto-ring"
            />
          </label>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Suspense fallback={<PanelSkeleton title="Token Snapshot" />}>
              <LazyTokenSnapshotPanel contractAddress={contractAddress} onSnapshotChange={setSnapshot} />
            </Suspense>

            <Suspense fallback={<PanelSkeleton title="Risk Context" />}>
              <LazyRiskContextPanel riskContext={riskContext} />
            </Suspense>
          </div>
        </div>
      )}
    </section>
  );
}

function PanelSkeleton(props: { title: string }) {
  return (
    <section className="rounded-lg border border-crypto-border bg-crypto-background/60 p-4">
      <div className="text-sm font-semibold text-crypto-foreground">{props.title}</div>
      <div className="mt-3 h-4 w-2/3 rounded bg-crypto-muted/40" />
      <div className="mt-2 h-4 w-1/2 rounded bg-crypto-muted/40" />
      <div className="mt-2 h-4 w-3/4 rounded bg-crypto-muted/40" />
    </section>
  );
}

