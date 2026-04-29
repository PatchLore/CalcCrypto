import type { TokenSnapshot } from '@/features/phase2/types/phase2';

/**
 * Fetch token data from DexScreener API
 * @param tokenAddress - The token address to fetch data for
 * @returns Promise with TokenSnapshot data
 */
export async function fetchTokenData(tokenAddress: string): Promise<TokenSnapshot> {
  try {
    // Ensure address is properly formatted and encoded
    const normalizedAddress = tokenAddress.trim();
    const encodedAddress = encodeURIComponent(normalizedAddress);
    
    const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${encodedAddress}`;
    console.log('[DexScreener] Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[DexScreener] Raw API response:', JSON.stringify(data, null, 2));
    
    // Handle cases where pairs array is empty or undefined
    if (!data.pairs || !Array.isArray(data.pairs) || data.pairs.length === 0) {
      console.error('[DexScreener] No pairs found in response for address:', normalizedAddress);
      throw new Error('No trading pairs found for this token address');
    }

    console.log('[DexScreener] Total pairs found:', data.pairs.length);
    console.log('[DexScreener] Available chains:', [...new Set(data.pairs.map((p: any) => p.chainId))]);

    // STRICT: Filter for Ethereum mainnet pairs only
    const ethereumPairs = data.pairs.filter((p: any) => p.chainId === 'ethereum');
    
    if (ethereumPairs.length === 0) {
      console.error('[DexScreener] No Ethereum mainnet pairs found. Available chains:', [...new Set(data.pairs.map((p: any) => p.chainId))]);
      throw new Error('No Ethereum mainnet trading pairs found for this token address');
    }

    // Use the pair with highest liquidity on Ethereum
    const pair = ethereumPairs.sort((a: any, b: any) => {
      const liqA = a.liquidity?.usd || 0;
      const liqB = b.liquidity?.usd || 0;
      return liqB - liqA;
    })[0];
    
    console.log('[DexScreener] Using Ethereum pair:', {
      chainId: pair.chainId,
      dexId: pair.dexId,
      pairAddress: pair.pairAddress,
      baseToken: pair.baseToken?.symbol,
      liquidity: pair.liquidity?.usd,
    });

    // Extract relevant data from DexScreener response
    // Note: DexScreener schema uses nested objects for liquidity, volume, etc.
    const priceUsd = pair.priceUsd ? parseFloat(pair.priceUsd) : null;
    const liquidityUsd = pair.liquidity?.usd ? parseFloat(pair.liquidity.usd) : null;
    const fdvUsd = pair.fdv ? parseFloat(pair.fdv) : null;
    const volume24hUsd = pair.volume?.h24 ? parseFloat(pair.volume.h24) : null;
    
    console.log('[DexScreener] Parsed values:', {
      priceUsd,
      liquidityUsd,
      fdvUsd,
      volume24hUsd,
      rawPriceUsd: pair.priceUsd,
      rawLiquidity: pair.liquidity?.usd,
      rawFdv: pair.fdv,
      rawVolume: pair.volume?.h24,
    });

    // Validate that we got at least a price
    if (priceUsd === null || isNaN(priceUsd)) {
      console.error('[DexScreener] Invalid or missing price data');
      throw new Error('Invalid price data received from API');
    }

    const snapshot: TokenSnapshot = {
      chainId: pair.chainId || 'ethereum',
      pairAddress: pair.pairAddress || '',
      dexId: pair.dexId || 'unknown',
      url: pair.url,
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

    console.log('[DexScreener] Returning TokenSnapshot:', snapshot);
    return snapshot;
    
  } catch (error) {
    console.error('[DexScreener] Error fetching token data:', error);
    console.error('[DexScreener] Token address was:', tokenAddress);
    
    // Re-throw the error so the calling component can handle it
    throw error;
  }
}