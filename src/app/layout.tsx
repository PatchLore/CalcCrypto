import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FeedbackForm from "@/components/FeedbackForm";
import SupportSection from "@/components/SupportSection";
import LaunchBanner from "@/components/LaunchBanner";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrypCal | Free crypto calculators • No signup • Privacy-first",
  description:
    "Free crypto calculators with clear, deterministic results. No signup. Privacy-first by default.",
  keywords: [
    "cryptocurrency",
    "calculator",
    "trading",
    "bitcoin",
    "ethereum",
    "profit",
    "loss",
    "DCA",
    "staking",
  ],
  authors: [{ name: "CrypCal Team" }],
  creator: "CrypCal",
  publisher: "CrypCal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.calccrypto.com"),
  openGraph: {
    title: "CrypCal | Free crypto calculators • No signup • Privacy-first",
    description:
      "Free crypto calculators with clear, deterministic results. No signup. Privacy-first by default.",
    url: "https://www.calccrypto.com",
    siteName: "CrypCal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrypCal | Free crypto calculators • No signup • Privacy-first",
    description:
      "Free crypto calculators with clear, deterministic results. No signup. Privacy-first by default.",
    creator: "@crypcal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.coingecko.com" />
        <link rel="preconnect" href="https://api.dexscreener.com" />
        <link rel="dns-prefetch" href="https://api.coingecko.com" />
        <link rel="dns-prefetch" href="https://api.dexscreener.com" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-crypto-background text-crypto-foreground flex flex-col`}
      >
        {/* FIX-2D: Skip navigation link for keyboard accessibility */}
        <a
          href="#main-content"
          className="
            fixed top-0 left-0 z-[9999]
            px-4 py-3 text-sm font-semibold
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            border-b-2 border-blue-600
            shadow-md rounded-br-lg
            -translate-y-full focus:translate-y-0
            transition-transform duration-150
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        >
          Skip to main content
        </a>

        <JsonLd schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "CrypCal",
          "alternateName": "CalcCrypto",
          "url": "https://calccrypto.com",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "Free cryptocurrency calculators for trading profit and loss, dollar cost averaging, staking rewards, mining profitability and token price analysis. Educational estimates only, no signup required.",
          "featureList": [
            "Profit & Loss Calculator",
            "DCA Calculator",
            "Staking Rewards Calculator",
            "Mining Profitability Calculator",
            "Crypto Conversion Calculator",
            "Token Price & Risk Analyser"
          ],
          "isAccessibleForFree": true,
          "inLanguage": "en"
        }} />

        <JsonLd schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "CrypCal",
          "url": "https://calccrypto.com",
          "description": "Free cryptocurrency calculator tools. Educational, deterministic, no financial advice.",
          "foundingDate": "2024",
          "knowsAbout": [
            "Cryptocurrency",
            "Bitcoin",
            "Ethereum",
            "DeFi",
            "Crypto Trading",
            "Staking",
            "Mining"
          ]
        }} />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YK1TEZY3SF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YK1TEZY3SF');
          `}
        </Script>
        <GoogleAnalytics />
        {/* Launch Banner - shows at top of all pages */}
        <LaunchBanner />
        {/* FIX-2D: Main content target for skip link */}
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
        <footer className="border-t border-crypto-border bg-crypto-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-4 text-sm text-crypto-muted-foreground">
              <SupportSection />
              <FeedbackForm />
              
              {/* Legal Disclaimer - Required on all pages */}
              <div className="text-xs text-crypto-muted-foreground border-t border-crypto-border pt-4">
                <p>
                  CalCrypto provides educational calculators only. All outputs are estimates based on public data. 
                  This is not financial, tax, or legal advice. Cryptoassets are volatile and unregulated in many jurisdictions. 
                  Consult a licensed professional before making decisions. We do not store user data or connect to wallets.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>© 2026 CrypCal. All rights reserved.</div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/privacy"
                    className="hover:text-crypto-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-crypto-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
