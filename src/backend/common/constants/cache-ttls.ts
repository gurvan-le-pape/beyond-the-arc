// src/backend/common/constants/cache-ttls.ts
/**
 * Centralized cache TTL (Time To Live) constants.
 * All values are in milliseconds.
 */
export const CACHE_TTL = {
  /**
   * 10 minutes - For static or rarely changing data
   * Examples: reference data, divisions, categories
   */
  STATIC_DATA: 600000,

  /**
   * 5 minutes - For moderately changing data
   * Examples: championship lists, team rosters
   */
  MODERATE_DATA: 300000,

  /**
   * 1 minute - For frequently changing data
   * Examples: leaderboards, recent matches
   */
  DYNAMIC_DATA: 60000,

  /**
   * 5 minutes - For expensive computational queries
   * Examples: complex aggregations, statistics
   */
  EXPENSIVE_QUERY: 300000,
} as const;
