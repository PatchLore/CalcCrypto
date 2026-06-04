import Link from 'next/link';

type CalculatorCTAProps = {
  headline: string;
  body: string;
  buttonText: string;
  href: string;
};

export function CalculatorCTA({ headline, body, buttonText, href }: CalculatorCTAProps) {
  return (
    <div className="mt-6 rounded-xl border border-green-600/30 bg-green-600/5 p-5">
      <p className="text-sm font-semibold text-crypto-foreground mb-1">
        {headline}
      </p>
      <p className="text-xs text-crypto-muted-foreground mb-4">
        {body}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center justify-center w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        {buttonText}
      </a>
      <p className="mt-2 text-xs text-crypto-muted-foreground/60 text-center">
        CalcCrypto may earn a commission from affiliate links.
      </p>
    </div>
  );
}
