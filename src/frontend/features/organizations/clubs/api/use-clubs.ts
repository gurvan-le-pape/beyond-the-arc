// src/frontend/features/organizations/clubs/api/use-clubs.ts
import { useQuery } from "@tanstack/react-query";

import type { ClubFilters } from "../types/ClubFilters";
import { clubsService } from "./clubs.service";
import { clubsKeys } from "./clubsKeys";

/**
 * Hook to fetch all clubs with optional filters.
 *
 * @param filters - Optional filter criteria
 * @returns React Query result with clubs data
 *
 * @example
 * const { data: clubs, isLoading } = useClubs({ committeeId: 123 });
 */
export function useClubs(filters?: ClubFilters) {
  return useQuery({
    queryKey: clubsKeys.list(filters),
    queryFn: () => clubsService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
  return useQuery({
    queryKey: clubsKeys.detail(id),
    queryFn: () => clubsService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
  });
}
