// src/frontend/features/players/api/usePlayers.ts
import { useQuery } from "@tanstack/react-query";

import type { PlayerFilters } from "../types/PlayerFilters";
import { playersService } from "./players.service";
import { playersKeys } from "./playersKeys";

export function usePlayers(
  filters?: PlayerFilters,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: playersKeys.list(filters),
    queryFn: () => playersService.getAll(filters),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlayer(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: playersKeys.detail(id),
    queryFn: () => playersService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlayerMatches(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: playersKeys.matches(id),
    queryFn: () => playersService.getMatches(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 2 * 60 * 1000,
  });
}
