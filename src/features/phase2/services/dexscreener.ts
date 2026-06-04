import type { TokenSnapshot } from '@/features/phase2/types/phase2';
import { logger } from '@/lib/logger';

export async function fetchTokenData(tokenAddress: string): Promise<TokenSnapshot> {
  const normalizedAddress = tokenAddress.trim();
  const encodedAddress = encodeURIComponent(normalizedAddress);

  const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${encodedAddress}`;
  logger.log('Fetching from:', apiUrl);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`DexScreener API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.pairs || !Array.isArray(data.pairs) || data.pairs.length === 0) {
    logger.warn('No pairs found for address:', normalizedAddress);
    throw new Error('No trading pairs found for this token address');
  }

  const ethereumPairs = data.pairs.filter((p: any) => p.chainId === 'ethereum');

  if (ethereumPairs.length === 0) {
    logger.warn('No Ethereum pairs found for address:', normalizedAddress);
    throw new Error('No Ethereum mainnet trading pairs found for this token address');
  }

  const pair = ethereumPairs.sort((a: any, b: any) => {
    const liqA = a.liquidity?.usd || 0;
    const liqB = b.liquidity?.usd || 0;
    return liqB - liqA;
  })[0];

  const priceUsd = pair.priceUsd ? parseFloat(pair.priceUsd) : null;
  const liquidityUsd = pair.liquidity?.usd ? parseFloat(pair.liquidity.usd) : null;
  const fdvUsd = pair.fdv ? parseFloat(pair.fdv) : null;
  const volume24hUsd = pair.volume?.h24 ? parseFloat(pair.volume.h24) : null;

  logger.log('Parsed values:', { priceUsd, liquidityUsd, fdvUsd, volume24hUsd });

  if (priceUsd === null || isNaN(priceUsd)) {
    logger.error('Invalid or missing price data');
    throw new Error('Invalid price data received from API');
  }

  const snapshot: TokenSnapshot = {
    chainId: pair.chainId || 'ethereum',
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