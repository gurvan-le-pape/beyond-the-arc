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
   * Team rosters and metadata change infrequently within a session.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Teams are browsed heavily within a session (club → team → match),
   * so a generous gcTime avoids redundant fetches during navigation.
   */
  gcTime: 10 * 60 * 1000,
} as const;

/**
 * Query options for every teams request: key, fetcher and cache policy in one
 * object, spread by the hooks in `useTeams.ts`, so call sites cannot disagree
 * on any of the three. The pattern is described in `docs/frontend.md`.
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
