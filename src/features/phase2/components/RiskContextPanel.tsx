'use client';

import type { RiskContext } from '@/features/phase2/types/phase2';

export default function RiskContextPanel({ riskContext }: { riskContext: RiskContext | null }) {
  
  if (!riskContext) {
    return (
      <div className="rounded-lg border border-crypto-border bg-crypto-background p-4">
        <div className="text-sm font-semibold text-crypto-foreground mb-3">Risk Context</div>
        <p className="text-sm text-gray-600">Enter a contract address to view risk assessment</p>
      </div>
    );
  }

  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="rounded-lg border border-crypto-border bg-crypto-background p-4">
      <div className="text-sm font-semibold text-gray-900 mb-3">Risk Context</div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-gray-700">Risk Level:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBadgeStyles(riskContext.riskLevel)}`}>
          {riskContext.riskLevel.toUpperCase()}
        </span>
        <span className="text-sm font-medium text-gray-900">Score: {riskContext.score}</span>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-800">{riskContext.summary}</p>
        
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Warnings:</h4>
          <ul className="space-y-1">
            {riskContext.warnings.map((warning, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-yellow-600">⚠️</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500 italic">Context only, not financial advice</p>
    </div>
  );
}
