import { StatusChip } from './StatusChip';
import {
  asRuleStatus,
  isArrayOfRecords,
  isRecord,
  isStringArray,
  optStr,
  str,
  type CalloutData,
  type CalloutTone,
  type KeyTakeawayData,
} from './types';

const TONE: Record<CalloutTone, { wrap: string; title: string; icon: string }> = {
  info: {
    wrap: 'border-crypto-primary-500/35 bg-crypto-primary-500/5',
    title: 'text-crypto-primary-200',
    icon: 'ℹ️',
  },
  law: {
    wrap: 'border-crypto-ethereum-400/40 bg-crypto-ethereum-500/5',
    title: 'text-crypto-ethereum-200',
    icon: '⚖️',
  },
  proposed: {
    wrap: 'border-crypto-warning-400/45 bg-crypto-warning-500/5',
    title: 'text-crypto-warning-200',
    icon: '🚧',
  },
  warning: {
    wrap: 'border-crypto-bitcoin-500/40 bg-crypto-bitcoin-500/5',
    title: 'text-crypto-bitcoin-200',
    icon: '⚠️',
  },
};

export function Callout({ data }: { data: CalloutData }) {
  const tone = TONE[data.tone];
  return (
    <aside className={`not-prose my-8 rounded-2xl border p-5 md:p-6 ${tone.wrap}`}>
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span aria-hidden="true" className="text-lg leading-none">
          {tone.icon}
        </span>
        <h3 className={`m-0 text-base font-bold md:text-lg ${tone.title}`}>{data.title}</h3>
        {data.status && <StatusChip status={data.status} />}
      </div>

      {data.body.map((p, i) => (
        <p key={i} className="m-0 mb-2.5 text-sm leading-relaxed text-crypto-muted-foreground last:mb-0">
          {p}
        </p>
      ))}

      {data.rows && data.rows.length > 0 && (
        <dl className="m-0 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.rows.map((r) => (
            <div key={r.label} className="rounded-xl border border-crypto-border/50 bg-crypto-background/50 p-3.5">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-crypto-foreground">{r.label}</dt>
              <dd className="m-0 mt-1 text-sm leading-snug text-crypto-muted-foreground">{r.text}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}

export function KeyTakeaway({ data }: { data: KeyTakeawayData }) {
  return (
    <aside
      aria-label={data.title ?? 'Key takeaway'}
      className="not-prose my-8 rounded-2xl border border-crypto-success-500/35 bg-crypto-success-500/5 p-5 md:p-6"
    >
      <h3 className="m-0 mb-3 flex items-center gap-2 text-base font-bold text-crypto-success-300 md:text-lg">
        <span aria-hidden="true">🎯</span>
        {data.title ?? 'Key takeaway'}
      </h3>
      <ul className="m-0 list-none space-y-2.5 p-0">
        {data.points.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-crypto-muted-foreground">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crypto-success-400" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function parseCallout(raw: unknown): CalloutData | null {
  if (!isRecord(raw)) return null;
  const t = raw.tone;
  const tone: CalloutTone =
    t === 'info' || t === 'law' || t === 'proposed' || t === 'warning' ? t : 'info';
  return {
    tone,
    title: str(raw, 'title'),
    status: raw.status === undefined ? undefined : asRuleStatus(raw.status),
    body: isStringArray(raw.body) ? raw.body : [],
    rows: isArrayOfRecords(raw.rows)
      ? raw.rows.map((r) => ({ label: str(r, 'label'), text: str(r, 'text') }))
      : undefined,
  };
}

export function parseKeyTakeaway(raw: unknown): KeyTakeawayData | null {
  if (!isRecord(raw) || !isStringArray(raw.points)) return null;
  return { title: optStr(raw, 'title'), points: raw.points };
}
