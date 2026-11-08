// src/frontend/features/matches/api/useMatches.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Match } from "../types/Match";
import type { MatchEvent } from "../types/MatchEvent";
import type { MatchFilters } from "../types/MatchFilters";
import { matchesPrefetch, matchesQueries } from "./matchesQueries";

/**
 * Hook to fetch all matches with optional filters and pagination.
 *
 * Features:
 * - Automatic caching (2 minutes stale, 5 minutes GC)
 * - Background refetch on mount when stale (window-focus refetching is off)
 * - Pagination support
 *
 * @param filters - Optional filter criteria
 * @param options - Additional query options
 * @returns React Query result with paginated matches
 *
 * @example
 * const { data, isLoading } = useMatches({
 *   poolId: 1,
 *   page: 1,
 *   limit: 20,
 * });
 */
export function useMatches(
  filters?: MatchFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<PaginatedResponse<Match>, ApiError>({
    ...matchesQueries.list(filters),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch all events for a specific match.
 *
 * @param matchId - The match ID
 * @param options - Additional query options
 * @returns React Query result with match events
 *
 * @example
 * const { data: events } = useMatchEvents(12345);
 */
export function useMatchEvents(
  matchId: number,
  options?: { enabled?: boolean },
) {
  return useQuery<MatchEvent[], ApiError>({
    ...matchesQueries.events(matchId),
    enabled: options?.enabled ?? !!matchId,
  });
}

/**
 * Hook returning prefetch utilities for optimistic loading.
 *
 * Returns an object with prefetch functions for different data types.
 * Call these on hover, route changes, or predicted navigation.
 *
 * @returns Object with prefetch functions
 *
 * @example
 * const prefetch = useMatchesPrefetch();
 * <button onMouseEnter={() => prefetch.events(match.id)} />
 */
export function useMatchesPrefetch() {
  const queryClient = useQueryClient();

  return {
    events: matchesPrefetch.events(queryClient),
  };
}
