import { StatusChip } from './StatusChip';
import {
  asRuleStatus,
  isArrayOfRecords,
  isRecord,
  optStr,
  str,
  type RuleStatus,
  type TimelineData,
} from './types';

const MARKER: Record<RuleStatus, string> = {
  'current-law': 'bg-crypto-success-400 ring-crypto-success-400/25',
  'enacted-future': 'bg-crypto-ethereum-400 ring-crypto-ethereum-400/25',
  proposed: 'bg-crypto-warning-400 ring-crypto-warning-400/25',
  'rejected-proposal': 'bg-red-400/60 ring-red-400/20',
  'policy-signal': 'bg-crypto-primary-400 ring-crypto-primary-400/25',
  'policy-discussion': 'bg-white/50 ring-white/15',
};

export function Timeline({ data }: { data: TimelineData }) {
  return (
    <section aria-label="Crypto tax reporting timeline" className="not-prose my-8">
      <ol className="relative m-0 list-none p-0">
        {/* Rail sits behind the markers; hidden from AT as decoration. */}
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-crypto-border via-crypto-border to-transparent"
        />
        {data.items.map((item, i) => (
          <li key={`${item.date}-${i}`} className="relative mb-6 pl-8 last:mb-0">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full ring-4 ${MARKER[item.status]}`}
            />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <time className="text-sm font-bold text-crypto-foreground">{item.date}</time>
              <StatusChip status={item.status} />
              {item.region && (
                <span className="text-[11px] font-semibold uppercase tracking-wide text-crypto-muted-foreground">
                  {item.region}
                </span>
              )}
            </div>
            <p className="m-0 mt-1 text-sm font-semibold text-crypto-foreground">{item.title}</p>
            <p className="m-0 mt-0.5 text-sm leading-relaxed text-crypto-muted-foreground">{item.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function parseTimeline(raw: unknown): TimelineData | null {
  if (!isRecord(raw) || !isArrayOfRecords(raw.items)) return null;
  return {
    items: raw.items.map((i) => ({
      date: str(i, 'date'),
      title: str(i, 'title'),
      detail: str(i, 'detail'),
      status: asRuleStatus(i.status),
      region: optStr(i, 'region'),
    })),
  };
}
