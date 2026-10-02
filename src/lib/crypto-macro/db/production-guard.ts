import { CryptoMacroEnvError, type EnvSource } from './env';
export const PRODUCTION_ENDPOINT = 'ep-divine-heart-b76p08w0';
export function endpointFromUrl(value: string): string {
  const host = new URL(value).hostname.split('.')[0] ?? '';
  return host.replace(/-pooler$/i, '').toLowerCase();
}
export function assertDevelopmentDatabase(source: EnvSource = process.env): void {
  if (source.CRYPTO_MACRO_DB_ENV !== 'development') throw new CryptoMacroEnvError('db_environment_guard', 'Crypto Macro database writes require CRYPTO_MACRO_DB_ENV=development.');
  const urls = [source.CRYPTO_MACRO_DATABASE_URL, source.CRYPTO_MACRO_DATABASE_URL_UNPOOLED].filter((value): value is string => Boolean(value));
  if (urls.some(value => endpointFromUrl(value) === PRODUCTION_ENDPOINT)) throw new CryptoMacroEnvError('production_endpoint_guard', 'Crypto Macro database writes are blocked for the production Neon endpoint.');
}
