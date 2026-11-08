// src/frontend/features/teams/api/teamsQueries.ts
import type { QueryFunctionContext } from "@tanstack/react-query";

import type { TeamFilters } from "../types/TeamFilters";
import { teamsService } from "./teams.service";
import { teamsKeys } from "./teamsKeys";

/**
 * Global query configuration for teams feature.
 * Centralizes cache timing and behavior policies.
 */
const TEAMS_CONFIG = {
  /**
   * Data remains fresh for 5 minutes.
   * Team rosters and metadata change infrequently within a session.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Cached data garbage collected after 10 minutes of no usage.
   * Teams are browsed heavily within a session (club → team → match),
   * so a generous gcTime avoids redundant fetches during navigation.
   */
  gcTime: 10 * 60 * 1000,
} as const;

/**
 * Query options factory for teams.
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
export const teamsQueries = {
  /**
   * Query options for fetching teams with optional filters and pagination.
   *
   * @example
   * useQuery(teamsQueries.list({ clubId: 1, page: 1 }))
   *
   * @param filters - filter and pagination criteria; part of the cache key, so each combination caches separately
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  list: (filters?: TeamFilters) => ({
    queryKey: teamsKeys.list(filters),
    queryFn: ({ signal }: QueryFunctionContext) =>
      teamsService.getAll(filters, signal),
    ...TEAMS_CONFIG,
  }),
} as const;
