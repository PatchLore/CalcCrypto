'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { computeRiskContext } from '../logic/riskContext';
import { trackPhase2RiskContextViewed } from '../services/analytics';
import { fetchTokenData } from '../services/dexscreener';
import { SUPPORTED_CHAINS, DEFAULT_CHAIN_ID } from '../chains';
import type { Phase2SupportedChain, RiskContext, TokenSnapshot } from '../types/phase2';

const LazyTokenSnapshotPanel = React.lazy(() => import('./TokenSnapshotPanel'));
const LazyRiskContextPanel = React.lazy(() => import('./RiskContextPanel'));

export function Phase2DecisionPanel(props: { calculator: 'token-price' }) {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<Phase2SupportedChain>(DEFAULT_CHAIN_ID);
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

    // Validate format based on chain
    if (selectedChain === 'solana') {
      // Solana addresses are base58, typically 32-44 characters
      if (contractAddress.length < 32 || contractAddress.length > 44) {
        setError('Invalid Solana address format. Address should be 32-44 base58 characters.');
        setSnapshotData(null);
        setRiskData(null);
        return;
      }
    } else {
      // EVM chains: must start with 0x and be 42 characters
      if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
        setError('Invalid address format. Must start with 0x and be 42 hex characters.');
        setSnapshotData(null);
        setRiskData(null);
        return;
      }
    }

    let cancelled = false;

    const debounceTimer = setTimeout(async () => {
      setLoadingSnapshot(true);
      setError(null);
      setSnapshotData(null);
      setRiskData(null);

      try {
        const snapshot = await fetchTokenData(contractAddress, selectedChain);
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
  }, [contractAddress, selectedChain]);

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
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_CHAINS.map((chain) => (
              <button
                key={chain.id}
                type="button"
                onClick={() => {
                  setSelectedChain(chain.id as Phase2SupportedChain);
                  setContractAddress('');
                  setSnapshotData(null);
                  setRiskData(null);
                  setError(null);
                }}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedChain === chain.id
                    ? 'border-crypto-primary-600 bg-crypto-primary-600/10 text-crypto-primary-600'
                    : 'border-crypto-border text-crypto-muted-foreground hover:bg-crypto-muted/20'
                }`}
              >
                <span className="text-xs">{chain.symbol}</span>
                {chain.name}
              </button>
            ))}
          </div>

          <label className="block">
            <div className="text-sm font-medium text-crypto-foreground">
              {selectedChain === 'solana' ? 'Solana token address' : `${selectedChain === 'ethereum' ? 'Ethereum' : selectedChain === 'base' ? 'Base' : selectedChain === 'arbitrum' ? 'Arbitrum' : 'BNB Chain'} contract address`}
            </div>
            <input
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder={selectedChain === 'solana' ? 'Enter Solana token address…' : '0x…'}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" role="region" aria-live="polite" aria-label="Token analysis results">
            <Suspense fallback={<PanelSkeleton title="Token Snapshot" />}>
              <LazyTokenSnapshotPanel data={snapshotData} loading={loadingSnapshot} error={error} chainId={selectedChain} />
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