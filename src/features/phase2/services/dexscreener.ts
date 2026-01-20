import type { TokenSnapshot } from '../types/phase2';
import { Phase2Error } from '../types/phase2';

/**
 * Phase 2-only EVM address validation (0x + 40 hex chars).
 * Note: syntactic validation only (not checksum validation).
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

function selectBestPairForEthereum(
  pairs: DexScreenerTokenResponse['pairs']
): NonNullable<DexScreenerTokenResponse['pairs']>[number] | null {
  if (!pairs || pairs.length === 0) return null;
  const ethPairs = pairs.filter(p => (p.chainId ?? '').toLowerCase() === 'ethereum');
  if (ethPairs.length === 0) return null;

  // Prefer the pair with the highest USD liquidity (more stable pricing).
  let best = ethPairs[0];
  let bestLiq = safeNumber(best.liquidity?.usd) ?? -1;

  for (const p of ethPairs) {
    const liq = safeNumber(p.liquidity?.usd) ?? -1;
    if (liq > bestLiq) {
      best = p;
      bestLiq = liq;
    }
  }

  return best ?? null;
}

/**
 * Phase 2-only token snapshot fetcher using DexScreener public API.
 * - Read-only GET request
 * - Single supported chain: Ethereum
 * - Normalizes data into the internal TokenSnapshot type
 */
export async function fetchTokenSnapshotFromDexScreener(
  contractAddress: string,
  options?: { signal?: AbortSignal }
): Promise<TokenSnapshot> {
  const address = contractAddress.trim();
  if (!isPhase2EvmContractAddress(address)) {
    throw new Phase2Error('INVALID_ADDRESS', 'Invalid contract address format (expected 0x + 40 hex characters).');
  }

  const endpoint = `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(address)}`;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'GET',
      headers: { accept: 'application/json' },
      cache: 'no-store',
      signal: options?.signal,
    });
  } catch (err) {
    if (options?.signal?.aborted) throw err;
    throw new Phase2Error('NETWORK_ERROR', 'Network error while fetching token data.');
  }

  if (res.status === 429) {
    throw new Phase2Error('RATE_LIMITED', 'Rate limited by the data provider. Please try again shortly.');
  }
  if (!res.ok) {
    throw new Phase2Error('API_ERROR', `Data provider error (${res.status}).`);
  }

  let json: DexScreenerTokenResponse;
  try {
    json = (await res.json()) as DexScreenerTokenResponse;
  } catch {
    throw new Phase2Error('PARSE_ERROR', 'Failed to parse token data response.');
  }

  const pairs = json.pairs ?? [];
  if (pairs.length === 0) {
    throw new Phase2Error('NOT_FOUND', 'No live market data found for that contract address.');
  }

  const bestPair = selectBestPairForEthereum(pairs);
  if (!bestPair) {
    const chains = Array.from(
      new Set(
        pairs
          .map(p => p.chainId)
          .filter((c): c is string => typeof c === 'string' && c.length > 0)
          .map(c => c.toLowerCase())
      )
    ).sort();

    throw new Phase2Error(
      'UNSUPPORTED_CHAIN',
      `Unsupported chain for this token. Supported: ethereum. Found: ${chains.length ? chains.join(', ') : 'unknown'}.`
    );
  }

  if (!bestPair.baseToken?.address || !bestPair.pairAddress || !bestPair.dexId) {
    throw new Phase2Error('NOT_FOUND', 'No usable market data found for that contract address.');
  }

  return {
    chainId: 'ethereum',
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

export function formatPhase2Usd(value: number | null): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value < 1 ? 8 : 2,
  }).format(value);
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

