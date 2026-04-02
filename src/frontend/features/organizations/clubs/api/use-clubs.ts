// src/frontend/features/organizations/clubs/api/use-clubs.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types/Api";
import { safeFetch } from "@/shared/utils/safeFetch";

import type { ClubsPaginatedResponse } from "../../committees/types/ClubsPaginatedResponse";
import type { ClubBasic } from "../types/ClubBasic";
import type { ClubDetailed } from "../types/ClubDetailed";
import type { ClubFilters } from "../types/ClubFilters";
import type { ClubStatsByDepartment } from "../types/ClubStatsByDepartement";
import type { ClubStatsByRegion } from "../types/ClubStatsByRegion";
import { clubsService } from "./clubs.service";
import { clubsKeys } from "./clubsKeys";

/**
 * Hook to fetch all clubs with optional filters.
 *
 * @param filters - Optional filter criteria
 * @param options - Additional query options
 * @returns React Query result with clubs data
 *
 * @example
 * const { data: clubs, isLoading } = useClubs({ committeeId: 123 });
 */
export function useClubs(
  filters?: ClubFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<ClubsPaginatedResponse, ApiError>({
    queryKey: clubsKeys.list(filters),
    queryFn: () => clubsService.getAll(filters),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single club by ID.
 *
 * @param id - The club ID
 * @param options - Additional query options
 * @returns React Query result with club data
 *
 * @example
 * const { data: club, isLoading } = useClub(123);
 */
export function useClub(id: number, options?: { enabled?: boolean }) {
  return useQuery<ClubDetailed, ApiError>({
    queryKey: clubsKeys.detail(id),
    queryFn: () => clubsService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch club statistics aggregated by region.
 * Hits the Next.js API route which caches for 24 hours.
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
    queryKey: clubsKeys.statsByRegion(),
    queryFn: () => safeFetch<ClubStatsByRegion[]>("/api/clubs/regions"),
    initialData: options?.initialData,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Hook to fetch club statistics aggregated by département.
 * Hits the Next.js API route which caches for 1 hour.
 *
 * @returns React Query result with department stats
 *
 * @example
 * const { data: departments = [] } = useClubStatsByDepartment();
 */
export function useClubStatsByDepartment() {
  return useQuery<ClubStatsByDepartment[], ApiError>({
    queryKey: clubsKeys.statsByDepartment(),
    queryFn: () => safeFetch<ClubStatsByDepartment[]>("/api/clubs/departments"),
    staleTime: 60 * 60 * 1000,
  });
}

/**
 * Hook to fetch all clubs without filtering.
 * Hits the Next.js API route which caches for 1 hour.
 *
 * @returns React Query result with all clubs
 *
 * @example
 * const { data: clubs = [] } = useAllClubs();
 */
export function useAllClubs() {
  return useQuery<ClubBasic[], ApiError>({
    queryKey: clubsKeys.allClubs(),
    queryFn: () => safeFetch<ClubBasic[]>("/api/clubs/all"),
    staleTime: 60 * 60 * 1000,
  });
}
