import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function TermsOfServicePage() {
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
              <CardTitle>Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-crypto-muted-foreground">
              <p>By using CalCrypto, you agree to the following terms.</p>

              <div>
                <div className="font-semibold text-crypto-foreground">Informational Use Only:</div>
                <p>
                  CalCrypto is an informational tool designed to provide calculations and contextual insights based on
                  publicly available data. It does not provide financial, investment, tax, or legal advice.
                </p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">No Guarantees:</div>
                <p>
                  All data and calculations are provided on a best-effort basis. CalCrypto makes no guarantees regarding
                  accuracy, completeness, or timeliness of information.
                </p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">No Transactions:</div>
                <p>CalCrypto does not facilitate transactions, wallet connections, or asset management.</p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Limitation of Liability:</div>
                <p>
                  Use of CalCrypto is at your own risk. CalCrypto is not responsible for financial losses, decisions, or
                  outcomes resulting from use of the app.
                </p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Third-Party Data:</div>
                <p>
                  CalCrypto may display data from third-party sources. CalCrypto is not responsible for the accuracy or
                  availability of third-party services.
                </p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Changes to Service:</div>
                <p>CalCrypto may update or modify features at any time without notice.</p>
              </div>

              <div>
                <div className="font-semibold text-crypto-foreground">Governing Law:</div>
                <p>These terms are governed by the laws of the United Kingdom.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

