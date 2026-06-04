export const logger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Debug]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Warn]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error('[Error]', ...args);
  },
};
