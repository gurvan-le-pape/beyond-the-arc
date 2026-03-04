// src/backend/config/cache.config.ts
export const cacheConfig = {
  ttl: process.env.CACHE_TTL || 300000,
  max: process.env.CACHE_MAX_ITEMS || 100,
};
