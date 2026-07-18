import type { Metadata } from 'next';
import Link from 'next/link';
import { ConversionClient } from './ConversionClient';
import { JsonLd } from "@/components/seo/JsonLd";
import { TrustBadge } from "@/components/ui/TrustBadge";

export const metadata: Metadata = {
  title: 'Crypto Currency Converter — BTC, ETH to USD, EUR Converter | CalcCrypto',
  description: 'Convert cryptocurrency to fiat and vice versa with our free currency converter. Supports Bitcoin, Ethereum, Solana and major stablecoins to USD, EUR and more. Instant conversion with live market rates. No signup required.',
  alternates: { canonical: 'https://www.calccrypto.com/calculators/conversion' },
  openGraph: {
    title: 'Crypto Currency Converter — BTC, ETH to USD, EUR Converter',
    description: 'Instant cryptocurrency and fiat currency converter. Supports BTC, ETH, SOL and stablecoins to USD, EUR and more. Free, no signup.',
    url: 'https://www.calccrypto.com/calculators/conversion',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Currency Converter — BTC, ETH to USD, EUR Converter',
    description: 'Convert crypto and fiat currencies instantly with live market rates. Free, no signup.',
  },
};

export default function CurrencyConverter() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Crypto Currency Converter",
        "applicationCategory": "FinanceApplication",
        "url": "https://www.calccrypto.com/calculators/conversion",
        "description": "Convert between cryptocurrencies like Bitcoin and Ethereum and fiat currencies like USD and EUR using live market rates. Free, no signup required.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": ["Crypto to fiat conversion", "Fiat to crypto conversion", "Crypto to crypto conversion", "Live market rates"]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to convert cryptocurrency to fiat",
        "description": "Convert crypto to fiat or between cryptocurrencies in 3 steps",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select your currencies",
            "text": "Choose the cryptocurrency or fiat currency you want to convert from and to."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Enter the amount",
            "text": "Enter the amount you wish to convert. The converter supports both fiat and crypto amounts."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "View the converted amount",
            "text": "The converter shows the equivalent amount in your target currency using current market rates."
          }
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How accurate are the conversion rates?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Conversion rates are fetched from public market data APIs and reflect current market prices. They are estimates and may differ slightly from the actual rate you receive on an exchange due to spreads, slippage and liquidity differences. Always check the live rate on your chosen exchange before executing a trade."
            }
          },
          {
            "@type": "Question",
            "name": "Can I convert any cryptocurrency?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "This converter supports major cryptocurrencies including Bitcoin, Ethereum, Solana, and popular USD-pegged stablecoins. The available pairs depend on data availability from public market APIs. If a pair is not listed, it may be due to insufficient liquidity or data coverage."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between market rate and exchange rate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The market rate is the global average price across multiple exchanges. The exchange rate is the specific rate offered by a single trading platform. Most exchanges add a spread — a small markup on the market rate — as their fee. This converter shows the market rate for reference, not the specific rate from any exchange."
            }
          },
          {
            "@type": "Question",
            "name": "Why do conversion rates change?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cryptocurrency prices are highly volatile and change continuously based on supply and demand across global markets. Rates can move significantly within minutes. The converter fetches the latest available rates but they may be delayed by up to 60 seconds compared to real-time trading."
            }
          },
          {
            "@type": "Question",
            "name": "Is this a trading platform?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, this is an educational conversion calculator only. It shows you what your crypto is worth in another currency at current market rates. CrypCal does not facilitate trades, connect to wallets, or execute transactions. Use a licensed exchange or broker to perform actual conversions."
            }
          }
        ]
      }} />

      <ConversionClient />

      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <TrustBadge />

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How this calculator works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              The currency converter fetches live market prices from public 
              cryptocurrency data APIs and calculates the conversion between 
              your chosen pair. Whether you are converting Bitcoin to USD, 
              Ethereum to EUR, or any supported crypto-to-fiat pair, the 
              calculation is simple: Amount × Current Market Price = Converted 
              Value. All rates are estimates based on aggregated market data 
              and are provided for educational reference only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Understanding crypto conversion rates
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              Cryptocurrency conversion rates reflect the current market price 
              determined by supply and demand on trading platforms worldwide. 
              Unlike traditional forex markets which have centralised exchange 
              rates, crypto prices can vary between exchanges due to differences 
              in liquidity, trading volume and geographic distribution. This 
              is known as the spread. Major cryptocurrencies like Bitcoin and 
              Ethereum typically have tight spreads across large exchanges, 
              while smaller altcoins may have significant price differences 
              between platforms. The conversion rate you see here is an 
              aggregate reference price, not a tradable quote. When you 
              actually convert crypto on an exchange, the rate you receive 
              will include the platform's buy-sell spread and any applicable 
              trading fees. Always compare rates across multiple platforms 
              before making large conversions, and be aware that low-liquidity 
              pairs can experience significant slippage on larger trades.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How accurate are the conversion rates?",
                  a: "Rates come from public market data APIs and reflect current prices. They are estimates and may differ from actual exchange rates due to spreads and liquidity."
                },
                {
                  q: "Can I convert any cryptocurrency?",
                  a: "Major cryptocurrencies and stablecoins are supported. Availability depends on public market data coverage."
                },
                {
                  q: "What is the difference between market rate and exchange rate?",
                  a: "Market rate is the global average. Exchange rate is a specific platform's rate including spread. This converter shows the market rate for reference."
                },
                {
                  q: "Why do conversion rates change?",
                  a: "Crypto prices are highly volatile and change continuously. Rates may be delayed by up to 60 seconds."
                },
                {
                  q: "Is this a trading platform?",
                  a: "No, this is an educational converter only. CrypCal does not facilitate trades, connect to wallets or execute transactions."
                }
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="border border-crypto-border rounded-lg overflow-hidden group"
                >
                  <summary className="flex items-center justify-between px-4 py-3 
                                    cursor-pointer font-medium text-sm 
                                    text-crypto-foreground hover:bg-crypto-muted/30 
                                    list-none">
                    {q}
                    <span aria-hidden="true"
                          className="ml-2 text-crypto-muted-foreground 
                                    group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <div className="px-4 py-3 text-sm text-crypto-muted-foreground 
                                border-t border-crypto-border">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Related calculators
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { href: '/calculators/profit-loss', label: 'Profit & Loss', desc: 'Trade P&L calculation' },
                { href: '/calculators/dca', label: 'DCA Calculator', desc: 'Dollar cost averaging' },
                { href: '/calculators/staking', label: 'Staking Calculator', desc: 'Staking reward projections' },
                { href: '/calculators/mining', label: 'Mining Calculator', desc: 'Mining profitability' },
                { href: '/calculators/token-price', label: 'Token Analyser', desc: 'Token risk scoring' },
                { href: '/calculators/tax', label: 'Tax Calculator', desc: 'CGT estimation' },
              ].map(({ href, label, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="block border border-crypto-border rounded-lg p-3 
                            hover:bg-crypto-muted/30 transition-colors"
                >
                  <div className="font-medium text-sm text-crypto-foreground">
                    {label}
                  </div>
                  <div className="text-xs text-crypto-muted-foreground mt-0.5">
                    {desc}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}