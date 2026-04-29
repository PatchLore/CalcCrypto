'use client';

import type { TokenSnapshot } from '@/features/phase2/types/phase2';

type TokenSnapshotPanelProps = {
  data: TokenSnapshot | null;
  loading: boolean;
  error: string | null;
};

export default function TokenSnapshotPanel({ data, loading, error }: TokenSnapshotPanelProps) {
  // Loading state
  if (loading) {
    return (
      <div className="rounded-lg border border-crypto-border bg-crypto-background p-4" role="status" aria-label="Loading token snapshot">
        <div className="text-sm font-semibold text-crypto-foreground mb-3">Token Snapshot</div>
        <div className="mt-3 h-4 w-2/3 rounded bg-crypto-muted/40 animate-pulse" />
        <div className="mt-2 h-4 w-1/2 rounded bg-crypto-muted/40 animate-pulse" />
        <div className="mt-2 h-4 w-3/4 rounded bg-crypto-muted/40 animate-pulse" />
        <div className="mt-2 h-4 w-1/3 rounded bg-crypto-muted/40 animate-pulse" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="text-sm font-semibold text-red-800 mb-3">Token Snapshot</div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!data) {
    return (
      <div className="rounded-lg border border-crypto-border bg-crypto-background p-4">
        <div className="text-sm font-semibold text-crypto-foreground mb-3">Token Snapshot</div>
        <p className="text-sm text-crypto-muted-foreground">
          Enter a valid 0x... address above to view token price, liquidity, FDV, and volume data.
        </p>
      </div>
    );
  }

  // Success state - use TokenSnapshot fields
  return (
    <div className="rounded-lg border border-crypto-border bg-crypto-background p-4">
      <div className="text-sm font-semibold text-crypto-foreground mb-3">Token Snapshot</div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-crypto-foreground">Price:</span>
            <span className="ml-2 text-crypto-muted-foreground">${data.priceUsd?.toFixed(6) ?? 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium text-crypto-foreground">Liquidity:</span>
            <span className="ml-2 text-crypto-muted-foreground">${data.liquidityUsd?.toLocaleString() ?? 'N/A'} USD</span>
          </div>
          <div>
            <span className="font-medium text-crypto-foreground">FDV:</span>
            <span className="ml-2 text-crypto-muted-foreground">${data.fdvUsd?.toLocaleString() ?? 'N/A'} USD</span>
          </div>
          <div>
            <span className="font-medium text-crypto-foreground">24h Volume:</span>
            <span className="ml-2 text-crypto-muted-foreground">${data.volume24hUsd?.toLocaleString() ?? 'N/A'} USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}