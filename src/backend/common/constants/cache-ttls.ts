// src/backend/common/constants/cache-ttls.ts
/**
 * Centralized cache TTL (Time To Live) constants.
 *
 * All values are in **milliseconds**. cache-manager 7 is built on Keyv, whose
 * `ttl` is milliseconds — the seconds convention these constants used to claim
 * belonged to cache-manager 4. Measured on the locked 7.2.8: an entry written
 * with `ttl: 300` is already gone 400 ms later, so every cache here was living
 * 0.3 s instead of 5 minutes.
 *
 * Keep the unit in the name of anything derived from these (`ttlMs`), and do
 * not reintroduce a bare number at a call site.
 */
export const CACHE_TTL = {
  /** 10 minutes - static/rarely changing data (reference data, divisions) */
  STATIC_DATA: 600_000,

  /** 5 minutes - moderately changing data (championship lists, rosters) */
  MODERATE_DATA: 300_000,

  /** 1 minute - frequently changing data (leaderboards, recent matches) */
  DYNAMIC_DATA: 60_000,

  /** 5 minutes - expensive computational queries (aggregations, statistics) */
  EXPENSIVE_QUERY: 300_000,
} as const;
