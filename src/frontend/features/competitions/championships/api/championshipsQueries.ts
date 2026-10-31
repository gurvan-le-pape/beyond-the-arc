// src/frontend/features/competitions/championships/api/championshipsQueries.ts
import type { QueryFunctionContext } from "@tanstack/react-query";

import type { ChampionshipFilters } from "../types/ChampionshipFilters";
import { championshipsService } from "./championships.service";
import { championshipsKeys } from "./championshipsKeys";

/**
 * Global query configuration for championships feature.
 * Centralizes cache timing and behavior policies.
 */
const CHAMPIONSHIPS_CONFIG = {
  /**
   * Data remains fresh for 5 minutes.
   * Championship metadata (name, dates, level) is stable within a session
   * but can be updated by admins between visits.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Cached data garbage collected after 10 minutes of no usage.
   * Championships are a top-level navigation entry point, browsed
   * heavily within a session across pools, leaderboards, and matches.
   */
  gcTime: 10 * 60 * 1000,
} as const;

/**
 * Query options factory for championships.
 *
 * Implements the Query Options pattern for:
 * - Single source of truth (queryKey + queryFn + config)
 * - Type-safe options spreading
 * - Consistency between useQuery, prefetchQuery, and mutations
 * - Easy testing (export options, test queryFn directly)
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 * @see https://tkdodo.eu/blog/leveraging-the-query-function-context
 */
export const championshipsQueries = {
  /**
   * Query options for fetching championships with optional filters.
   *
   * @example
   * useQuery(championshipsQueries.list({ level: 'national' }))
   *
   * @param filters - filter criteria; part of the cache key
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  list: (filters?: ChampionshipFilters) => ({
    queryKey: championshipsKeys.list(filters),
    queryFn: ({ signal }: QueryFunctionContext) =>
      championshipsService.getAll(filters, signal),
    ...CHAMPIONSHIPS_CONFIG,
  }),
} as const;
