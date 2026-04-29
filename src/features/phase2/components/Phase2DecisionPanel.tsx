'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { computeRiskContext } from '../logic/riskContext';
import { trackPhase2RiskContextViewed } from '../services/analytics';
import { fetchTokenData } from '../services/dexscreener';
import type { RiskContext, TokenSnapshot } from '../types/phase2';

const LazyTokenSnapshotPanel = React.lazy(() => import('./TokenSnapshotPanel'));
const LazyRiskContextPanel = React.lazy(() => import('./RiskContextPanel'));

export function Phase2DecisionPanel(props: { calculator: 'token-price' }) {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [snapshotData, setSnapshotData] = useState<TokenSnapshot | null>(null);
  const [riskData, setRiskData] = useState<RiskContext | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const hasTrackedRef = useRef(false);

  // Debounced auto-trigger effect
  useEffect(() => {
    if (!contractAddress.trim()) {
      setSnapshotData(null);
      setRiskData(null);
      setError(null);
      setLoadingSnapshot(false);
      setLoadingRisk(false);
      return;
    }

    // Validate format: must start with 0x and be 42 characters
    if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
      setError('Invalid address format. Must start with 0x and be 42 characters.');
      setSnapshotData(null);
      setRiskData(null);
      return;
    }

    let cancelled = false;

    const debounceTimer = setTimeout(async () => {
      setLoadingSnapshot(true);
      setError(null);
      setSnapshotData(null);
      setRiskData(null);

      try {
        const snapshot = await fetchTokenData(contractAddress);
        if (cancelled) return;
        
        setSnapshotData(snapshot);
        setLoadingSnapshot(false);

        // Auto-trigger risk assessment
        setLoadingRisk(true);
        const risk = computeRiskContext(snapshot);
        if (cancelled) return;
        
        setRiskData(risk);
        setLoadingRisk(false);
      } catch (err) {
        if (cancelled) return;
        setError('Failed to fetch token data. Please try again.');
        setLoadingSnapshot(false);
        setLoadingRisk(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [contractAddress]);

  // Analytics tracking
  useEffect(() => {
    if (!riskData) return;
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;
    trackPhase2RiskContextViewed({
      calculator: props.calculator,
      risk_level: riskData.riskLevel,
    });
  }, [props.calculator, riskData]);

  const handleRetry = () => {
    setError(null);
    // Re-trigger by setting the same address
    setContractAddress(prev => prev);
  };

  return (
    <section className="mt-8 rounded-xl border border-crypto-border bg-crypto-background/80 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-crypto-foreground">Decision Context</div>
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

          {error && !loadingSnapshot && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={handleRetry}
                className="ml-2 underline hover:text-red-800 focus:outline-none"
              >
                Retry
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Suspense fallback={<PanelSkeleton title="Token Snapshot" />}>
              <LazyTokenSnapshotPanel data={snapshotData} loading={loadingSnapshot} error={error} />
            </Suspense>

            <Suspense fallback={<PanelSkeleton title="Risk Context" />}>
              <LazyRiskContextPanel data={riskData} loading={loadingRisk} error={error} />
            </Suspense>
          </div>
        </div>
      )}
    </section>
  );
}

function PanelSkeleton(props: { title: string }) {
  return (
    <section className="rounded-lg border border-crypto-border bg-crypto-background/60 p-4" role="status" aria-label={`Loading ${props.title}`}>
      <div className="text-sm font-semibold text-crypto-foreground">{props.title}</div>
      <div className="mt-3 h-4 w-2/3 rounded bg-crypto-muted/40 animate-pulse" />
      <div className="mt-2 h-4 w-1/2 rounded bg-crypto-muted/40 animate-pulse" />
      <div className="mt-2 h-4 w-3/4 rounded bg-crypto-muted/40 animate-pulse" />
    </section>
  );
}