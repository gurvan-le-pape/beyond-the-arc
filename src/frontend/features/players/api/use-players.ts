// src/frontend/features/players/api/use-players.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types/Api";

import type { Player } from "../types/Player";
import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerMatchHistory } from "../types/PlayerMatchHistory";
import type { PlayersPaginatedResponse } from "../types/PlayersPaginatedResponse";
import { playersService } from "./players.service";
import { playersKeys } from "./playersKeys";

/**
 * Hook to fetch all players with optional filters and pagination.
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
    queryKey: playersKeys.list(filters),
    queryFn: () => playersService.getAll(filters),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
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
    queryKey: playersKeys.detail(id),
    queryFn: () => playersService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch match history for a specific player.
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
    queryKey: playersKeys.matches(id),
    queryFn: () => playersService.getMatches(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 2 * 60 * 1000,
  });
}
