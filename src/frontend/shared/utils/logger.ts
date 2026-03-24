// src/frontend/shared/utils/logger.ts
export const logger = {
  error: (error: unknown, context?: string): void => {
    // Single place to swap in Sentry / Datadog later
    if (context) console.error(`[${context}]`, error);
    else console.error(error);
  },
};
