import type { Phase2SupportedChain, TokenSnapshot } from '@/features/phase2/types/phase2';
import { logger } from '@/lib/logger';

export async function fetchTokenData(tokenAddress: string, chainId: Phase2SupportedChain = 'ethereum'): Promise<TokenSnapshot> {
  const normalizedAddress = tokenAddress.trim();
  const encodedAddress = encodeURIComponent(normalizedAddress);

  const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${encodedAddress}`;
  if (process.env.NODE_ENV === 'development') logger.log('Fetching from:', apiUrl, 'chain:', chainId);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`DexScreener API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.pairs || !Array.isArray(data.pairs) || data.pairs.length === 0) {
    if (process.env.NODE_ENV === 'development') logger.warn('No pairs found for address:', normalizedAddress);
    throw new Error('No trading pairs found for this token address');
  }

  const chainPairs = data.pairs.filter((p: any) => p.chainId === chainId);

  if (chainPairs.length === 0) {
    if (process.env.NODE_ENV === 'development') logger.warn(`No ${chainId} pairs found for address:`, normalizedAddress);
    throw new Error(`No trading pairs found on ${chainId} for this token address`);
  }

  const pair = chainPairs.sort((a: any, b: any) => {
    const liqA = a.liquidity?.usd || 0;
    const liqB = b.liquidity?.usd || 0;
    return liqB - liqA;
  })[0];

  const priceUsd = pair.priceUsd ? parseFloat(pair.priceUsd) : null;
  const liquidityUsd = pair.liquidity?.usd ? parseFloat(pair.liquidity.usd) : null;
  const fdvUsd = pair.fdv ? parseFloat(pair.fdv) : null;
  const volume24hUsd = pair.volume?.h24 ? parseFloat(pair.volume.h24) : null;

  if (process.env.NODE_ENV === 'development') logger.log('Parsed values:', { priceUsd, liquidityUsd, fdvUsd, volume24hUsd });

  if (priceUsd === null || isNaN(priceUsd)) {
    if (process.env.NODE_ENV === 'development') logger.error('Invalid or missing price data');
    throw new Error('Invalid price data received from API');
  }

  const snapshot: TokenSnapshot = {
    chainId: (pair.chainId || chainId) as Phase2SupportedChain,
    pairAddress: pair.pairAddress || '',
    dexId: pair.dexId || 'unknown',
    url: pair.url,
    address: normalizedAddress,
    baseToken: {
      address: pair.baseToken?.address || normalizedAddress,
      symbol: pair.baseToken?.symbol || 'UNKNOWN',
      name: pair.baseToken?.name || 'Unknown Token',
    },
    priceUsd,
    liquidityUsd,
    fdvUsd,
    volume24hUsd,
    fetchedAt: new Date(),
  };

  return snapshot;
}