// src/frontend/features/organizations/committees/api/use-committees.ts
import { useQuery } from "@tanstack/react-query";

import type { CommitteeFilters } from "../types/CommitteesFilters";
import { committeesService } from "./committees.service";
import { committeesKeys } from "./committeesKeys";

/**
 * Hook to fetch all committees with optional filters.
 *
 * Features:
 * - Automatic caching (5 minutes)
 * - Background refetching
 * - Loading and error states
 *
 * @param filters - Optional filter criteria
 * @returns React Query result with committees data
 *
 * @example
 * const { data: committees, isLoading } = useCommittees({ leagueId: 1 });
 */
export function useCommittees(filters?: CommitteeFilters) {
  return useQuery({
    queryKey: committeesKeys.list(filters),
    queryFn: () => committeesService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
  return useQuery({
    queryKey: committeesKeys.detail(id),
    queryFn: () => committeesService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
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
  return useQuery({
    queryKey: [...committeesKeys.lists(), { ids }],
    queryFn: () => committeesService.getByIds(ids),
    enabled: options?.enabled ?? ids.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
