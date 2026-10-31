// src/frontend/features/organizations/committees/api/useCommittees.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types";

import type { Committee } from "../types/Committees";
import type { CommitteeFilters } from "../types/CommitteesFilters";
import { committeesQueries } from "./committeesQueries";

/**
 * Hook to fetch all committees with optional filters.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetch on mount when stale (window-focus refetching is off)
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
