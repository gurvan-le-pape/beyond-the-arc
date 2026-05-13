// src/frontend/features/players/api/use-players.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types";

import type { Player } from "../types/Player";
import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerMatchHistory } from "../types/PlayerMatchHistory";
import type { PlayersPaginatedResponse } from "../types/PlayersPaginatedResponse";
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
  return useQuery<PlayersPaginatedResponse, ApiError>({
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
