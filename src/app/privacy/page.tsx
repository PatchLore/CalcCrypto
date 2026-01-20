import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-crypto-background">
      {/* Header */}
      <header className="border-b border-crypto-border bg-crypto-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">₿</div>
              <h1 className="text-2xl font-bold text-crypto-primary-600 dark:text-crypto-primary-400">
                CrypCal
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors">
                Home
              </Link>
              <Link href="/calculators" className="text-crypto-foreground hover:text-crypto-primary-600 transition-colors">
                Calculators
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>CalCrypto respects your privacy.</p>

              <p>
                CalCrypto does not require user accounts and does not collect or store personal information such as
                names, email addresses, wallet addresses, or payment details.
              </p>

              <div>
                <div className="font-semibold text-crypto-foreground">Data Collection:</div>
                <p>
                  CalCrypto operates as a read-only informational tool. We do not collect personally identifiable
                  information.
                </p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Third-Party Data:</div>
                <p>
                  CalCrypto may fetch public, read-only blockchain market data from third-party services such as
                  DexScreener. This data is used solely to display market context and is not linked to individual
                  users.
                </p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Analytics:</div>
                <p>
                  We may collect anonymous usage analytics to understand general feature usage. These analytics do not
                  identify individual users and do not track personal behavior across sessions.
                </p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Cookies:</div>
                <p>CalCrypto does not use cookies for advertising or user profiling.</p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Financial Information Disclaimer:</div>
                <p>
                  CalCrypto provides informational context only and does not provide financial, investment, or trading
                  advice.
                </p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Changes:</div>
                <p>
                  This Privacy Policy may be updated occasionally to reflect changes to the app. Continued use of
                  CalCrypto indicates acceptance of the current policy.
                </p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Contact:</div>
                <p>
                  If you have questions about this Privacy Policy, you may contact us via the information provided on
                  the website.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

