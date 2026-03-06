// src/frontend/features/matches/api/use-matches.ts
import { useQueries, useQuery } from "@tanstack/react-query";

import type { MatchFilters } from "../types/MatchFilters";
import { matchesService } from "./matches.service";
import { matchesKeys } from "./matchesKeys";

/**
 * Hook to fetch all matches with optional filters and pagination.
 *
 * Features:
 * - Automatic caching (2 minutes)
 * - Background refetching
 * - Pagination support
 *
 * @param filters - Optional filter criteria
 * @returns React Query result with paginated matches
 *
 * @example
 * const { data, isLoading } = useMatches({
 *   championshipId: 1,
 *   page: 1,
 *   limit: 20,
 * });
 */
export function useMatches(filters?: MatchFilters) {
  return useQuery({
    queryKey: matchesKeys.list(filters),
    queryFn: () => matchesService.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (matches update frequently)
  });
}

/**
 * Hook to fetch detailed information for a single match.
 *
 * @param id - The match ID
 * @param options - Additional query options
 * @returns React Query result with match details
 *
 * @example
 * const { data: match, isLoading } = useMatch(12345);
 */
export function useMatch(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: matchesKeys.detail(id),
    queryFn: () => matchesService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch all matches for a specific pool.
 *
 * @param poolId - The pool ID
 * @param options - Additional query options
 * @returns React Query result with matches
 *
 * @example
 * const { data: matches } = useMatchesByPool(10);
 */
export function useMatchesByPool(
  poolId: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: matchesKeys.byPool(poolId),
    queryFn: () => matchesService.getByPoolId(poolId),
    enabled: options?.enabled ?? !!poolId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch matches for multiple pools simultaneously.
 *
 * Features:
 * - Runs parallel queries for each pool
 * - Automatic caching (2 minutes)
 * - Background refetching
 *
 * @param poolIds - Array of pool IDs to fetch matches for
 * @returns Array of React Query results, one per pool ID
 *
 * @example
 * const matchQueries = useMatchesByPools(pools.map((pool) => pool.id));
 * const data = matchQueries[0]?.data;
 */
export function useMatchesByPools(poolIds: number[]) {
  return useQueries({
    queries: poolIds.map((poolId) => ({
      queryKey: matchesKeys.byPool(poolId),
      queryFn: () => matchesService.getByPoolId(poolId),
      enabled: !!poolId,
      staleTime: 2 * 60 * 1000,
    })),
  });
}

/**
 * Hook to fetch all matches for a specific championship.
 *
 * @param championshipId - The championship ID
 * @param options - Additional query options
 * @returns React Query result with matches
 *
 * @example
 * const { data: matches } = useMatchesByChampionship(5);
 */
export function useMatchesByChampionship(
  championshipId: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: matchesKeys.byChampionship(championshipId),
    queryFn: () => matchesService.getByChampionshipId(championshipId),
    enabled: options?.enabled ?? !!championshipId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch all events for a specific match.
 *
 * @param matchId - The match ID
 * @param options - Additional query options
 * @returns React Query result with match events
 *
 * @example
 * const { data: events } = useMatchEvents(12345);
 */
export function useMatchEvents(
  matchId: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: matchesKeys.events(matchId),
    queryFn: () => matchesService.getEventsByMatchId(matchId),
    enabled: options?.enabled ?? !!matchId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch player statistics for a specific match.
 *
 * @param matchId - The match ID
 * @param options - Additional query options
 * @returns React Query result with player stats
 *
 * @example
 * const { data: stats } = useMatchPlayerStats(12345);
 */
export function useMatchPlayerStats(
  matchId: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: matchesKeys.playerStats(matchId),
    queryFn: () => matchesService.getPlayerStatsByMatchId(matchId),
    enabled: options?.enabled ?? !!matchId,
    staleTime: 2 * 60 * 1000,
  });
}
