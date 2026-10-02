import type { Asset } from './types';
const candidate = (id: string, name: string, symbol: string, category: Asset['category'], color: string, provider: string, sourceUrl: string, kind: Asset['kind'] = 'price', unit = 'USD'): Asset => ({
  id, name, symbol, category, color, provider, sourceUrl, kind, unit, enabled: false, licensed: false,
  storage: 'display-not-permitted', frequency: 'Daily observations',
  disclosure: 'Currently unavailable. Public display and storage permission required.',
});
const fx = (id: string, name: string, symbol: string, color: string): Asset => ({
  id, name, symbol, color, category: 'macro', unit: `${symbol} per EUR`, kind: 'price', provider: 'ECB statistics',
  sourceUrl: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
  enabled: true, licensed: true, storage: 'persistable', frequency: 'Business-day reference rate, around 16:00 CET',
  disclosure: `${symbol} per euro reference rate, not a closing auction or tradeable total return. ${symbol === 'USD' ? 'Higher values mean a weaker dollar against the euro. This is not DXY or a broad dollar index.' : 'Bilateral euro reference rate; not a broad currency index.'}`,
});
export const ASSETS: Asset[] = [
  candidate('btc', 'Bitcoin', 'BTC', 'crypto', '#f6b45a', 'CoinLore (permission pending)', 'https://www.coinlore.com/cryptocurrency-data-api'),
  candidate('eth', 'Ethereum', 'ETH', 'crypto', '#ab9bff', 'CoinLore (permission pending)', 'https://www.coinlore.com/cryptocurrency-data-api'),
  fx('eurusd', 'Dollar / euro reference', 'USD', '#68e2c5'),
  fx('eurgbp', 'Sterling / euro reference', 'GBP', '#8bacfa'),
  fx('eurjpy', 'Yen / euro reference', 'JPY', '#df9cd9'),
  candidate('gold', 'Gold', 'GOLD', 'macro', '#d8ca81', 'Alpha Vantage (permission pending)', 'https://www.alphavantage.co/documentation/'),
  candidate('ust10', 'US Treasury 10-year yield', 'US10Y', 'macro', '#e4a2ad', 'US Treasury (review pending)', 'https://home.treasury.gov/treasury-daily-interest-rate-xml-feed', 'rate', '%'),
  candidate('vix', 'Cboe volatility index', 'VIX', 'macro', '#91a0b2', 'Cboe via FRED (permission pending)', 'https://fred.stlouisfed.org/series/VIXCLS', 'index', 'Index'),
  candidate('liquidity', 'USDT + USDC market cap', 'LIQ', 'crypto', '#79baca', 'CoinGecko (permission pending)', 'https://www.coingecko.com/en/api', 'supply', 'USD'),
  candidate('dominance', 'BTC dominance', 'BTC.D', 'crypto', '#deaa86', 'CoinLore (permission pending)', 'https://www.coinlore.com/cryptocurrency-data-api', 'index', '%'),
  candidate('nasdaq', 'Nasdaq Composite', 'NASDAQ', 'macro', '#a4b6d4', 'Nasdaq (licensing required)', 'https://fred.stlouisfed.org/series/NASDAQCOM', 'index', 'Index'),
  candidate('sp500', 'S&P 500', 'S&P', 'macro', '#d3b99b', 'S&P Dow Jones Indices (licensing required)', 'https://fred.stlouisfed.org/series/SP500', 'index', 'Index'),
];
