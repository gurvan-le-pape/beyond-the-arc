// src/frontend/features/organizations/leagues/api/useLeagues.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types";

import type { League } from "../types/League";
import { leaguesQueries } from "./leaguesQueries";

/**
 * Hook to fetch all leagues (regional leagues).
 *
 * @param options - `initialData` seeds the cache from a server render, so the first paint has no loading state
 * @returns React Query result with leagues data
 *
 * @example
 * const { data: leagues, isLoading } = useLeagues();
 */
export function useLeagues(options?: { initialData?: League[] }) {
  return useQuery<League[], ApiError>({
    ...leaguesQueries.list(),
    initialData: options?.initialData,
  });
}
