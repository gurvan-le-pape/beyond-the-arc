// src/frontend/features/competitions/championships/api/useChampionships.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Championship } from "../types/Championship";
import type { ChampionshipFilters } from "../types/ChampionshipFilters";
import { championshipsQueries } from "./championshipsQueries";

/**
 * Hook to fetch all championships with optional filters.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetch on mount when stale (window-focus refetching is off)
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
