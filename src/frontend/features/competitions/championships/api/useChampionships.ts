// src/frontend/features/competitions/championships/api/useChampionships.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Championship } from "../types/Championship";
import type { ChampionshipFilters } from "../types/ChampionshipFilters";
import {
  championshipsPrefetch,
  championshipsQueries,
} from "./championshipsQueries";

/**
 * Hook to fetch all championships with optional filters.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetching on window focus
 *
 * @param filters - Optional filter criteria
 * @param options - Additional query options
 * @returns React Query result with championships data
 *
 * @example
 * const { data: championships, isLoading } = useChampionships({ level: 'national' });
 */
export function useChampionships(
  filters?: ChampionshipFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<PaginatedResponse<Championship>, ApiError>({
    ...championshipsQueries.list(filters),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch a single championship by ID.
 *
 * @param id - The championship ID
 * @param options - Additional query options
 * @returns React Query result with championship data
 *
 * @example
 * const { data: championship, isLoading } = useChampionship(123);
 *
 * @example
 * // Conditionally enabled
 * const { data } = useChampionship(id, { enabled: !!id });
 */
export function useChampionship(id: number, options?: { enabled?: boolean }) {
  return useQuery<Championship, ApiError>({
    ...championshipsQueries.detail(id),
    enabled: options?.enabled ?? !!id,
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
 * const prefetch = useChampionshipsPrefetch();
 * <tr onMouseEnter={() => prefetch.detail(championship.id)} />
 */
export function useChampionshipsPrefetch() {
  const queryClient = useQueryClient();

  return {
    detail: championshipsPrefetch.detail(queryClient),
    list: championshipsPrefetch.list(queryClient),
  };
}
