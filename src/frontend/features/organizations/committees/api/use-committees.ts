// src/frontend/features/organizations/committees/api/use-committees.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types/Api";

import type { Committee } from "../types/Committees";
import type { CommitteeFilters } from "../types/CommitteesFilters";
import { committeesPrefetch, committeesQueries } from "./committeesQueries";

/**
 * Hook to fetch all committees with optional filters.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetching on window focus
 *
 * @param filters - Optional filter criteria
 * @param options - Additional query options
 * @returns React Query result with committees data
 *
 * @example
 * const { data: committees, isLoading } = useCommittees({ leagueId: 1 });
 */
export function useCommittees(
  filters?: CommitteeFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<Committee[], ApiError>({
    ...committeesQueries.list(filters),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch a single committee by ID.
 *
 * @param id - The committee ID
 * @param options - Additional query options
 * @returns React Query result with committee data
 *
 * @example
 * const { data: committee, isLoading } = useCommittee(1);
 */
export function useCommittee(id: number, options?: { enabled?: boolean }) {
  return useQuery<Committee, ApiError>({
    ...committeesQueries.detail(id),
    enabled: options?.enabled ?? !!id,
  });
}

/**
 * Hook to fetch multiple committees by their IDs.
 *
 * @param ids - Array of committee IDs
 * @param options - Additional query options
 * @returns React Query result with committees data
 *
 * @example
 * const { data: committees } = useCommitteesByIds([1, 2, 3]);
 */
export function useCommitteesByIds(
  ids: number[],
  options?: { enabled?: boolean },
) {
  return useQuery<Committee[], ApiError>({
    ...committeesQueries.byIds(ids),
    enabled: options?.enabled ?? ids.length > 0,
  });
}

/**
 * Hook returning prefetch utilities for optimistic loading.
 *
 * Returns an object with prefetch functions for different data types.
 * Call these on hover, route changes, or predicted navigation to warm
 * the cache before the user lands on the target view.
 *
 * @returns Object with prefetch functions
 *
 * @example
 * const prefetch = useCommitteesPrefetch();
 * <tr onMouseEnter={() => prefetch.detail(committee.id)} />
 */
export function useCommitteesPrefetch() {
  const queryClient = useQueryClient();

  return {
    detail: committeesPrefetch.detail(queryClient),
    list: committeesPrefetch.list(queryClient),
  };
}
