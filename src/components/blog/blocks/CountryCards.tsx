import { StatusChip } from './StatusChip';
import {
  asRuleStatus,
  isArrayOfRecords,
  isRecord,
  optStr,
  str,
  type CountryCardData,
  type CountryComparisonData,
  type CountryFact,
} from './types';

export function CountryCard({ data }: { data: CountryCardData }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-crypto-border/60 bg-crypto-background/40 p-5 transition-colors hover:border-crypto-border">
      <div className="mb-3 flex items-center gap-2.5">
        <span aria-hidden="true" className="text-2xl leading-none">
          {data.flag}
        </span>
        <h3 className="m-0 text-lg font-bold text-crypto-foreground">{data.country}</h3>
      </div>

      {data.summary && (
        <p className="m-0 mb-4 text-sm leading-snug text-crypto-muted-foreground">{data.summary}</p>
      )}

      <dl className="m-0 flex-1 space-y-2.5">
        {data.facts.map((f) => (
          <div key={f.label} className="border-t border-crypto-border/40 pt-2.5 first:border-t-0 first:pt-0">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-crypto-muted-foreground">
              {f.label}
            </dt>
            <dd className="m-0 text-sm font-medium text-crypto-foreground">{f.value}</dd>
            {f.note && <dd className="m-0 text-xs text-crypto-muted-foreground">{f.note}</dd>}
          </div>
        ))}
      </dl>

      {data.changeNote && (
        <div className="mt-4 rounded-lg border border-crypto-border/50 bg-crypto-background/60 p-3">
          <StatusChip status={data.changeNote.status} className="mb-1.5" />
          <p className="m-0 text-xs leading-snug text-crypto-muted-foreground">{data.changeNote.text}</p>
        </div>
      )}
    </div>
  );
}

export function CountryComparison({ data }: { data: CountryComparisonData }) {
  return (
    <section aria-label="Country comparison at a glance" className="not-prose my-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.countries.map((c) => (
          <CountryCard key={c.country} data={c} />
        ))}
      </div>
    </section>
  );
}

function parseFacts(v: unknown): CountryFact[] {
  if (!isArrayOfRecords(v)) return [];
  return v.map((f) => ({
    label: str(f, 'label'),
    value: str(f, 'value'),
    note: optStr(f, 'note'),
  }));
}

export function parseCountryComparison(raw: unknown): CountryComparisonData | null {
  if (!isRecord(raw) || !isArrayOfRecords(raw.countries)) return null;
  return {
    countries: raw.countries.map((c) => {
      const change = isRecord(c.changeNote)
        ? { status: asRuleStatus(c.changeNote.status), text: str(c.changeNote, 'text') }
        : undefined;
      return {
        country: str(c, 'country'),
        flag: str(c, 'flag'),
        summary: optStr(c, 'summary'),
        facts: parseFacts(c.facts),
        changeNote: change,
      };
    }),
  };
}
