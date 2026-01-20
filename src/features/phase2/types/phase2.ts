export type Phase2SupportedChain = 'ethereum';

export type TokenSnapshot = {
  chainId: Phase2SupportedChain;
  pairAddress: string;
  dexId: string;
  url?: string;

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

export type Phase2ErrorCode =
  | 'INVALID_ADDRESS'
  | 'UNSUPPORTED_CHAIN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'PARSE_ERROR';

export class Phase2Error extends Error {
  readonly code: Phase2ErrorCode;

  constructor(code: Phase2ErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'Phase2Error';
  }
}

