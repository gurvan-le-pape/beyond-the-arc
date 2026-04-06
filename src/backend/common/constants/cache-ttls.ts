// src/backend/common/constants/cache-ttls.ts
/**
 * Centralized cache TTL (Time To Live) constants.
 * All values are in seconds (cache-manager v5+ convention).
 */
export const CACHE_TTL = {
  /** 10 minutes - static/rarely changing data (reference data, divisions) */
  STATIC_DATA: 600,

  /** 5 minutes - moderately changing data (championship lists, rosters) */
  MODERATE_DATA: 300,

  /** 1 minute - frequently changing data (leaderboards, recent matches) */
  DYNAMIC_DATA: 60,

  /** 5 minutes - expensive computational queries (aggregations, statistics) */
  EXPENSIVE_QUERY: 300,
} as const;
