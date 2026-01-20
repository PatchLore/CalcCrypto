'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

type CurrencyOption =
  | { type: 'fiat'; code: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' }
  | { type: 'crypto'; id: string; symbol: string; label: string };

type ConversionResult = {
  convertedAmount: number;
  rate: number; // 1 FROM = rate TO
  rateText: string;
  source: 'CoinGecko' | 'ExchangeRate-API';
};

const FIATS: Array<CurrencyOption & { type: 'fiat' }> = [
  { type: 'fiat', code: 'USD' },
  { type: 'fiat', code: 'EUR' },
  { type: 'fiat', code: 'GBP' },
  { type: 'fiat', code: 'JPY' },
  { type: 'fiat', code: 'AUD' },
  { type: 'fiat', code: 'CAD' },
];

const CRYPTOS: Array<CurrencyOption & { type: 'crypto' }> = [
  { type: 'crypto', id: 'bitcoin', symbol: 'BTC', label: 'Bitcoin' },
  { type: 'crypto', id: 'ethereum', symbol: 'ETH', label: 'Ethereum' },
  { type: 'crypto', id: 'solana', symbol: 'SOL', label: 'Solana' },
  { type: 'crypto', id: 'binancecoin', symbol: 'BNB', label: 'BNB' },
  { type: 'crypto', id: 'usd-coin', symbol: 'USDC', label: 'USD Coin' },
  { type: 'crypto', id: 'tether', symbol: 'USDT', label: 'Tether' },
];

const ALL_OPTIONS: CurrencyOption[] = [...CRYPTOS, ...FIATS];

function optionLabel(opt: CurrencyOption) {
  return opt.type === 'fiat' ? opt.code : `${opt.symbol} — ${opt.label}`;
}

function optionKey(opt: CurrencyOption) {
  return opt.type === 'fiat' ? `fiat:${opt.code}` : `crypto:${opt.id}`;
}

function formatFiat(amount: number, code: CurrencyOption extends { type: 'fiat' } ? never : never, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatNumber(value: number, maxDecimals: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: maxDecimals }).format(value);
}

async function fetchCoinGeckoPrices(ids: string[], vs: string[]) {
  const url = new URL('https://api.coingecko.com/api/v3/simple/price');
  url.searchParams.set('ids', ids.join(','));
  url.searchParams.set('vs_currencies', vs.join(','));

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    throw new Error(`CoinGecko request failed (${res.status})`);
  }
  return (await res.json()) as Record<string, Record<string, number>>;
}

async function fetchFiatRatesUSDBase() {
  // Free public endpoint, no API key required.
  const res = await fetch('https://open.er-api.com/v6/latest/USD', { method: 'GET' });
  if (!res.ok) {
    throw new Error(`ExchangeRate-API request failed (${res.status})`);
  }
  const data = await res.json() as { result: string; rates?: Record<string, number> };
  if (data.result !== 'success' || !data.rates) {
    throw new Error('ExchangeRate-API returned an invalid response');
  }
  return data.rates;
}

export function ConversionClient() {
  const [amount, setAmount] = useState('');
  const [fromKey, setFromKey] = useState(optionKey({ type: 'fiat', code: 'USD' }));
  const [toKey, setToKey] = useState(optionKey({ type: 'crypto', id: 'bitcoin', symbol: 'BTC', label: 'Bitcoin' }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);

  const parsedAmount = parseFloat(amount);

  const from = useMemo(() => ALL_OPTIONS.find((o) => optionKey(o) === fromKey) ?? FIATS[0], [fromKey]);
  const to = useMemo(() => ALL_OPTIONS.find((o) => optionKey(o) === toKey) ?? CRYPTOS[0], [toKey]);

  const amountError = useMemo(() => {
    if (amount.trim() === '') return undefined;
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return 'Amount must be a positive number.';
    return undefined;
  }, [amount, parsedAmount]);

  const handleConvert = async () => {
    setError(null);
    setResult(null);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter a valid amount to convert.');
      return;
    }

    if (fromKey === toKey) {
      setResult({
        convertedAmount: parsedAmount,
        rate: 1,
        rateText: `1 ${optionLabel(from)} = 1 ${optionLabel(to)}`,
        source: 'CoinGecko',
      });
      return;
    }

    setLoading(true);
    try {
      // Fiat -> Fiat
      if (from.type === 'fiat' && to.type === 'fiat') {
        const rates = await fetchFiatRatesUSDBase();
        const fromRate = rates[from.code];
        const toRate = rates[to.code];
        if (!fromRate || !toRate) throw new Error('Selected fiat currency is not supported by the rate provider.');

        // rates: 1 USD = X <currency>
        const rate = toRate / fromRate; // 1 FROM = rate TO
        const convertedAmount = parsedAmount * rate;

        setResult({
          convertedAmount,
          rate,
          rateText: `1 ${from.code} = ${formatNumber(rate, 8)} ${to.code}`,
          source: 'ExchangeRate-API',
        });
        return;
      }

      // Crypto -> Fiat
      if (from.type === 'crypto' && to.type === 'fiat') {
        const prices = await fetchCoinGeckoPrices([from.id], [to.code.toLowerCase()]);
        const p = prices[from.id]?.[to.code.toLowerCase()];
        if (!Number.isFinite(p)) throw new Error('Rate data was unavailable for the selected pair.');

        const rate = p; // 1 crypto = p fiat
        setResult({
          convertedAmount: parsedAmount * rate,
          rate,
          rateText: `1 ${from.symbol} = ${formatNumber(rate, 8)} ${to.code}`,
          source: 'CoinGecko',
        });
        return;
      }

      // Fiat -> Crypto
      if (from.type === 'fiat' && to.type === 'crypto') {
        const prices = await fetchCoinGeckoPrices([to.id], [from.code.toLowerCase()]);
        const p = prices[to.id]?.[from.code.toLowerCase()];
        if (!Number.isFinite(p) || p <= 0) throw new Error('Rate data was unavailable for the selected pair.');

        const rate = 1 / p; // 1 fiat = rate crypto
        setResult({
          convertedAmount: parsedAmount * rate,
          rate,
          rateText: `1 ${from.code} = ${formatNumber(rate, 12)} ${to.symbol}`,
          source: 'CoinGecko',
        });
        return;
      }

      // Crypto -> Crypto (via USD)
      if (from.type === 'crypto' && to.type === 'crypto') {
        const prices = await fetchCoinGeckoPrices([from.id, to.id], ['usd']);
        const fromUsd = prices[from.id]?.usd;
        const toUsd = prices[to.id]?.usd;
        if (!Number.isFinite(fromUsd) || !Number.isFinite(toUsd) || toUsd <= 0) {
          throw new Error('Rate data was unavailable for the selected pair.');
        }

        const rate = fromUsd / toUsd; // 1 from = rate to
        setResult({
          convertedAmount: parsedAmount * rate,
          rate,
          rateText: `1 ${from.symbol} = ${formatNumber(rate, 12)} ${to.symbol}`,
          source: 'CoinGecko',
        });
        return;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Conversion failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const convertedDisplay = useMemo(() => {
    if (!result) return null;
    if (to.type === 'fiat') return formatFiat(result.convertedAmount, (null as unknown as never), to.code);
    return formatNumber(result.convertedAmount, 8);
  }, [result, to]);

  return (
    <div className="min-h-screen bg-crypto-background">
      {/* Header */}
      <header className="border-b border-crypto-border bg-crypto-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">₿</div>
              <div className="text-2xl font-bold text-crypto-primary-600 dark:text-crypto-primary-400">
                CrypCal
              </div>
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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🔄</div>
            <h1 className="text-4xl font-bold text-crypto-foreground mb-4">
              Currency Converter
            </h1>
            <p className="text-xl text-crypto-muted-foreground">
              Convert between crypto and fiat using read-only exchange rates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Convert</CardTitle>
                <CardDescription>
                  Enter an amount and select currencies to convert.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Amount"
                  type="number"
                  step="0.00000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 100"
                  error={amountError}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-crypto-foreground mb-2">
                      From currency
                    </label>
                    <select
                      value={fromKey}
                      onChange={(e) => setFromKey(e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-crypto-border rounded-md bg-crypto-background text-crypto-foreground focus:outline-none focus:ring-2 focus:ring-crypto-ring"
                    >
                      <optgroup label="Crypto">
                        {CRYPTOS.map((c) => (
                          <option key={optionKey(c)} value={optionKey(c)}>{optionLabel(c)}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Fiat">
                        {FIATS.map((f) => (
                          <option key={optionKey(f)} value={optionKey(f)}>{optionLabel(f)}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-crypto-foreground mb-2">
                      To currency
                    </label>
                    <select
                      value={toKey}
                      onChange={(e) => setToKey(e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-crypto-border rounded-md bg-crypto-background text-crypto-foreground focus:outline-none focus:ring-2 focus:ring-crypto-ring"
                    >
                      <optgroup label="Crypto">
                        {CRYPTOS.map((c) => (
                          <option key={optionKey(c)} value={optionKey(c)}>{optionLabel(c)}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Fiat">
                        {FIATS.map((f) => (
                          <option key={optionKey(f)} value={optionKey(f)}>{optionLabel(f)}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleConvert}
                  loading={loading}
                >
                  Convert
                </Button>

                <div className="text-xs text-crypto-muted-foreground">
                  Rates are read-only and may be delayed.
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>
                  Converted amount and exchange rate used.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="rounded-lg border border-crypto-error-500/30 bg-crypto-error-50/10 p-4 text-sm text-crypto-error-500">
                    {error}
                  </div>
                )}

                {!error && !result && (
                  <div className="text-center py-12 text-crypto-muted-foreground">
                    <div className="text-4xl mb-4">🧮</div>
                    <p>Enter inputs and click “Convert” to see the result.</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    <div className="rounded-lg border border-crypto-border bg-crypto-background/40 p-5">
                      <div className="text-sm text-crypto-muted-foreground">Converted amount</div>
                      <div className="mt-1 text-3xl font-bold text-crypto-foreground">
                        {convertedDisplay}{to.type === 'crypto' ? ` ${to.symbol}` : ''}
                      </div>
                    </div>

                    <div className="text-sm text-crypto-muted-foreground">
                      <div className="font-medium text-crypto-foreground">Exchange rate used</div>
                      <div className="mt-1">{result.rateText}</div>
                      <div className="mt-2 text-xs">Source: {result.source}</div>
                    </div>

                    <div className="text-xs text-crypto-muted-foreground border-t border-crypto-border pt-4">
                      Rates are read-only and may be delayed.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

