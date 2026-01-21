import type { CalculatorConfig, NavigationItem } from '@/types';

/**
 * Calculator configurations
 */
export const CALCULATORS: CalculatorConfig[] = [
  {
    id: 'profit-loss',
    name: 'Profit/Loss Calculator',
    description: 'Calculate your crypto trading profits and losses',
    category: 'profit-loss',
    icon: '📈',
    path: '/calculators/profit-loss',
    inputs: ['Buy Price', 'Sell Price', 'Quantity', 'Fees'],
    outputs: ['Profit/Loss', 'Percentage', 'ROI'],
    featured: true,
  },
  {
    id: 'position-size',
    name: 'Position Size Calculator',
    description: 'Calculate how much to buy based on risk tolerance and stop-loss.',
    category: 'profit-loss',
    icon: '🎯',
    path: '/calculators/position-size',
    inputs: ['Account Size (USD)', 'Risk Per Trade (%)', 'Entry Price (USD)', 'Stop-Loss Price (USD)'],
    outputs: ['Position Size (units)', 'Dollar Amount to Invest', 'Maximum Loss (stop-loss hit)'],
    featured: true,
  },
  {
    id: 'dca',
    name: 'DCA Calculator',
    description: 'Dollar Cost Averaging strategy calculator',
    category: 'dca',
    icon: '💰',
    path: '/calculators/dca',
    inputs: ['Monthly Amount', 'Duration', 'Average Price'],
    outputs: ['Total Invested', 'Current Value', 'Profit/Loss'],
    featured: true,
  },
  {
    id: 'staking',
    name: 'Staking Calculator',
    description: 'Calculate staking rewards with compound interest',
    category: 'staking',
    icon: '🏦',
    path: '/calculators/staking',
    inputs: ['Amount', 'APY', 'Duration', 'Compound Frequency'],
    outputs: ['Final Amount', 'Total Rewards', 'Effective APY'],
    featured: true,
  },
  {
    id: 'mining',
    name: 'Mining Calculator',
    description: 'Calculate cryptocurrency mining profitability',
    category: 'mining',
    icon: '⛏️',
    path: '/calculators/mining',
    inputs: ['Hashrate', 'Power Consumption', 'Electricity Cost'],
    outputs: ['Daily Profit', 'Monthly Profit', 'Break-even Time'],
    featured: false,
  },
  {
    id: 'tax',
    name: 'Tax Calculator',
    description: 'Calculate crypto tax implications',
    category: 'tax',
    icon: '🧾',
    path: '/calculators/tax',
    inputs: ['Buy Price', 'Sell Price', 'Quantity', 'Tax Rate'],
    outputs: ['Taxable Gain', 'Tax Amount', 'Net Profit'],
    featured: false,
  },
  {
    id: 'portfolio',
    name: 'Portfolio Tracker',
    description: 'Track and analyze your crypto portfolio',
    category: 'portfolio',
    icon: '📊',
    path: '/calculators/portfolio',
    inputs: ['Holdings', 'Buy Prices', 'Current Prices'],
    outputs: ['Total Value', 'P&L', 'Allocation'],
    featured: false,
  },
  {
    id: 'conversion',
    name: 'Currency Converter',
    description: 'Convert between different cryptocurrencies',
    category: 'conversion',
    icon: '🔄',
    path: '/calculators/conversion',
    inputs: ['Amount', 'From Currency', 'To Currency'],
    outputs: ['Converted Amount', 'Exchange Rate'],
    featured: false,
  },
];

/**
 * Navigation items
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: '🏠',
    description: 'Go back to the homepage',
  },
  {
    name: 'Calculators',
    href: '/calculators',
    icon: '🧮',
    description: 'Browse all calculators',
    category: 'basic',
  },
  {
    name: 'Profit/Loss',
    href: '/calculators/profit-loss',
    icon: '📈',
    description: 'Calculate trading profits and losses',
    category: 'basic',
  },
  {
    name: 'DCA',
    href: '/calculators/dca',
    icon: '💰',
    description: 'Dollar Cost Averaging calculator',
    category: 'basic',
  },
  {
    name: 'Staking',
    href: '/calculators/staking',
    icon: '🏦',
    description: 'Staking rewards calculator',
    category: 'basic',
  },
  {
    name: 'Mining',
    href: '/calculators/mining',
    icon: '⛏️',
    description: 'Mining profitability calculator',
    category: 'advanced',
  },
  {
    name: 'Tax',
    href: '/calculators/tax',
    icon: '🧾',
    description: 'Crypto tax calculator',
    category: 'tools',
  },
  {
    name: 'Portfolio',
    href: '/calculators/portfolio',
    icon: '📊',
    description: 'Portfolio tracking and analysis',
    category: 'tools',
  },
];

/**
 * Popular cryptocurrencies
 */
export const POPULAR_CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin', color: '#f7931a' },
  { symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
  { symbol: 'BNB', name: 'Binance Coin', color: '#f3ba2f' },
  { symbol: 'ADA', name: 'Cardano', color: '#0033ad' },
  { symbol: 'SOL', name: 'Solana', color: '#9945ff' },
  { symbol: 'XRP', name: 'Ripple', color: '#23292f' },
  { symbol: 'DOT', name: 'Polkadot', color: '#e6007a' },
  { symbol: 'DOGE', name: 'Dogecoin', color: '#c2a633' },
  { symbol: 'AVAX', name: 'Avalanche', color: '#e84142' },
  { symbol: 'MATIC', name: 'Polygon', color: '#8247e5' },
];

/**
 * Default calculator inputs
 */
export const DEFAULT_INPUTS = {
  profitLoss: {
    buyPrice: 0,
    sellPrice: 0,
    quantity: 0,
    fees: 0.1, // 0.1% default fee
  },
  dca: {
    monthlyAmount: 100,
    months: 12,
    averagePrice: 0,
    fees: 0.1,
  },
  staking: {
    amount: 1000,
    stakingRate: 5, // 5% APY
    duration: 365, // 1 year in days
    compoundFrequency: 'daily' as const,
  },
  mining: {
    hashrate: 100, // TH/s
    powerConsumption: 3000, // Watts
    electricityCost: 0.12, // $0.12 per kWh
    poolFee: 1, // 1%
    difficulty: 1,
    price: 0,
  },
};

/**
 * App configuration
 */
export const APP_CONFIG = {
  name: 'CrypCal',
  description: 'Professional cryptocurrency calculators for traders and investors',
  version: '1.0.0',
  author: 'CrypCal Team',
  website: 'https://crypcal.com',
  supportEmail: 'crypcal@mail.com',
  social: {
    twitter: '@crypcal',
    github: 'crypcal',
    discord: 'crypcal',
  },
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  prices: '/api/prices',
  history: '/api/history',
  calculator: '/api/calculator',
  currencies: '/api/currencies',
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  theme: 'crypcal-theme',
  calculatorHistory: 'crypcal-calculator-history',
  userPreferences: 'crypcal-user-preferences',
  portfolio: 'crypcal-portfolio',
};

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  minAmount: 0.00000001,
  maxAmount: 1000000000,
  minPrice: 0.00000001,
  maxPrice: 1000000,
  minPercentage: 0,
  maxPercentage: 10000,
  minDuration: 1,
  maxDuration: 3650, // 10 years
};



