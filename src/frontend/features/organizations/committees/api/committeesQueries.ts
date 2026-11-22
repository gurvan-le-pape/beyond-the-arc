// src/frontend/features/organizations/committees/api/committeesQueries.ts
import type { QueryFunctionContext } from "@tanstack/react-query";

import type { CommitteeFilters } from "../types/CommitteeFilters";
import { committeesService } from "./committees.service";
import { committeesKeys } from "./committeesKeys";

/**
 * Global query configuration for committees feature.
 * Centralizes cache timing and behavior policies.
 */
const COMMITTEES_CONFIG = {
  /** Committees change only when the static data is refreshed. */
  staleTime: 5 * 60 * 1000,

  /**
   * Users navigate between committees within a session frequently,
   * so keeping the cache warm longer reduces redundant fetches.
   */
  gcTime: 10 * 60 * 1000,
} as const;

/**
 * Query options for every committees request: key, fetcher and cache policy in
 * one object, spread by the hooks in `useCommittees.ts`, so call sites cannot
 * disagree on any of the three. The pattern is described in
 * `docs/frontend.md`.
 */
export const committeesQueries = {
  /**
   * Query options for fetching all committees with optional filters.
   *
   * @example
   * useQuery(committeesQueries.list({ leagueId: 1 }))
   *
   * @param filters - filter criteria; part of the cache key
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  list: (filters?: CommitteeFilters) => ({
    queryKey: committeesKeys.list(filters),
    queryFn: ({ signal }: QueryFunctionContext) =>
      committeesService.getAll(filters, signal),
    ...COMMITTEES_CONFIG,
  }),
} as const;
