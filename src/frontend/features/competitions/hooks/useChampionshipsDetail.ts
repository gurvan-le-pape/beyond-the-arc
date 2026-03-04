// src/frontend/features/competitions/hooks/useChampionshipsDetail.ts
"use client";

import { useEffect, useMemo, useState } from "react";

import { useMatchesByPool } from "@/features/matches/api";
import type { Match } from "@/features/matches/types/Match";
import { useCommittee } from "@/features/organizations/committees/api/use-committees";
import { useLeague } from "@/features/organizations/leagues/api/use-leagues";
import {
  CompetitionLevel,
  type LocalCompetitionLevel,
} from "@/shared/constants";

import { useChampionship } from "../championships/api";
import { useLeaderboard } from "../leaderboards/api/use-leaderboards";
import { usePools } from "../pools/api/use-pools";

/**
 * Hook to fetch and manage championship detail page data.
 *
 * Features:
 * - Fetches organization (league or committee) data
 * - Fetches championship details
 * - Fetches pools for the championship
 * - Fetches leaderboards and matches for each pool
 * - Manages selected pool state
 *
 * Architecture:
 * - Uses React Query hooks (no direct service calls)
 * - Leverages automatic caching and refetching
 * - Proper loading and error states
 *
 * @param id - Organization ID (league or committee)
 * @param championshipId - Championship ID
 * @param level - Competition level (regional or departmental)
 * @returns Championship detail data and state management
 *
 * @example
 * const {
 *   championship,
 *   name,
 *   pools,
 *   leaderboards,
 *   matches,
 *   isLoading,
 *   error,
 * } = useChampionshipsDetail(1, 123, CompetitionLevel.REGIONAL);
 */
export function useChampionshipsDetail(
  id: number,
  championshipId: number,
  level: LocalCompetitionLevel,
) {
  // Parse IDs
  const orgId = useMemo(() => {
    return id ? Number.parseInt(Array.isArray(id) ? id[0] : id) : null;
  }, [id]);

  const champId = useMemo(() => {
    return championshipId
      ? Array.isArray(championshipId)
        ? championshipId[0]
        : championshipId
      : null;
  }, [championshipId]);

  // Local state
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null);

  // ============================================================================
  // Fetch organization (league or committee)
  // ============================================================================
  const isRegional = level === CompetitionLevel.REGIONAL;

  const {
    data: league,
    isLoading: isLoadingLeague,
    error: leagueError,
  } = useLeague(orgId!, {
    enabled: isRegional && !!orgId,
  });

  const {
    data: committee,
    isLoading: isLoadingCommittee,
    error: committeeError,
  } = useCommittee(orgId!, {
    enabled: !isRegional && !!orgId,
  });

  const name = isRegional ? league?.name : committee?.name;
  const organizationError = isRegional ? leagueError : committeeError;
  const isLoadingOrganization = isRegional
    ? isLoadingLeague
    : isLoadingCommittee;

  // ============================================================================
  // Fetch the selected championship directly by its ID
  // ============================================================================
  const {
    data: championship,
    isLoading: isLoadingChampionship,
    error: championshipError,
  } = useChampionship(champId, {
    enabled: !!champId,
  });

  // ============================================================================
  // Fetch pools for the championship
  // ============================================================================
  const {
    data: pools = [],
    isLoading: isLoadingPools,
    error: poolsError,
  } = usePools(champId!, {
    enabled: !!champId,
  });

  // Auto-select first pool
  useEffect(() => {
    if (pools.length > 0 && !selectedPoolId) {
      setSelectedPoolId(pools[0].id);
    }
  }, [pools, selectedPoolId]);

  // ============================================================================
  // Fetch leaderboards for all pools
  // ============================================================================
  const leaderboardQueries = pools.map((pool) =>
    useLeaderboard({ poolId: pool.id }, { enabled: !!pool.id }),
  );

  const leaderboards = useMemo(() => {
    const map: Record<number, any[]> = {};
    pools.forEach((pool, index) => {
      const data = leaderboardQueries[index]?.data;
      if (data) {
        map[pool.id] = data;
      }
    });
    return map;
  }, [pools, leaderboardQueries]);

  // ============================================================================
  // Fetch matches for all pools
  // ============================================================================
  const matchQueries = pools.map((pool) =>
    useMatchesByPool(pool.id, { enabled: !!pool.id }),
  );

  const matches = useMemo(() => {
    const map: Record<number, Match[]> = {};
    pools.forEach((pool, index) => {
      const data = matchQueries[index]?.data;
      if (data) {
        map[pool.id] = data;
      }
    });
    return map;
  }, [pools, matchQueries]);

  // ============================================================================
  // Aggregate loading and error states
  // ============================================================================
  const isLoading =
    isLoadingOrganization ||
    isLoadingChampionship ||
    isLoadingPools ||
    leaderboardQueries.some((q) => q.isLoading) ||
    matchQueries.some((q) => q.isLoading);

  const error =
    organizationError?.message ||
    championshipError?.message ||
    poolsError?.message ||
    leaderboardQueries.find((q) => q.error)?.error?.message ||
    matchQueries.find((q) => q.error)?.error?.message ||
    null;

  return {
    championship,
    name: name,
    category: championship?.category,
    gender: championship?.gender,
    division: championship?.division,
    pools,
    leaderboards,
    matches,
    selectedPoolId,
    setSelectedPoolId,
    isLoading,
    error,
  };
}
