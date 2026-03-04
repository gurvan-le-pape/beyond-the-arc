// src/frontend/features/competitions/hooks/useRegionalChampionships.ts
"use client";

import { useEffect, useState } from "react";

import { committeesService } from "@/features/organizations/committees/api/committees.service";
import type { Committee } from "@/features/organizations/committees/types/Committees";
import { leaguesService } from "@/features/organizations/leagues/api/leagues.service";
import type { League } from "@/features/organizations/leagues/types/Ligue";
import { CompetitionLevel } from "@/shared/constants";
import type { ApiError } from "@/shared/types";

import { championshipService } from "../championships/api";
import type { Championship } from "../championships/types/Championship";

interface UseRegionalChampionshipsDataResult {
  championships: Championship[];
  league: League | null;
  leagues: League[];
  committees: Committee[];
  isLoading: boolean;
  error: ApiError | null;
}

export function useRegionalChampionshipsData(
  leagueId: number,
): UseRegionalChampionshipsDataResult {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [league, setLeague] = useState<League | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!leagueId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [championshipsData, leaguesData, committeesData] =
          await Promise.all([
            championshipService.getAll({
              level: CompetitionLevel.REGIONAL,
              id: leagueId,
            }),
            leaguesService.getAll(),
            committeesService.getAll({ leagueId: leagueId }),
          ]);

        setChampionships(championshipsData);
        setLeagues(leaguesData);
        setCommittees(committeesData);

        // Find the league by ID from the leagues array
        const leagueFound =
          leaguesData.find((l: League) => l.id === leagueId) || null;
        setLeague(leagueFound);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [leagueId]);

  return {
    championships,
    league,
    leagues,
    committees,
    isLoading,
    error,
  };
}
