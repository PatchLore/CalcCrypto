import { RULE_STATUS_LABEL, type RuleStatus } from './types';

const TONE: Record<RuleStatus, string> = {
  'current-law': 'border-crypto-success-500/40 bg-crypto-success-500/10 text-crypto-success-300',
  'enacted-future': 'border-crypto-ethereum-400/40 bg-crypto-ethereum-500/10 text-crypto-ethereum-200',
  proposed: 'border-crypto-warning-400/50 bg-crypto-warning-500/10 text-crypto-warning-200',
  'policy-discussion': 'border-white/25 bg-white/5 text-white/70',
};

/**
 * Small, consistent marker distinguishing enacted law from a proposal.
 * Used everywhere a date or rule could otherwise be misread as settled.
 */
export function StatusChip({ status, className = '' }: { status: RuleStatus; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${TONE[status]} ${className}`}
    >
      {RULE_STATUS_LABEL[status]}
    </span>
  );
}
