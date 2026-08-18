// src/frontend/features/organizations/committees/api/committeesQueries.ts
import type { QueryClient, QueryFunctionContext } from "@tanstack/react-query";

import type { CommitteeFilters } from "../types/CommitteesFilters";
import { committeesService } from "./committees.service";
import { committeesKeys } from "./committeesKeys";

/**
 * Global query configuration for committees feature.
 * Centralizes cache timing and behavior policies.
 */
const COMMITTEES_CONFIG = {
  /**
   * Data remains fresh for 5 minutes.
   * Committee data (names, regions, contacts) changes rarely —
   * longer staleTime than matches is appropriate.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Cached data garbage collected after 10 minutes of no usage.
   * Users navigate between committees within a session frequently,
   * so keeping the cache warm longer reduces redundant fetches.
   */
  gcTime: 10 * 60 * 1000,
} as const;

/**
 * Query options factory for committees.
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

  /**
   * Query options for fetching a single committee by ID.
   *
   * @example
   * useQuery(committeesQueries.detail(1))
   *
   * @param id - the committee's id
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  detail: (id: number) => ({
    queryKey: committeesKeys.detail(id),
    queryFn: ({ signal }: QueryFunctionContext) =>
      committeesService.getById(id, signal),
    ...COMMITTEES_CONFIG,
  }),

  /**
   * Query options for fetching multiple committees by their IDs.
   * Useful when a view needs a specific subset without full list filters.
   *
   * @example
   * useQuery(committeesQueries.byIds([1, 2, 3]))
   *
   * @param ids - the committees to fetch together; the key is order-sensitive, so sort before calling if callers may differ
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  byIds: (ids: number[]) => ({
    queryKey: committeesKeys.byIds(ids),
    queryFn: ({ signal }: QueryFunctionContext) =>
      committeesService.getByIds(ids, signal),
    ...COMMITTEES_CONFIG,
  }),
} as const;

/**
 * Prefetch utilities for optimistic data loading.
 * Call these on hover/route changes to warm the cache.
 */
export const committeesPrefetch = {
  /**
   * Prefetch committee detail (e.g., on list-item hover).
   *
   * @example
   * const prefetch = committeesPrefetch.detail(queryClient);
   * <tr onMouseEnter={() => prefetch(committee.id)} />
   *
   * @param queryClient - the client to warm
   * @returns a prefetcher taking a committee id — call it on hover or focus, before navigation
   */
  detail: (queryClient: QueryClient) => (committeeId: number) => {
    queryClient
      .prefetchQuery(committeesQueries.detail(committeeId))
      .catch(() => {
        // Silently fail - prefetch is opportunistic
      });
  },

  /**
   * Prefetch committees list with given filters (e.g., on tab hover).
   *
   * @example
   * const prefetch = committeesPrefetch.list(queryClient);
   * <Tab onMouseEnter={() => prefetch({ leagueId: 1 })} />
   *
   * @param queryClient - the client to warm
   * @returns a prefetcher taking filters — warms the same key the list query will read
   */
  list: (queryClient: QueryClient) => (filters?: CommitteeFilters) => {
    queryClient.prefetchQuery(committeesQueries.list(filters)).catch(() => {});
  },
} as const;
