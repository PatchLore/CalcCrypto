'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  fetchPhase2TokenSnapshot,
  formatPhase2CompactUsd,
  formatPhase2Usd,
  isPhase2EvmContractAddress,
  Phase2TokenSnapshotError,
  type Phase2TokenSnapshot,
} from '../tokenSnapshot';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function Phase2TokenSnapshotWidget() {
  const [address, setAddress] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<Phase2TokenSnapshot | null>(null);

  const activeRequestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const normalizedAddress = address.trim();
  const isValidAddress = useMemo(
    () => normalizedAddress.length === 0 || isPhase2EvmContractAddress(normalizedAddress),
    [normalizedAddress]
  );

  const canSubmit = normalizedAddress.length > 0 && isPhase2EvmContractAddress(normalizedAddress) && status !== 'loading';

  const clear = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    activeRequestIdRef.current += 1;
    setStatus('idle');
    setErrorMessage(null);
    setSnapshot(null);
  };

  const resolveErrorMessage = (err: unknown): string => {
    if (err instanceof Phase2TokenSnapshotError) return err.message;
    if (err instanceof Error && err.name === 'AbortError') return 'Request cancelled.';
    if (err instanceof Error) return err.message;
    return 'Unexpected error. Please try again.';
  };

  const handleLookup = async () => {
    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setErrorMessage(null);
    setSnapshot(null);

    try {
      const data = await fetchPhase2TokenSnapshot(normalizedAddress, { signal: controller.signal });
      if (activeRequestIdRef.current !== requestId) return;
      setSnapshot(data);
      setStatus('success');
    } catch (err) {
      if (activeRequestIdRef.current !== requestId) return;
      if (controller.signal.aborted) return;
      setStatus('error');
      setErrorMessage(resolveErrorMessage(err));
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Phase 2: Token Snapshot</h2>
            <p className="mt-1 text-sm text-white/70">
              Enter an Ethereum token contract address to fetch live market metrics (read-only).
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80">
            Phase 2
          </span>
        </div>

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) void handleLookup();
          }}
        >
          <label className="block">
            <span className="block text-sm font-medium text-white/80">Token contract address</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x…"
              inputMode="text"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className={[
                'mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
                'bg-black/30 text-white placeholder:text-white/40',
                isValidAddress ? 'border-white/15 focus:border-white/30' : 'border-red-400/60 focus:border-red-400/80',
              ].join(' ')}
              aria-invalid={!isValidAddress}
            />
          </label>

          {!isValidAddress && (
            <p className="text-sm text-red-200">
              Invalid address format. Expected: <span className="font-mono">0x</span> followed by 40 hex characters.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-opacity',
                'bg-white text-black',
                !canSubmit ? 'opacity-50 cursor-not-allowed' : 'opacity-100',
              ].join(' ')}
            >
              {status === 'loading' ? 'Loading…' : 'Lookup'}
            </button>

            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-6">
          {status === 'idle' && (
            <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              Tip: paste a token contract address and click <span className="font-semibold">Lookup</span>.
            </div>
          )}

          {status === 'loading' && (
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
                <div className="text-sm text-white/80">Fetching live token data…</div>
              </div>
              <div className="mt-3 text-xs text-white/50">
                Supported chain: Ethereum. Source: DexScreener public endpoint (read-only).
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-lg border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">
              <div className="font-semibold">Couldn’t load token data</div>
              <div className="mt-1 text-red-100/90">{errorMessage ?? 'Unknown error.'}</div>
            </div>
          )}

          {status === 'success' && snapshot && (
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-white/60">Token</div>
                <div className="text-lg font-semibold">
                  {snapshot.baseToken.name} <span className="text-white/70">({snapshot.baseToken.symbol})</span>
                </div>
                <div className="mt-1 text-xs text-white/50 font-mono break-all">
                  {snapshot.baseToken.address}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Metric label="Price" value={formatPhase2Usd(snapshot.priceUsd)} />
                <Metric label="Liquidity" value={formatPhase2CompactUsd(snapshot.liquidityUsd)} />
                <Metric label="FDV" value={formatPhase2CompactUsd(snapshot.fdvUsd)} />
                <Metric label="24h Volume" value={formatPhase2CompactUsd(snapshot.volume24hUsd)} />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-white/50">
                <div>
                  Market: {snapshot.chainId} • {snapshot.dexId}
                </div>
                <div>
                  Updated: {snapshot.fetchedAt.toLocaleString()}
                </div>
              </div>

              {snapshot.url && (
                <div className="mt-4">
                  <a
                    href={snapshot.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-white/80 underline underline-offset-4 hover:text-white"
                  >
                    View pair on DexScreener
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-white/60">{props.label}</div>
      <div className="mt-1 text-base font-semibold text-white">{props.value}</div>
    </div>
  );
}

