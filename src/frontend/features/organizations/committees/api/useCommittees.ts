// src/frontend/features/organizations/committees/api/useCommittees.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types";

import type { Committee } from "../types/Committees";
import type { CommitteeFilters } from "../types/CommitteesFilters";
import { committeesQueries } from "./committeesQueries";

/**
 * Hook to fetch all committees with optional filters.
 *
 * @param filters - Optional filter criteria
 * @param options - `enabled` gates the request; `initialData` seeds the cache from a server render
 * @returns React Query result with committees data
 *
 * @example
 * const { data: committees, isLoading } = useCommittees({ leagueId: 1 });
 */
export function useCommittees(
  filters?: CommitteeFilters,
  options?: { enabled?: boolean; initialData?: Committee[] },
) {
  return useQuery<Committee[], ApiError>({
    ...committeesQueries.list(filters),
    enabled: options?.enabled ?? true,
    initialData: options?.initialData,
  });
}
