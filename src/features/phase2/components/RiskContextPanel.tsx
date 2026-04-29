'use client';

import type { RiskContext } from '@/features/phase2/types/phase2';

type RiskContextPanelProps = {
  data: RiskContext | null;
  loading: boolean;
  error: string | null;
};

export default function RiskContextPanel({ data, loading, error }: RiskContextPanelProps) {
  // Loading state with WCAG compliant skeleton
  if (loading) {
    return (
      <div className="rounded-lg border border-crypto-border bg-crypto-background p-4" role="status" aria-label="Loading risk context">
        <div className="text-sm font-semibold text-crypto-foreground mb-3">Risk Context</div>
        <div className="mt-3 h-4 w-2/3 rounded bg-crypto-muted/40 animate-pulse" />
        <div className="mt-2 h-4 w-1/2 rounded bg-crypto-muted/40 animate-pulse" />
        <div className="mt-2 h-4 w-3/4 rounded bg-crypto-muted/40 animate-pulse" />
      </div>
    );
  }

  // Error state with WCAG compliant colors (red-700 on red-50 has 4.5:1+ contrast)
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="text-sm font-semibold text-red-800 mb-3">Risk Context</div>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  // Empty state with WCAG compliant text color
  if (!data) {
    return (
      <div className="rounded-lg border border-crypto-border bg-crypto-background p-4">
        <div className="text-sm font-semibold text-crypto-foreground mb-3">Risk Context</div>
        <p className="text-sm text-crypto-muted-foreground">
          Enter a valid 0x... address above to view risk assessment.
        </p>
      </div>
    );
  }

  // WCAG AA compliant color schemes for risk badges
  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300'; // 4.5:1+ contrast
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'; // 4.5:1+ contrast
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'; // 4.5:1+ contrast
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="rounded-lg border border-crypto-border bg-crypto-background p-4">
      <div className="text-sm font-semibold text-crypto-foreground mb-3">Risk Context</div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-crypto-foreground">Risk Level:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBadgeStyles(data.riskLevel)}`}>
          {data.riskLevel.toUpperCase()}
        </span>
        <span className="text-sm font-medium text-crypto-foreground">Score: {data.score}</span>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-crypto-foreground">{data.summary}</p>
        
        {data.warnings.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-crypto-foreground mb-2">Warnings:</h4>
            <ul className="space-y-1">
              {data.warnings.map((warning, i) => (
                <li key={i} className="text-sm text-crypto-foreground flex items-start gap-2">
                  <span className="text-yellow-600" aria-hidden="true">⚠️</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-crypto-muted-foreground italic">Context only, not financial advice</p>
    </div>
  );
}