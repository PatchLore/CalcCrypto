export type Phase2SupportedChain = 'ethereum' | 'solana' | 'base' | 'arbitrum' | 'bsc';

export type TokenSnapshot = {
  chainId: Phase2SupportedChain;
  pairAddress: string;
  dexId: string;
  url?: string;
  address?: string;

  baseToken: {
    address: string;
    symbol: string;
    name: string;
  };

  priceUsd: number | null;
  liquidityUsd: number | null;
  fdvUsd: number | null;
  volume24hUsd: number | null;

  fetchedAt: Date;
};

export type RiskLevel = 'low' | 'medium' | 'high';

export type RiskContext = {
  score: number;
  riskLevel: RiskLevel;
  warnings: string[];
  summary: string;
  derived: {
    liqToFdv: number | null;
    volToLiq: number | null;
  };
};


