// src/frontend/features/organizations/clubs/api/useClubs.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types";

import type { ClubBasic } from "../types/ClubBasic";
import type { ClubFilters } from "../types/ClubFilters";
import type { ClubsPaginatedResponse } from "../types/ClubsPaginatedResponse";
import { clubsQueries } from "./clubsQueries";

/**
 * Hook to fetch all clubs with optional filters and pagination.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetch on mount when stale (window-focus refetching is off)
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
 * Hook to fetch all clubs without filtering.
 * Reads `/clubs/all` from the backend directly; 24 h `staleTime`.
 * Useful for typeaheads, selects, and autocomplete widgets.
 *
 * @returns React Query result with all clubs
 *
 * @example
 * const { data: clubs = [] } = useAllClubs();
 *
 * @param options - `initialData` seeds the cache from a server render, so the first paint has no loading state
 */
export function useAllClubs(options?: { initialData?: ClubBasic[] }) {
  return useQuery<ClubBasic[], ApiError>({
    ...clubsQueries.allClubs(),
    initialData: options?.initialData,
  });
}

/**
 * Hook to search clubs by name with optional location scoping.
 *
 * Designed for use with SearchableDropdown — fetches a limited set of
 * results on demand as the user types, rather than loading all clubs upfront.
 * Results are scoped to committeeId or leagueId when provided, so the list
 * stays relevant to any active location filter.
 *
 * Cache behaviour:
 * - staleTime: 1 minute (search results change more frequently than static lists)
 * - gcTime: 2 minutes
 *
 * **Runs on an empty search**, unlike `usePlayerSearch`, which gates at two
 * characters. That is the intended behaviour for the only consumer: a filter
 * combo box should offer options before the user types, so an empty query
 * lists the first twenty clubs. Gate it here, on the hook, if a consumer ever
 * needs autocomplete semantics instead — not in the shared options factory,
 * where the flag would be invisible to every call site.
 *
 * @param search - The search string to filter club names by (case-insensitive)
 * @param filters - Optional committeeId or leagueId to scope results to a location
 * @returns React Query result with paginated clubs matching the search
 *
 * @example
 * const { data, isLoading } = useClubSearch("monaco", { leagueId: 3 });
 *
 * @example
 * // Unscoped search across all clubs
 * const { data, isLoading } = useClubSearch(debouncedSearch);
 */
export function useClubSearch(
  search: string,
  filters?: Pick<ClubFilters, "committeeId" | "leagueId">,
) {
  return useQuery<ClubsPaginatedResponse, ApiError>({
    ...clubsQueries.search(search, filters),
  });
}
