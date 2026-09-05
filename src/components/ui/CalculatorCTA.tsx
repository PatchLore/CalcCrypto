import { AffiliateLink } from './AffiliateLink';

type CalculatorCTAProps = {
  headline: string;
  body: string;
  buttonText: string;
  href: string;
  /** Calculator this CTA sits on, e.g. "tax". Reported to GA4 on click. */
  source: string;
};

export function CalculatorCTA({ headline, body, buttonText, href, source }: CalculatorCTAProps) {
  return (
    <div className="mt-6 rounded-xl border border-green-600/30 bg-green-600/5 p-5">
      <p className="text-sm font-semibold text-crypto-foreground mb-1">
        {headline}
      </p>
      <p className="text-xs text-crypto-muted-foreground mb-4">
        {body}
      </p>
      <AffiliateLink
        href={href}
        source={source}
        className="inline-flex items-center justify-center w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        {buttonText}
      </AffiliateLink>
      <p className="mt-2 text-xs text-crypto-muted-foreground/60 text-center">
        CalcCrypto may earn a commission from affiliate links.
      </p>
    </div>
  );
}
