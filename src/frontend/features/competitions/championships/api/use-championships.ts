// src/frontend/features/competitions/championships/api/use-championships.ts
import { useQuery } from "@tanstack/react-query";

import { championshipsKeys } from "@/features/competitions/championships/api/championshipsKeys";

import type { ChampionshipFilters } from "../types/ChampionshipFilters";
import { championshipService } from "./championships.service";

/**
 * Hook to fetch all championships with optional filters.
 *
 * Features:
 * - Automatic caching
 * - Background refetching
 * - Loading and error states
 *
 * @param filters - Optional filter criteria
 * @param options - Additional query options
 * @returns React Query result with championships data
 *
 * @example
 * const { data: championships, isLoading } = useChampionships({ level: 'national' });
 */
export function useChampionships(
  filters?: ChampionshipFilters,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: championshipsKeys.list(filters),
    queryFn: () =>
      championshipService.getAll(filters ?? { level: "regional", id: 0 }),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single championship by ID.
 *
 * Features:
 * - Automatic caching (5 minutes)
 * - Can be disabled with options.enabled
 * - Background refetching
 *
 * @param id - The championship ID
 * @param options - Additional query options
 * @returns React Query result with championship data
 *
 * @example
 * const { data: championship, isLoading } = useChampionship('123');
 *
 * @example
 * // Conditionally enabled
 * const { data } = useChampionship(id, {
 *   enabled: !!id && id !== '0',
 * });
 */
export function useChampionship(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: championshipsKeys.detail(id),
    queryFn: () => championshipService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all available championship divisions.
 *
 * Features:
 * - Automatic caching (10 minutes - divisions rarely change)
 * - Background refetching
 * - Server-side caching for 10 minutes
 *
 * @returns React Query result with divisions data
 *
 * @example
 * const { data: divisions, isLoading } = useDivisions();
 *
 * return (
 *   <select>
 *     {divisions?.map(d => (
 *       <option key={d.id} value={d.id}>{d.name}</option>
 *     ))}
 *   </select>
 * );
 */
export function useDivisions() {
  return useQuery({
    queryKey: championshipsKeys.divisions(),
    queryFn: () => championshipService.getDivisions(),
    staleTime: 10 * 60 * 1000, // 10 minutes (divisions rarely change)
  });
}
