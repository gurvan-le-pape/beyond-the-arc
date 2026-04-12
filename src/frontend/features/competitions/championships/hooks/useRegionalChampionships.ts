// src/frontend/features/competitions/championships/hooks/useRegionalChampionships.ts

import { useCommittees } from "@/features/organizations/committees/api/use-committees";
import type { Committee } from "@/features/organizations/committees/types/Committees";
import { useLeagues } from "@/features/organizations/leagues/api/use-leagues";
import type { League } from "@/features/organizations/leagues/types/League";
import { CompetitionLevel } from "@/shared/constants";

import { useChampionships } from "../api";
import type { Championship } from "../types";

type RegionalErrorKey =
  | "errors.fetchChampionships"
  | "errors.fetchLeagues"
  | "errors.fetchCommittees";

interface UseRegionalChampionshipsDataResult {
  championships: Championship[];
  league: League | null;
  committees: Committee[];
  isLoading: boolean;
  fetchError: RegionalErrorKey | null;
}

function getRegionalErrorKey(
  championshipsError: unknown,
  leaguesError: unknown,
  committeesError: unknown,
): RegionalErrorKey | null {
  if (championshipsError) return "errors.fetchChampionships";
  if (leaguesError) return "errors.fetchLeagues";
  if (committeesError) return "errors.fetchCommittees";
  return null;
}

export function useRegionalChampionshipsData(
  leagueId: number,
): UseRegionalChampionshipsDataResult {
  const championshipsQuery = useChampionships(
    { level: CompetitionLevel.REGIONAL, id: leagueId },
    { enabled: !!leagueId },
  );
  const leaguesQuery = useLeagues();
  const committeesQuery = useCommittees({ leagueId }, { enabled: !!leagueId });

  const isLoading = [championshipsQuery, leaguesQuery, committeesQuery].some(
    (r) => r.isLoading,
  );

  const fetchError = getRegionalErrorKey(
    championshipsQuery.error,
    leaguesQuery.error,
    committeesQuery.error,
  );

  const leagues = leaguesQuery.data ?? [];
  const league = leagues.find((l) => l.id === leagueId) ?? null;

  return {
    championships: championshipsQuery.data ?? [],
    league,
    committees: committeesQuery.data ?? [],
    isLoading,
    fetchError,
  };
}
