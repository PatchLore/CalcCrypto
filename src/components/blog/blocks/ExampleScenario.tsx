import {
  isArrayOfRecords,
  isRecord,
  optStr,
  str,
  type ExampleScenarioData,
  type ProsConsData,
} from './types';

export function ExampleScenario({ data }: { data: ExampleScenarioData }) {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-crypto-border/60 bg-crypto-background/40">
      <figcaption className="border-b border-crypto-border/50 bg-crypto-background/60 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          {data.flag && (
            <span aria-hidden="true" className="text-lg leading-none">
              {data.flag}
            </span>
          )}
          <h4 className="m-0 text-sm font-bold text-crypto-foreground">{data.title}</h4>
        </div>
        <p className="m-0 mt-1.5 text-sm leading-relaxed text-crypto-muted-foreground">{data.setup}</p>
      </figcaption>

      <div className="px-5 py-4">
        <dl className="m-0 space-y-2">
          {data.steps.map((s) => (
            <div key={s.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <dt className="text-xs text-crypto-muted-foreground">{s.label}</dt>
              <dd className="m-0 font-mono text-sm font-medium text-crypto-foreground">{s.value}</dd>
            </div>
          ))}
        </dl>

        <p className="m-0 mt-4 border-t border-crypto-border/50 pt-3.5 text-sm font-semibold leading-relaxed text-crypto-foreground">
          {data.outcome}
        </p>

        {data.caveat && (
          <p className="m-0 mt-2 text-xs leading-relaxed text-crypto-muted-foreground/80">{data.caveat}</p>
        )}
      </div>
    </figure>
  );
}

export function ProsCons({ data }: { data: ProsConsData }) {
  return (
    <section aria-label="Advantages and disadvantages by country" className="not-prose my-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.entries.map((e) => (
          <div key={e.country} className="rounded-2xl border border-crypto-border/60 bg-crypto-background/40 p-5">
            <div className="mb-3 flex items-center gap-2.5">
              <span aria-hidden="true" className="text-xl leading-none">
                {e.flag}
              </span>
              <h3 className="m-0 text-base font-bold text-crypto-foreground">{e.country}</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="m-0 text-[11px] font-bold uppercase tracking-wide text-crypto-success-300">
                  Biggest advantage
                </p>
                <p className="m-0 mt-0.5 text-sm leading-relaxed text-crypto-muted-foreground">{e.advantage}</p>
              </div>
              <div>
                <p className="m-0 text-[11px] font-bold uppercase tracking-wide text-crypto-bitcoin-300">
                  Biggest disadvantage
                </p>
                <p className="m-0 mt-0.5 text-sm leading-relaxed text-crypto-muted-foreground">{e.disadvantage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function parseExampleScenario(raw: unknown): ExampleScenarioData | null {
  if (!isRecord(raw)) return null;
  return {
    title: str(raw, 'title'),
    flag: optStr(raw, 'flag'),
    country: optStr(raw, 'country'),
    setup: str(raw, 'setup'),
    steps: isArrayOfRecords(raw.steps)
      ? raw.steps.map((s) => ({ label: str(s, 'label'), value: str(s, 'value') }))
      : [],
    outcome: str(raw, 'outcome'),
    caveat: optStr(raw, 'caveat'),
  };
}

export function parseProsCons(raw: unknown): ProsConsData | null {
  if (!isRecord(raw) || !isArrayOfRecords(raw.entries)) return null;
  return {
    entries: raw.entries.map((e) => ({
      country: str(e, 'country'),
      flag: str(e, 'flag'),
      advantage: str(e, 'advantage'),
      disadvantage: str(e, 'disadvantage'),
    })),
  };
}
