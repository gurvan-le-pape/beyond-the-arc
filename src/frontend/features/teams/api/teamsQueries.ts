// src/frontend/features/teams/api/teamsQueries.ts
import type { QueryClient } from "@tanstack/react-query";

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
   */
  list: (filters?: TeamFilters) => ({
    queryKey: teamsKeys.list(filters),
    queryFn: () => teamsService.getAll(filters),
    ...TEAMS_CONFIG,
  }),

  /**
   * Query options for fetching a single team by ID.
   *
   * @example
   * useQuery(teamsQueries.detail(123))
   */
  detail: (id: number) => ({
    queryKey: teamsKeys.detail(id),
    queryFn: () => teamsService.getById(id),
    ...TEAMS_CONFIG,
  }),

  /**
   * Query options for fetching match history for a specific team.
   * Uses a shorter staleTime than base config — match results update
   * throughout the week as fixtures are played.
   *
   * @example
   * useQuery(teamsQueries.matches(123))
   */
  matches: (id: number) => ({
    queryKey: teamsKeys.matches(id),
    queryFn: () => teamsService.getMatches(id),
    ...TEAMS_CONFIG,
    // Match results update regularly — refresh more aggressively than team metadata
    staleTime: 2 * 60 * 1000,
  }),

  /**
   * Query options for fetching available filter values for teams.
   * Returns pool numbers, letters, and divisions scoped to an optional
   * committee or league. Very short staleTime — values shift as pools
   * are created/updated by admins and must stay current for filter UIs.
   *
   * @example
   * useQuery(teamsQueries.filterValues({ committeeId: 1 }))
   */
  filterValues: (params?: { committeeId?: number; leagueId?: number }) => ({
    queryKey: teamsKeys.filterValues(params),
    queryFn: () => teamsService.getFilterValues(params),
    ...TEAMS_CONFIG,
    // Filter values reflect live admin changes — keep very fresh
    staleTime: 30 * 1000,
  }),
} as const;

/**
 * Prefetch utilities for optimistic data loading.
 * Call these on hover/route changes to warm the cache.
 */
export const teamsPrefetch = {
  /**
   * Prefetch team detail (e.g., on list-row hover).
   *
   * @example
   * const prefetch = teamsPrefetch.detail(queryClient);
   * <tr onMouseEnter={() => prefetch(team.id)} />
   */
  detail: (queryClient: QueryClient) => (teamId: number) => {
    queryClient.prefetchQuery(teamsQueries.detail(teamId)).catch(() => {
      // Silently fail - prefetch is opportunistic
    });
  },

  /**
   * Prefetch team match history (e.g., on team-card hover or tab navigation).
   *
   * @example
   * const prefetch = teamsPrefetch.matches(queryClient);
   * <TeamCard onMouseEnter={() => prefetch(team.id)} />
   */
  matches: (queryClient: QueryClient) => (teamId: number) => {
    queryClient.prefetchQuery(teamsQueries.matches(teamId)).catch(() => {});
  },

  /**
   * Prefetch teams list with given filters (e.g., before a filter panel opens).
   *
   * @example
   * const prefetch = teamsPrefetch.list(queryClient);
   * <FilterPanel onOpen={() => prefetch({ clubId: 1 })} />
   */
  list: (queryClient: QueryClient) => (filters?: TeamFilters) => {
    queryClient.prefetchQuery(teamsQueries.list(filters)).catch(() => {});
  },
} as const;
