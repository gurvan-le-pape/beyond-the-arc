// src/frontend/features/competitions/hooks/useChampionshipsDetailById.ts
"use client";

import { useEffect, useMemo, useState } from "react";

import { useMatchesByPools } from "@/features/matches/api";
import type { Match } from "@/features/matches/types/Match";

import { useChampionship } from "../championships/api";
import { useLeaderboards } from "../leaderboards/api/use-leaderboards";
import { usePools } from "../pools/api/use-pools";

/**
 * Slimmer version of useChampionshipsDetail for the flat /championships/[championshipId] route.
 * No organization (league/committee) context needed — everything is derived from championshipId.
 */
export function useChampionshipDetailById(
  championshipId: number,
  initialPoolId?: number | null,
) {
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(
    initialPoolId ?? null,
  );

  const {
    data: championship,
    isLoading: isLoadingChampionship,
    error: championshipError,
  } = useChampionship(championshipId, { enabled: !!championshipId });

  const {
    data: pools = [],
    isLoading: isLoadingPools,
    error: poolsError,
  } = usePools(championshipId, { enabled: !!championshipId });

  useEffect(() => {
    setSelectedPoolId(initialPoolId ?? null);
  }, [championshipId, initialPoolId]);

  useEffect(() => {
    if (pools.length > 0 && !selectedPoolId) {
      const target = initialPoolId
        ? pools.find((p) => p.id === initialPoolId)?.id ?? pools[0].id
        : pools[0].id;
      setSelectedPoolId(target);
    }
  }, [pools, selectedPoolId, initialPoolId]);

  const leaderboardQueries = useLeaderboards(
    pools.map((pool) => ({ poolId: pool.id })),
  );

  const leaderboards = useMemo(() => {
    const map: Record<number, any[]> = {};
    pools.forEach((pool, index) => {
      const data = leaderboardQueries[index]?.data;
      if (data) map[pool.id] = data;
    });
    return map;
  }, [pools, leaderboardQueries]);

  const matchQueries = useMatchesByPools(pools.map((pool) => pool.id));

  const matches = useMemo(() => {
    const map: Record<number, Match[]> = {};
    pools.forEach((pool, index) => {
      const data = matchQueries[index]?.data;
      if (data) map[pool.id] = data;
    });
    return map;
  }, [pools, matchQueries]);

  const isLoading =
    isLoadingChampionship ||
    isLoadingPools ||
    leaderboardQueries.some((q) => q.isLoading) ||
    matchQueries.some((q) => q.isLoading);

  const error =
    championshipError ??
    poolsError ??
    leaderboardQueries.find((q) => q.error)?.error ??
    matchQueries.find((q) => q.error)?.error ??
    null;

  return {
    championship,
    category: championship?.category,
    gender: championship?.gender,
    division: championship?.division,
    pools,
    leaderboards,
    matches,
    selectedPoolId: selectedPoolId as number,
    setSelectedPoolId,
    isLoading,
    error,
  };
}
