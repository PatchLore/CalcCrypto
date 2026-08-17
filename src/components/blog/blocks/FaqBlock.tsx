import {
  isArrayOfRecords,
  isRecord,
  optStr,
  str,
  type FaqBlockData,
  type SourceListData,
} from './types';

/**
 * Visible FAQ. The FAQPage JSON-LD is emitted separately from the post's `faq`
 * frontmatter. Google requires the answers to be present in the rendered page,
 * so the two must be kept in sync when either is edited.
 */
export function FaqBlock({ data }: { data: FaqBlockData }) {
  return (
    <section aria-label={data.title ?? 'Frequently asked questions'} className="not-prose my-8">
      <div className="divide-y divide-crypto-border/50 overflow-hidden rounded-2xl border border-crypto-border/60 bg-crypto-background/40">
        {data.items.map((item, i) => (
          <details key={i} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-crypto-foreground marker:content-['']">
              {item.question}
              <span
                aria-hidden="true"
                className="shrink-0 text-crypto-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="m-0 mt-2.5 text-sm leading-relaxed text-crypto-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function SourceList({ data }: { data: SourceListData }) {
  return (
    <section aria-label={data.title ?? 'Sources and further reading'} className="not-prose my-8">
      <ul className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2">
        {data.sources.map((s) => (
          <li
            key={s.url}
            className="rounded-xl border border-crypto-border/50 bg-crypto-background/40 p-3.5 transition-colors hover:border-crypto-border"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-crypto-primary-300">
                {s.authority}
              </span>
              {s.region && (
                <span className="text-[11px] text-crypto-muted-foreground">{s.region}</span>
              )}
            </div>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium leading-snug text-crypto-foreground underline decoration-crypto-border underline-offset-2 hover:decoration-crypto-primary-400"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function parseFaqBlock(raw: unknown): FaqBlockData | null {
  if (!isRecord(raw) || !isArrayOfRecords(raw.items)) return null;
  return {
    title: optStr(raw, 'title'),
    items: raw.items.map((i) => ({ question: str(i, 'question'), answer: str(i, 'answer') })),
  };
}

export function parseSourceList(raw: unknown): SourceListData | null {
  if (!isRecord(raw) || !isArrayOfRecords(raw.sources)) return null;
  return {
    title: optStr(raw, 'title'),
    sources: raw.sources.map((s) => ({
      authority: str(s, 'authority'),
      title: str(s, 'title'),
      url: str(s, 'url'),
      region: optStr(s, 'region'),
    })),
  };
}
