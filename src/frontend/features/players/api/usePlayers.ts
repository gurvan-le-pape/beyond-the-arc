// src/frontend/features/players/api/usePlayers.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Player } from "../types/Player";
import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerFilterValues } from "../types/PlayerFilterValues";
import type { PlayerMatchHistoryResponse } from "../types/PlayerMatchHistory";
import type { PlayerSearchFilters } from "../types/PlayerSearchFilters";
import { playersPrefetch, playersQueries } from "./playersQueries";

/**
 * Hook to fetch all players with optional filters and pagination.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetch on mount when stale (window-focus refetching is off)
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
  return useQuery<PlayerMatchHistoryResponse, ApiError>({
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
 * Hook to search players by name, for autocomplete dropdowns.
 *
 * Disabled until `search` reaches `minLength`, so an empty or one-character
 * box issues no request.
 *
 * `excludeId` is applied through `select` rather than in the request or the
 * query key: it drops one already-fetched row, so two dropdowns searching the
 * same term share one cache entry and each still hides its own player.
 *
 * @param search - Name fragment to search for (debounce this at the call site)
 * @param filters - Optional gender/category scoping, plus a client-side excludeId
 * @returns React Query result with the matching players
 *
 * @example
 * const debounced = useDebounce(query, 400);
 * const { data = [], isLoading } = usePlayerSearch(debounced, { excludeId });
 */
export function usePlayerSearch(
  search: string,
  filters?: PlayerSearchFilters & { excludeId?: number; minLength?: number },
) {
  const { excludeId, minLength = 2, ...searchFilters } = filters ?? {};
  const trimmed = search.trim();

  return useQuery<Player[], ApiError, Player[]>({
    ...playersQueries.search(trimmed, searchFilters),
    enabled: trimmed.length >= minLength,
    select: (players) =>
      excludeId === undefined
        ? players
        : players.filter((player) => player.id !== excludeId),
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
