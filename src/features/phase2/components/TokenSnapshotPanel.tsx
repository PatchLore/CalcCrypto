'use client';

import { SUPPORTED_CHAINS } from '@/features/phase2/chains';
import type { TokenSnapshot } from '@/features/phase2/types/phase2';

type TokenSnapshotPanelProps = {
  data: TokenSnapshot | null;
  loading: boolean;
  error: string | null;
};

const EMPTY_MESSAGES: Record<string, string> = {
  ethereum: 'Enter a valid 0x… address above to view token price, liquidity, FDV, and volume data.',
  solana: 'Enter a valid Solana token address above to view token price, liquidity, FDV, and volume data.',
  base: 'Enter a valid Base chain address to view token price, liquidity, FDV, and volume data.',
  arbitrum: 'Enter a valid Arbitrum address to view token price, liquidity, FDV, and volume data.',
  bsc: 'Enter a valid BNB Chain address to view token price, liquidity, FDV, and volume data.',
};

export default function TokenSnapshotPanel({ data, loading, error }: TokenSnapshotPanelProps) {
  const chainName = data?.chainId
    ? SUPPORTED_CHAINS.find(c => c.id === data.chainId)?.name ?? data.chainId
    : null;

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
          {EMPTY_MESSAGES.ethereum}
        </p>
      </div>
    );
  }

  // Success state - use TokenSnapshot fields
  return (
    <div className="rounded-lg border border-crypto-border bg-crypto-background p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-crypto-foreground">Token Snapshot</div>
        {chainName && (
          <span className="text-xs font-medium text-crypto-muted-foreground bg-crypto-muted/20 rounded-md px-2 py-0.5">
            {chainName}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="text-xs text-crypto-muted-foreground">
          {data.baseToken.name} ({data.baseToken.symbol})
        </div>
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