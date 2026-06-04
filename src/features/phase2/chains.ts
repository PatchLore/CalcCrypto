export interface ChainOption {
  id: string;
  name: string;
  symbol: string;
}

export const SUPPORTED_CHAINS: ChainOption[] = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'base', name: 'Base', symbol: 'ETH' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH' },
  { id: 'bsc', name: 'BNB Chain', symbol: 'BNB' },
];

export const DEFAULT_CHAIN_ID = 'ethereum';
