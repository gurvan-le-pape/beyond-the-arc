// src/frontend/features/teams/api/useTeams.ts
import { useQuery } from "@tanstack/react-query";

import type { TeamFilters } from "../types/TeamFilters";
import { teamsService } from "./teams.service";
import { teamsKeys } from "./teamsKeys";

export function useTeams(
  filters?: TeamFilters,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: teamsKeys.list(filters),
    queryFn: () => teamsService.getAll(filters),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTeam(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: teamsKeys.detail(id),
    queryFn: () => teamsService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTeamMatches(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: teamsKeys.matches(id),
    queryFn: () => teamsService.getMatches(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 2 * 60 * 1000,
  });
}
