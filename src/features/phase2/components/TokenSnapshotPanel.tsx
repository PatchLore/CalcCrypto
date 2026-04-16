import { useState } from 'react';
import { fetchTokenData } from '@/features/phase2/services/dexscreener';
import { TokenRiskData } from '@/features/phase2/types';
import type { TokenSnapshot } from '@/features/phase2/types/phase2';

export default function TokenSnapshotPanel(props: { contractAddress: string; onSnapshotChange: (s: TokenSnapshot | null) => void }) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenData, setTokenData] = useState<TokenRiskData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAddress.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchTokenData(tokenAddress);
      setTokenData(data);
    } catch (err) {
      setError('Failed to fetch token data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold mb-4">Token Snapshot</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Enter token address (e.g., 0x...)"
          className="flex-1 px-3 py-2 border rounded"
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading || !tokenAddress.trim()}
          className="px-4 py-2 bg-primary rounded hover:bg-primary/80 transition-colors"
        >
          {loading ? 'Fetching...' : 'Get Data'}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-50 rounded text-red-600">
          {error}
        </div>
      )}

      {!loading && tokenData && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Price:</span>
              <span className="text-secondary">${tokenData.priceUsd?.toFixed(6) ?? 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium">Liquidity:</span>
              <span className="text-secondary">${tokenData.liquidity.toLocaleString()} USD</span>
            </div>
            <div>
              <span className="font-medium">24h Volume:</span>
              <span className="text-secondary">${tokenData.volume24h.toLocaleString()} USD</span>
            </div>
            <div>
              <span className="font-medium">24h Change:</span>
              <span className="text-secondary">
                {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}