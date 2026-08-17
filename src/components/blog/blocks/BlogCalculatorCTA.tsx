import Link from 'next/link';
import { isRecord, str, type CalculatorCtaData } from './types';

/**
 * In-article CTA pointing at a CalcCrypto calculator.
 *
 * Distinct from `components/ui/CalculatorCTA`, which is for outbound affiliate
 * links and carries a commission disclosure. This one is internal-only: it
 * routes through next/link for client-side navigation, and any non-internal
 * href is rejected so an authoring mistake can't silently create an outbound
 * link without the required disclosure.
 */
export function BlogCalculatorCTA({ data }: { data: CalculatorCtaData }) {
  const isInternal = data.href.startsWith('/') && !data.href.startsWith('//');
  if (!isInternal) return null;

  return (
    <aside className="not-prose my-8 rounded-2xl border border-crypto-primary-500/35 bg-gradient-to-br from-crypto-primary-500/10 to-crypto-ethereum-500/5 p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="m-0 flex items-center gap-2 text-base font-bold text-crypto-foreground">
            <span aria-hidden="true">🧮</span>
            {data.headline}
          </p>
          <p className="m-0 mt-1 text-sm leading-relaxed text-crypto-muted-foreground">{data.body}</p>
        </div>
        <Link
          href={data.href}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-crypto-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-crypto-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crypto-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-crypto-background"
        >
          {data.buttonText}
        </Link>
      </div>
    </aside>
  );
}

export function parseCalculatorCta(raw: unknown): CalculatorCtaData | null {
  if (!isRecord(raw)) return null;
  return {
    headline: str(raw, 'headline'),
    body: str(raw, 'body'),
    buttonText: str(raw, 'buttonText'),
    href: str(raw, 'href'),
  };
}
