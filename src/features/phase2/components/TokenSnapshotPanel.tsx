'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchTokenSnapshotFromDexScreener, formatPhase2CompactUsd, formatPhase2Usd, isPhase2EvmContractAddress } from '../services/dexscreener';
import { Phase2Error, type TokenSnapshot } from '../types/phase2';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function TokenSnapshotPanel(props: {
  contractAddress: string;
  onSnapshotChange?: (snapshot: TokenSnapshot | null) => void;
}) {
  const address = props.contractAddress.trim();

  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<TokenSnapshot | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const isValidOrEmpty = useMemo(
    () => address.length === 0 || isPhase2EvmContractAddress(address),
    [address]
  );

  const resolveErrorMessage = (err: unknown): string => {
    if (err instanceof Phase2Error) return err.message;
    if (err instanceof Error && err.name === 'AbortError') return 'Request cancelled.';
    if (err instanceof Error) return err.message;
    return 'Unexpected error.';
  };

  useEffect(() => {
    props.onSnapshotChange?.(snapshot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot]);

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    requestIdRef.current += 1;

    setErrorMessage(null);
    setSnapshot(null);

    if (address.length === 0) {
      setStatus('idle');
      return;
    }
    if (!isPhase2EvmContractAddress(address)) {
      setStatus('error');
      setErrorMessage('Invalid address format (expected 0x + 40 hex characters).');
      return;
    }

    const requestId = requestIdRef.current;
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');

    void (async () => {
      try {
        const data = await fetchTokenSnapshotFromDexScreener(address, { signal: controller.signal });
        if (requestIdRef.current !== requestId) return;
        setSnapshot(data);
        setStatus('success');
      } catch (err) {
        if (requestIdRef.current !== requestId) return;
        if (controller.signal.aborted) return;
        setStatus('error');
        setErrorMessage(resolveErrorMessage(err));
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    })();

    return () => controller.abort();
  }, [address]);

  return (
    <section className="rounded-lg border border-crypto-border bg-crypto-background/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-crypto-foreground">Token Snapshot</div>
          <div className="text-xs text-crypto-muted-foreground">Ethereum</div>
        </div>
      </div>

      {!isValidOrEmpty && (
        <div className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-crypto-foreground">
          Invalid address format (expected 0x + 40 hex characters).
        </div>
      )}

      {status === 'idle' && (
        <div className="mt-3 rounded-md border border-crypto-border bg-crypto-muted/40 p-3 text-sm text-crypto-muted-foreground">
          Enter a contract address to load the snapshot.
        </div>
      )}

      {status === 'loading' && (
        <div className="mt-3 rounded-md border border-crypto-border bg-crypto-muted/40 p-3 text-sm text-crypto-muted-foreground">
          Loading snapshot…
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-crypto-foreground">
          {errorMessage ?? 'Failed to load snapshot.'}
        </div>
      )}

      {status === 'success' && snapshot && (
        <div className="mt-4 space-y-3">
          <div className="text-sm text-crypto-foreground">
            <span className="font-semibold">{snapshot.baseToken.symbol}</span>
            <span className="text-crypto-muted-foreground"> • </span>
            <span className="text-crypto-muted-foreground">{snapshot.baseToken.name}</span>
          </div>
          <div className="text-xs text-crypto-muted-foreground break-all font-mono">
            {snapshot.baseToken.address}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Metric label="Price" value={formatPhase2Usd(snapshot.priceUsd)} />
            <Metric label="Liquidity" value={formatPhase2CompactUsd(snapshot.liquidityUsd)} />
            <Metric label="FDV" value={formatPhase2CompactUsd(snapshot.fdvUsd)} />
            <Metric label="24h Volume" value={formatPhase2CompactUsd(snapshot.volume24hUsd)} />
          </div>

          <div className="text-xs text-crypto-muted-foreground">
            Updated: {snapshot.fetchedAt.toLocaleString()}
          </div>
        </div>
      )}
    </section>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-crypto-border bg-crypto-muted/30 p-3">
      <div className="text-xs text-crypto-muted-foreground">{props.label}</div>
      <div className="mt-1 text-sm font-semibold text-crypto-foreground">{props.value}</div>
    </div>
  );
}

