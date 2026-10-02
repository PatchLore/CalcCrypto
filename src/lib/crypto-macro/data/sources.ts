import { ASSETS } from '../assets';
export type SourceStatus = 'enabled' | 'disabled' | 'permission-pending';
export const SOURCES = ASSETS.map(asset => ({
  ...asset,
  status: asset.id === 'eurusd' || asset.id === 'eurgbp' || asset.id === 'eurjpy' ? 'enabled' as SourceStatus : 'permission-pending' as SourceStatus,
}));
