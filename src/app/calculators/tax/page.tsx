import type { Metadata } from 'next';
import { TaxClient } from './TaxClient';
import { JsonLd } from '../../../components/seo/JsonLd';
import { TrustBadge } from '../../../components/ui/TrustBadge';

export const metadata: Metadata = {
  title: 'Crypto Capital Gains Tax Calculator | CrypCal',
  description: 'Estimate capital gains tax on crypto disposals for UK, US, Australia and EU. Enter buy price, sell price and quantity to see your CGT estimate. Educational tool only — not tax advice.',
  alternates: { canonical: 'https://calccrypto.com/calculators/tax' },
  openGraph: {
    title: 'Crypto CGT Calculator — CrypCal',
    description: 'Estimate crypto capital gains tax across UK, US, AU and EU. Free, manual input, no wallet required.',
    url: 'https://calccrypto.com/calculators/tax',
    siteName: 'CrypCal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Capital Gains Tax Calculator',
    description: 'Estimate CGT on crypto disposals for UK, US, AU and EU. Educational estimates only.',
  },
}

export default function TaxCalculator() {
  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Crypto Capital Gains Tax Calculator",
        "applicationCategory": "FinanceApplication",
        "url": "https://calccrypto.com/calculators/tax",
        "description": "Estimate capital gains tax on cryptocurrency disposals for UK, US, Australia and EU. Educational estimates only, not tax advice.",
        "offers": { "@type": "Offer", "price": "0" },
        "featureList": [
          "CGT estimation",
          "UK, US, AU, EU jurisdictions",
          "Basic and higher rate calculation",
          "Annual allowance deduction",
          "Capital loss identification"
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to estimate crypto capital gains tax",
        "description": "Estimate your crypto CGT liability in 4 steps",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select your jurisdiction",
            "text": "Choose your country from UK, US, Australia or EU to apply the correct CGT rates and annual allowance."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Select your tax rate band",
            "text": "Choose basic rate or higher rate depending on your income tax band."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Enter disposal details",
            "text": "Enter the price you bought at, the price you sold at, and the quantity of coins disposed."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "View your CGT estimate",
            "text": "See your gross gain, taxable gain after allowance, estimated tax liability and effective rate."
          }
        ]
      }} />

      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Do I pay tax on crypto gains?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In most jurisdictions yes. The UK, US, Australia and most EU countries treat cryptocurrency as a capital asset. Disposing of crypto — selling, swapping or spending it — is typically a taxable event subject to capital gains tax."
            }
          },
          {
            "@type": "Question",
            "name": "How is crypto capital gains tax calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CGT is calculated as: (Sell Price - Buy Price) x Quantity = Gross Gain. Then subtract your annual CGT allowance to get Taxable Gain. Multiply by your CGT rate to get estimated tax. In the UK the 2024/25 allowance is £3,000."
            }
          },
          {
            "@type": "Question",
            "name": "What is the crypto CGT allowance in the UK?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The UK Capital Gains Tax annual exempt amount for 2024/25 is £3,000. Gains below this threshold in a tax year are not subject to CGT. The UK tax year runs from 6 April to 5 April."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if I make a crypto loss?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Capital losses can typically be offset against capital gains in the same tax year, reducing your overall CGT liability. In the UK and US, unused losses can be carried forward to future tax years. Rules vary by jurisdiction."
            }
          },
          {
            "@type": "Question",
            "name": "Is this a real tax calculation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. This is an educational estimate based on simplified generic tax rules. It does not account for your full financial situation, other gains or losses, income tax band interactions, or jurisdiction-specific rules. Always consult a qualified tax professional."
            }
          }
        ]
      }} />

      <TaxClient />

      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <TrustBadge />

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              How this calculator works
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              This calculator uses a simplified CGT formula: it calculates 
              your gross gain from the difference between sell and buy values, 
              deducts the annual CGT allowance for your jurisdiction, then 
              applies the appropriate tax rate to give an estimated liability. 
              All logic is deterministic and based on the inputs you provide — 
              no data is stored or transmitted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Understanding crypto capital gains tax
            </h2>
            <p className="text-crypto-muted-foreground text-sm leading-relaxed">
              Most countries treat cryptocurrency as a capital asset rather 
              than currency. This means every disposal — selling, swapping 
              one crypto for another, or spending crypto — is potentially 
              a taxable event. Your gain is the difference between what you 
              paid (cost basis) and what you received (proceeds). Each 
              jurisdiction has different allowances, rates and reporting 
              requirements. This tool gives a rough estimate — for accurate 
              reporting always use dedicated tax software or a qualified 
              accountant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do I pay tax on crypto gains?",
                  a: "In most jurisdictions yes — selling, swapping or spending crypto is typically a taxable disposal subject to capital gains tax."
                },
                {
                  q: "How is crypto capital gains tax calculated?",
                  a: "(Sell Price - Buy Price) × Quantity = Gross Gain. Subtract annual allowance = Taxable Gain. Multiply by CGT rate = Estimated Tax."
                },
                {
                  q: "What is the crypto CGT allowance in the UK?",
                  a: "£3,000 for 2024/25. Gains below this in a tax year are not subject to CGT. Tax year runs 6 April to 5 April."
                },
                {
                  q: "What happens if I make a crypto loss?",
                  a: "Capital losses can typically be offset against gains in the same tax year, reducing your CGT liability."
                },
                {
                  q: "Is this a real tax calculation?",
                  a: "No — this is an educational estimate using simplified rules. Always consult a qualified tax professional for your actual liability."
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
              ].map(({ href, label, desc }) => (
                <a
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
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}