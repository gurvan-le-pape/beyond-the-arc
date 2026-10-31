// src/frontend/features/organizations/leagues/api/useLeagues.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types";

import type { League } from "../types/League";
import { leaguesQueries } from "./leaguesQueries";

/**
 * Hook to fetch all leagues (regional leagues).
 *
 * Features:
 * - Automatic caching (5 minutes stale, 15 minutes GC)
 * - Background refetch on mount when stale (window-focus refetching is off)
 *
 * @returns React Query result with leagues data
 *
 * @example
 * const { data: leagues, isLoading } = useLeagues();
 */
export function useLeagues() {
  return useQuery<League[], ApiError>(leaguesQueries.list());
}
