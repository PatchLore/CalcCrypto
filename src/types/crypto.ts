// Crypto currency types
export interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  image?: string;
}

// Calculator input types
export interface CalculatorInput {
  amount: number;
  price: number;
  fees?: number;
  timeframe?: number;
}

// Calculator result types
export interface CalculatorResult {
  result: number;
  breakdown?: {
    principal: number;
    gains: number;
    fees: number;
    net: number;
  };
  metadata?: {
    calculationType: string;
    timestamp: Date;
    inputs: Record<string, unknown>;
  };
}

// Specific calculator types
export interface ProfitLossInput {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  fees: number;
}

export interface DCAInput extends CalculatorInput {
  averagePrice: number;
}

export interface StakingInput {
  amount: number;
  stakingRate: number; // Annual percentage
  duration: number; // In days
  compoundFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface MiningInput {
  hashrate: number; // TH/s
  powerConsumption: number; // Watts
  electricityCost: number; // per kWh
  poolFee: number; // percentage
  difficulty: number;
  price: number;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface ChartData {
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'area';
  color?: string;
  label: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface PriceHistoryResponse {
  prices: ChartDataPoint[];
  marketCaps: ChartDataPoint[];
  totalVolumes: ChartDataPoint[];
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Navigation types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
  category?: 'basic' | 'advanced' | 'tools';
}

// Calculator category types
export type CalculatorCategory = 
  | 'profit-loss'
  | 'dca'
  | 'staking'
  | 'mining'
  | 'tax'
  | 'portfolio'
  | 'conversion';

export interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  category: CalculatorCategory;
  icon: string;
  path: string;
  inputs: string[];
  outputs: string[];
  featured?: boolean;
}



