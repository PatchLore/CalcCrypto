import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { CALCULATORS } from '@/lib/constants';

export default function CalculatorsPage() {
  const calculatorsByCategory = CALCULATORS.reduce((acc, calculator) => {
    if (!acc[calculator.category]) {
      acc[calculator.category] = [];
    }
    acc[calculator.category].push(calculator);
    return acc;
  }, {} as Record<string, typeof CALCULATORS>);

  const categoryLabels = {
    'profit-loss': 'Trading',
    'dca': 'Investment',
    'staking': 'Earning',
    'mining': 'Mining',
    'tax': 'Tax',
    'portfolio': 'Portfolio',
    'conversion': 'Tools',
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card mx-4 mt-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl gold-accent rounded-lg p-2">₿</div>
              <h1 className="text-2xl font-bold text-primary">
                CrypCal
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-secondary hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/calculators" className="text-primary font-medium">
                Calculators
              </Link>
              <Link href="/about" className="text-secondary hover:text-primary transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            All Calculators
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Choose from our comprehensive suite of cryptocurrency calculators designed for traders, investors, and enthusiasts.
          </p>
        </div>

        {/* Calculators by Category */}
        {Object.entries(calculatorsByCategory).map(([category, calculators]) => (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-semibold text-primary mb-6">
              {categoryLabels[category as keyof typeof categoryLabels] || category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calculator) => (
                <Link key={calculator.id} href={calculator.path} className="block">
                  <Card className="cursor-pointer group h-full">
                    <CardHeader>
                      <div className="text-4xl mb-2">{calculator.icon}</div>
                      <CardTitle className="group-hover:text-yellow-300 transition-colors">
                        {calculator.name}
                      </CardTitle>
                      <CardDescription>
                        {calculator.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="text-sm font-medium text-primary">Inputs:</div>
                        <div className="text-sm text-tertiary">
                          {calculator.inputs.join(', ')}
                        </div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="text-sm font-medium text-primary">Outputs:</div>
                        <div className="text-sm text-tertiary">
                          {calculator.outputs.join(', ')}
                        </div>
                      </div>
                      <div className="btn-primary w-full text-center">
                        Use Calculator
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


