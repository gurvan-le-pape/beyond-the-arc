// src/frontend/shared/utils/logger.ts
export const logger = {
  error: (error: unknown, context?: string): void => {
    // Single place to swap in Sentry / Datadog later
    if (context) console.error(`[${context}]`, error);
    else console.error(error);
  },
  warn: (message: string, ...details: unknown[]): void => {
    // Same swap point as `error`; used for recoverable-but-unusual conditions
    // (e.g. a centroid that could not be computed) that are not failures.
    if (details.length > 0) console.warn(message, ...details);
    else console.warn(message);
  },
};
