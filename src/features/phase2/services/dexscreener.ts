import { TokenRiskData } from '@/features/phase2/types';

/**
 * Fetch token data from DexScreener API
 * @param tokenAddress - The token address to fetch data for
 * @returns Promise with token data or fallback data on error
 */
export async function fetchTokenData(tokenAddress: string): Promise<TokenRiskData> {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }

    const data = await response.json();

    // DexScreener returns an array of pairs, we'll take the first one or fallback
    const pair = data.pairs?.[0];
    if (!pair) {
      throw new Error('No pair data found');
    }

    // Extract relevant data
    const priceUsd = parseFloat(pair.priceUsd ?? '0');
    const liquidityUsd = parseFloat(pair.liquidity?.usd ?? '0');
    const volume24h = parseFloat(pair.volume?.h24 ?? '0');
    const priceChange24h = parseFloat(pair.priceChange?.h24 ?? '0');
    
    // DexScreener doesn't directly provide age, holder info, or mint authority
    // We'll need to estimate or use other sources for a complete implementation
    // For now, we'll return what we can and note limitations
    
    return {
      priceUsd,
      liquidity: liquidityUsd,
      volume24h,
      priceChange24h,
      // These fields would require additional APIs or blockchain queries
      // For Phase 2 MVP, we'll use placeholders or estimate from available data
      ageDays: 0, // Placeholder - would require token creation time from
      holderConcentration: 0, // Placeholder
      mintAuthorityRenounced: false, // Placeholder
    };
  } catch (error) {
    console.error('Error fetching token data from DexScreener:', error);
    
    // Return fallback data to prevent breaking the UI
    return {
      priceUsd: 0,
      liquidity: 0,
      volume24h: 0,
      priceChange24h: 0,
      ageDays: 999, // High age to indicate unknown
      holderConcentration: 0, // Unknown
      mintAuthorityRenounced: false, // Assume not renounced for safety
    };
  }
}