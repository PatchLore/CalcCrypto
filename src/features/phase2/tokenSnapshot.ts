export type Phase2TokenSnapshot = {
  chainId: string;
  dexId: string;
  pairAddress: string;
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

export type Phase2TokenSnapshotErrorCode =
  | 'INVALID_ADDRESS'
  | 'UNSUPPORTED_CHAIN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'PARSE_ERROR';

export class Phase2TokenSnapshotError extends Error {
  readonly code: Phase2TokenSnapshotErrorCode;

  constructor(code: Phase2TokenSnapshotErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'Phase2TokenSnapshotError';
  }
}

/**
 * Phase 2-only EVM address validation (0x + 40 hex chars).
 * Note: this is syntactic validation only (not checksum validation).
 */
export function isPhase2EvmContractAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

type DexScreenerTokenResponse = {
  pairs?: Array<{
    chainId?: string;
    dexId?: string;
    pairAddress?: string;
    url?: string;
    baseToken?: { address?: string; symbol?: string; name?: string };
    priceUsd?: string;
    liquidity?: { usd?: number };
    fdv?: number;
    volume?: { h24?: number };
  }>;
};

function safeNumberFromString(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function safeNumber(value: unknown): number | null {
  if (typeof value !== 'number') return null;
  return Number.isFinite(value) ? value : null;
}

function selectBestPairForChain(
  pairs: DexScreenerTokenResponse['pairs'],
  chainId: string
): NonNullable<DexScreenerTokenResponse['pairs']>[number] | null {
  if (!pairs || pairs.length === 0) return null;

  const filtered = pairs.filter(p => (p.chainId ?? '').toLowerCase() === chainId.toLowerCase());
  if (filtered.length === 0) return null;

  // Prefer the pair with the highest USD liquidity (most reliable pricing).
  let best = filtered[0];
  let bestLiq = safeNumber(best.liquidity?.usd) ?? -1;

  for (const p of filtered) {
    const liq = safeNumber(p.liquidity?.usd) ?? -1;
    if (liq > bestLiq) {
      best = p;
      bestLiq = liq;
    }
  }

  return best ?? null;
}

/**
 * Phase 2-only token snapshot fetcher using DexScreener's public endpoint.
 * Read-only: only performs GET requests and does not integrate with existing app APIs.
 */
export async function fetchPhase2TokenSnapshot(
  contractAddress: string,
  options?: { signal?: AbortSignal; chainId?: 'ethereum' }
): Promise<Phase2TokenSnapshot> {
  const address = contractAddress.trim();
  if (!isPhase2EvmContractAddress(address)) {
    throw new Phase2TokenSnapshotError('INVALID_ADDRESS', 'Please enter a valid EVM contract address (0x + 40 hex characters).');
  }

  const supportedChainId = options?.chainId ?? 'ethereum';
  const endpoint = `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(address)}`;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      signal: options?.signal,
      cache: 'no-store',
    });
  } catch (err) {
    if (options?.signal?.aborted) throw err;
    throw new Phase2TokenSnapshotError('NETWORK_ERROR', 'Network error while fetching token data. Please try again.');
  }

  if (res.status === 429) {
    throw new Phase2TokenSnapshotError('RATE_LIMITED', 'Rate limited by the data provider. Please wait a moment and try again.');
  }

  if (!res.ok) {
    throw new Phase2TokenSnapshotError('API_ERROR', `Data provider error (${res.status}). Please try again later.`);
  }

  let json: DexScreenerTokenResponse;
  try {
    json = (await res.json()) as DexScreenerTokenResponse;
  } catch {
    throw new Phase2TokenSnapshotError('PARSE_ERROR', 'Failed to parse token data response. Please try again later.');
  }

  const pairs = json.pairs ?? [];
  if (pairs.length === 0) {
    throw new Phase2TokenSnapshotError('NOT_FOUND', 'No live market data found for that contract address.');
  }

  const bestPair = selectBestPairForChain(pairs, supportedChainId);
  if (!bestPair) {
    const chainSet = Array.from(
      new Set(
        pairs
          .map(p => p.chainId)
          .filter((c): c is string => typeof c === 'string' && c.length > 0)
          .map(c => c.toLowerCase())
      )
    ).sort();

    const supportedLabel = supportedChainId.toLowerCase();
    const found = chainSet.length > 0 ? chainSet.join(', ') : 'unknown';
    throw new Phase2TokenSnapshotError(
      'UNSUPPORTED_CHAIN',
      `Unsupported chain for this token. Supported: ${supportedLabel}. Found: ${found}.`
    );
  }

  if (!bestPair.baseToken?.address || !bestPair.pairAddress || !bestPair.chainId || !bestPair.dexId) {
    throw new Phase2TokenSnapshotError('NOT_FOUND', 'No live market data found for that contract address.');
  }

  return {
    chainId: bestPair.chainId,
    dexId: bestPair.dexId,
    pairAddress: bestPair.pairAddress,
    url: bestPair.url,
    baseToken: {
      address: bestPair.baseToken.address,
      symbol: bestPair.baseToken.symbol ?? 'N/A',
      name: bestPair.baseToken.name ?? 'Unknown',
    },
    priceUsd: safeNumberFromString(bestPair.priceUsd),
    liquidityUsd: safeNumber(bestPair.liquidity?.usd),
    fdvUsd: safeNumber(bestPair.fdv),
    volume24hUsd: safeNumber(bestPair.volume?.h24),
    fetchedAt: new Date(),
  };
}

export function formatPhase2CompactUsd(value: number | null): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPhase2Usd(value: number | null): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value < 1 ? 8 : 2,
  }).format(value);
}

