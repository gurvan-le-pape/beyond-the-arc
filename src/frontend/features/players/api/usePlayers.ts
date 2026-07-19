// src/frontend/features/players/api/usePlayers.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Player } from "../types/Player";
import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerFilterValues } from "../types/PlayerFilterValues";
import type { PlayerMatchHistory } from "../types/PlayerMatchHistory";
import { playersPrefetch, playersQueries } from "./playersQueries";

/**
 * Hook to fetch all players with optional filters and pagination.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetching on window focus
 * - Pagination support
 *
 * @param filters - Optional filter criteria (name, category, gender, etc.)
 * @param options - Additional query options
 * @returns React Query result with paginated players data
 *
 * @example
 * const { data: playersData, isLoading } = usePlayers({ leagueId: 1, page: 1 });
 */
export function usePlayers(
  filters?: PlayerFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<PaginatedResponse<Player>, ApiError>({
    ...playersQueries.list(filters),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch a single player by ID.
 *
 * @param id - The player ID
 * @param options - Additional query options
 * @returns React Query result with player data
 *
 * @example
 * const { data: player, isLoading } = usePlayer(123);
 */
export function usePlayer(id: number, options?: { enabled?: boolean }) {
  return useQuery<Player, ApiError>({
    ...playersQueries.detail(id),
    enabled: options?.enabled ?? !!id,
  });
}

/**
 * Hook to fetch match history for a specific player.
 * Refreshes more aggressively (2 minutes) than other player data
 * since results update throughout the week as fixtures are played.
 *
 * @param id - The player ID
 * @param options - Additional query options
 * @returns React Query result with player match history
 *
 * @example
 * const { data: matches, isLoading } = usePlayerMatches(123);
 */
export function usePlayerMatches(id: number, options?: { enabled?: boolean }) {
  return useQuery<PlayerMatchHistory[], ApiError>({
    ...playersQueries.matches(id),
    enabled: options?.enabled ?? !!id,
  });
}

/**
 * Hook to fetch available filter values for players.
 * Returns player numbers and team numbers scoped to an optional
 * committee or league.
 *
 * @param params - Optional scoping parameters (committeeId, leagueId)
 * @returns React Query result with filter values
 *
 * @example
 * const { data: filterValues } = usePlayerFilterValues({ committeeId: 1 });
 */
export function usePlayerFilterValues(params?: {
  committeeId?: number;
  leagueId?: number;
}) {
  return useQuery<PlayerFilterValues, ApiError>(
    playersQueries.filterValues(params),
  );
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
 * const prefetch = usePlayersPrefetch();
 * <tr onMouseEnter={() => prefetch.detail(player.id)} />
 */
export function usePlayersPrefetch() {
  const queryClient = useQueryClient();

  return {
    detail: playersPrefetch.detail(queryClient),
    matches: playersPrefetch.matches(queryClient),
  };
}
