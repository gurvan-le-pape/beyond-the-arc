// src/frontend/features/competitions/championships/hooks/useDepartmentalChampionships.ts

import { useClubs } from "@/features/organizations/clubs/api";
import type { ClubBasic } from "@/features/organizations/clubs/types/ClubBasic";
import { useCommittees } from "@/features/organizations/committees/api";
import type { Committee } from "@/features/organizations/committees/types/Committees";
import { CompetitionLevel } from "@/shared/constants";

import { useChampionships } from "../api";
import type { Championship } from "../types";

type DepartmentalErrorKey =
  | "errors.fetchChampionships"
  | "errors.fetchCommittees"
  | "errors.fetchClubs";

interface UseDepartmentalChampionshipsDataResult {
  championships: Championship[];
  committee: Committee | null;
  clubs: ClubBasic[];
  isLoading: boolean;
  fetchError: DepartmentalErrorKey | null;
}

function getDepartmentalErrorKey(
  championshipsError: unknown,
  committeesError: unknown,
  clubsError: unknown,
): DepartmentalErrorKey | null {
  if (championshipsError) return "errors.fetchChampionships";
  if (committeesError) return "errors.fetchCommittees";
  if (clubsError) return "errors.fetchClubs";
  return null;
}

export function useDepartmentalChampionshipsData(
  committeeId: number,
): UseDepartmentalChampionshipsDataResult {
  // Fetch championships
  const championshipsQuery = useChampionships(
    { level: CompetitionLevel.DEPARTMENTAL, id: committeeId },
    { enabled: !!committeeId },
  );
  // Fetch committees
  const committeesQuery = useCommittees();
  // Fetch clubs
  const clubsQuery = useClubs(
    {
      level: CompetitionLevel.DEPARTMENTAL,
      committeeId,
    },
    { enabled: !!committeeId },
  );

  const isLoading = [championshipsQuery, committeesQuery, clubsQuery].some(
    (r) => r.isLoading,
  );

  const fetchError = getDepartmentalErrorKey(
    championshipsQuery.error,
    committeesQuery.error,
    clubsQuery.error,
  );

  const committees = committeesQuery.data ?? [];
  const committee = committees.find((c) => c.id === committeeId) ?? null;

  return {
    championships: championshipsQuery.data ?? [],
    committee,
    clubs: clubsQuery.data?.items ?? [],
    isLoading,
    fetchError,
  };
}
