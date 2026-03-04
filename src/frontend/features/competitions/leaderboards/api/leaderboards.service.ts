// src/frontend/features/competitions/leaderboards/api/leaderboards.service.ts
import apiClient from "../../../../lib/services/client/api-client";
import type { Leaderboard } from "../types/Leaderboard";
import type { LeaderboardFilters } from "../types/LeaderboardFilters";

/**
 * Service for interacting with the leaderboards API.
 * Retrieves ranking and standings data.
 *
 * Architecture:
 * - Uses apiClient (axios) for HTTP requests
 * - Backend responses are unwrapped by axios interceptor
 * - Services work directly with typed data
 * - Errors are handled globally by interceptor
 *
 * Usage:
 * - Import this service in React Query hooks
 * - Never call directly from components
 *
 * @example
 * import { leaderboardsService } from '@/lib/services/client';
 * const leaderboard = await leaderboardsService.getAll({ poolId: 1 });
 */
export const leaderboardsService = {
  /**
   * Get leaderboard data with optional filters.
   * Returns team rankings, standings, and statistics.
   *
   * @param filters - Optional filter criteria (poolId, championshipId, etc.)
   * @returns Leaderboard data with team rankings
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * // Get leaderboard for a specific pool
   * const leaderboard = await leaderboardsService.getAll({ poolId: 1 });
   *
   * @example
   * // Get leaderboard for a championship
   * const leaderboard = await leaderboardsService.getAll({ championshipId: 10 });
   */
  async getAll(filters?: LeaderboardFilters): Promise<Leaderboard[]> {
    const { data } = await apiClient.get<any>("/leaderboards", {
      params: filters,
    });
    return data;
  },
};
