import {
  isArrayOfRecords,
  isRecord,
  optStr,
  str,
  type TaxActivityData,
  type TaxActivityGridData,
} from './types';

export function TaxActivityCard({ data }: { data: TaxActivityData }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-crypto-border/60 bg-crypto-background/40 p-5">
      <div className="mb-1 flex items-center gap-2.5">
        {data.icon && (
          <span aria-hidden="true" className="text-xl leading-none">
            {data.icon}
          </span>
        )}
        <h3 className="m-0 text-base font-bold text-crypto-foreground">{data.activity}</h3>
      </div>

      {data.question && (
        <p className="m-0 mb-4 text-xs italic leading-snug text-crypto-muted-foreground">{data.question}</p>
      )}

      <dl className="m-0 flex-1 space-y-2.5">
        {data.jurisdictions.map((j) => (
          <div key={j.country} className="flex gap-2.5 border-t border-crypto-border/40 pt-2.5 first:border-t-0 first:pt-0">
            <dt className="flex shrink-0 items-start gap-1.5 text-xs font-semibold text-crypto-foreground">
              <span aria-hidden="true">{j.flag}</span>
              <span className="sr-only">{j.country}:</span>
              <span aria-hidden="true">{j.country}</span>
            </dt>
            <dd className="m-0 flex-1 text-xs leading-relaxed text-crypto-muted-foreground">{j.treatment}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function TaxActivityGrid({ data }: { data: TaxActivityGridData }) {
  return (
    <section aria-label="Tax treatment by crypto activity" className="not-prose my-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.activities.map((a) => (
          <TaxActivityCard key={a.activity} data={a} />
        ))}
      </div>
    </section>
  );
}

export function parseTaxActivityGrid(raw: unknown): TaxActivityGridData | null {
  if (!isRecord(raw) || !isArrayOfRecords(raw.activities)) return null;
  return {
    activities: raw.activities.map((a) => ({
      activity: str(a, 'activity'),
      icon: optStr(a, 'icon'),
      question: optStr(a, 'question'),
      jurisdictions: isArrayOfRecords(a.jurisdictions)
        ? a.jurisdictions.map((j) => ({
            country: str(j, 'country'),
            flag: str(j, 'flag'),
            treatment: str(j, 'treatment'),
          }))
        : [],
    })),
  };
}
