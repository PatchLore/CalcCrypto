import { useState } from 'react';
import { fetchTokenData } from '@/features/phase2/services/dexscreener';
import { TokenRiskData, RiskScore, RiskLevel } from '@/features/phase2/types';
import { calculateRiskScore } from '@/features/phase2/logic/riskScoring';
import type { RiskContext } from '@/features/phase2/types/phase2';

export default function RiskContextPanel(props: { riskContext: RiskContext | null }) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAddress.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const tokenData = await fetchTokenData(tokenAddress);
      const score = calculateRiskScore(tokenData);
      setRiskScore(score);
    } catch (err) {
      setError('Failed to fetch token data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'extreme': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold mb-4">Risk Context</h2>
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
          {loading ? 'Analyzing...' : 'Assess Risk'}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-50 rounded text-red-600">
          {error}
        </div>
      )}

      {!loading && riskScore && (
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-medium text-lg mr-2">Risk Score:</span>
            <span className={`font-bold text-xl ${getRiskColor(riskScore.level)}`}>
              {riskScore.score}
            </span>
            <span className="ml-2 text-xs text-gray-500">({riskScore.level})</span>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium mb-2">Risk Factors:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Liquidity Risk:</span>
                <span className="font-medium">{riskScore.factors.liquidityRisk} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Age Risk:</span>
                <span className="font-medium">{riskScore.factors.ageRisk} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Holder Concentration Risk:</span>
                <span className="font-medium">{riskScore.factors.holderRisk} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Mint Authority Risk:</span>
                <span className="font-medium">{riskScore.factors.mintRisk} pts</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>Score interpretation: 0-25 Low, 26-50 Medium, 51-75 High, 76-100 Extreme</p>
          </div>
        </div>
      )}
    </div>
  );
}