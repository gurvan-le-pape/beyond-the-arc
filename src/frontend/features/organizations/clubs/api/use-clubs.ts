// src/frontend/features/organizations/clubs/api/use-clubs.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types/Api";

import type { ClubsPaginatedResponse } from "../../committees/types/ClubsPaginatedResponse";
import type { ClubBasic } from "../types/ClubBasic";
import type { ClubDetailed } from "../types/ClubDetailed";
import type { ClubFilters } from "../types/ClubFilters";
import type { ClubStatsByDepartment } from "../types/ClubStatsByDepartement";
import type { ClubStatsByRegion } from "../types/ClubStatsByRegion";
import { clubsPrefetch, clubsQueries } from "./clubsQueries";

/**
 * Hook to fetch all clubs with optional filters and pagination.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetching on window focus
 * - Pagination support
 *
 * @param filters - Optional filter criteria
 * @param options - Additional query options
 * @returns React Query result with paginated clubs
 *
 * @example
 * const { data: clubs, isLoading } = useClubs({ committeeId: 123 });
 */
export function useClubs(
  filters?: ClubFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<ClubsPaginatedResponse, ApiError>({
    ...clubsQueries.list(filters),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch detailed information for a single club.
 *
 * @param id - The club ID
 * @param options - Additional query options
 * @returns React Query result with club details
 *
 * @example
 * const { data: club, isLoading } = useClub(123);
 */
export function useClub(id: number, options?: { enabled?: boolean }) {
  return useQuery<ClubDetailed, ApiError>({
    ...clubsQueries.detail(id),
    enabled: options?.enabled ?? !!id,
  });
}

/**
 * Hook to fetch club statistics aggregated by region.
 * Hits the Next.js API route which caches for 24 hours server-side.
 * Client staleTime is aligned to 24h to avoid redundant revalidations.
 *
 * @param options - Additional query options including optional initialData for SSR
 * @returns React Query result with region stats
 *
 * @example
 * const { data: regions = [] } = useClubStatsByRegion();
 *
 * @example
 * // With SSR initial data
 * const { data: regions } = useClubStatsByRegion({ initialData: serverRegions });
 */
export function useClubStatsByRegion(options?: {
  initialData?: ClubStatsByRegion[];
}) {
  return useQuery<ClubStatsByRegion[], ApiError>({
    ...clubsQueries.statsByRegion(),
    initialData: options?.initialData,
  });
}

/**
 * Hook to fetch club statistics aggregated by département.
 * Hits the Next.js API route which caches for 1 hour server-side.
 *
 * @returns React Query result with department stats
 *
 * @example
 * const { data: departments = [] } = useClubStatsByDepartment();
 */
export function useClubStatsByDepartment() {
  return useQuery<ClubStatsByDepartment[], ApiError>(
    clubsQueries.statsByDepartment(),
  );
}

/**
 * Hook to fetch all clubs without filtering.
 * Hits the Next.js API route which caches for 1 hour server-side.
 * Useful for typeaheads, selects, and autocomplete widgets.
 *
 * @returns React Query result with all clubs
 *
 * @example
 * const { data: clubs = [] } = useAllClubs();
 */
export function useAllClubs() {
  return useQuery<ClubBasic[], ApiError>(clubsQueries.allClubs());
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
 * const prefetch = useClubsPrefetch();
 * <tr onMouseEnter={() => prefetch.detail(club.id)} />
 *
 * @example
 * // Warm the full list before a filter panel opens
 * <FilterPanel onOpen={() => prefetch.list({ committeeId: 5 })} />
 */
export function useClubsPrefetch() {
  const queryClient = useQueryClient();

  return {
    detail: clubsPrefetch.detail(queryClient),
    list: clubsPrefetch.list(queryClient),
    statsByRegion: clubsPrefetch.statsByRegion(queryClient),
    statsByDepartment: clubsPrefetch.statsByDepartment(queryClient),
    allClubs: clubsPrefetch.allClubs(queryClient),
  };
}
