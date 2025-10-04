import type { Metadata } from "next";
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
  title: "CrypCal - Professional Crypto Calculators",
  description: "Professional cryptocurrency calculators for traders and investors. Calculate profits, DCA strategies, staking rewards, and more.",
  keywords: ["cryptocurrency", "calculator", "trading", "bitcoin", "ethereum", "profit", "loss", "DCA", "staking"],
  authors: [{ name: "CrypCal Team" }],
  creator: "CrypCal",
  publisher: "CrypCal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://crypcal.com'),
  openGraph: {
    title: "CrypCal - Professional Crypto Calculators",
    description: "Professional cryptocurrency calculators for traders and investors",
    url: "https://crypcal.com",
    siteName: "CrypCal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrypCal - Professional Crypto Calculators",
    description: "Professional cryptocurrency calculators for traders and investors",
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-crypto-background text-crypto-foreground`}
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
        {children}
      </body>
    </html>
  );
}
