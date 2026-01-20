import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
  description: "Free crypto calculators with clear, deterministic results. No signup. Privacy-first by default.",
  keywords: ["cryptocurrency", "calculator", "trading", "bitcoin", "ethereum", "profit", "loss", "DCA", "staking"],
  authors: [{ name: "CrypCal Team" }],
  creator: "CrypCal",
  publisher: "CrypCal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.calccrypto.com'),
  openGraph: {
    title: "CrypCal | Free crypto calculators • No signup • Privacy-first",
    description: "Free crypto calculators with clear, deterministic results. No signup. Privacy-first by default.",
    url: "https://www.calccrypto.com",
    siteName: "CrypCal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrypCal | Free crypto calculators • No signup • Privacy-first",
    description: "Free crypto calculators with clear, deterministic results. No signup. Privacy-first by default.",
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
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-crypto-background text-crypto-foreground flex flex-col`}
      >
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
        <main className="flex-1">{children}</main>
        <footer className="border-t border-crypto-border bg-crypto-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-crypto-muted-foreground">
              <div>© 2025 CrypCal. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-crypto-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-crypto-foreground transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
