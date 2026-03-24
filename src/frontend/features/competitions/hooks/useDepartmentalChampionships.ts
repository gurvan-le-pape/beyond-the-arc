// src/frontend/features/competitions/hooks/useDepartmentalChampionships.ts
import { useQueries } from "@tanstack/react-query";

import { clubsService } from "@/features/organizations/clubs/api/clubs.service";
import { clubsKeys } from "@/features/organizations/clubs/api/clubsKeys";
import type { ClubBasic } from "@/features/organizations/clubs/types/ClubBasic";
import { committeesService } from "@/features/organizations/committees/api/committees.service";
import { committeesKeys } from "@/features/organizations/committees/api/committeesKeys";
import type { Committee } from "@/features/organizations/committees/types/Committees";
import { CompetitionLevel } from "@/shared/constants";

import { championshipService } from "../championships/api/championships.service";
import { championshipsKeys } from "../championships/api/championshipsKeys";
import type { Championship } from "../championships/types/Championship";

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
  const [championshipsQuery, committeesQuery, clubsQuery] = useQueries({
    queries: [
      {
        queryKey: championshipsKeys.list({
          level: CompetitionLevel.DEPARTMENTAL,
          id: committeeId,
        }),
        queryFn: () =>
          championshipService.getAll({
            level: CompetitionLevel.DEPARTMENTAL,
            id: committeeId,
          }),
      },
      {
        queryKey: committeesKeys.lists(),
        queryFn: () => committeesService.getAll(),
      },
      {
        queryKey: clubsKeys.list({
          level: CompetitionLevel.DEPARTMENTAL,
          committeeId,
        }),
        queryFn: () =>
          clubsService.getAll({
            level: CompetitionLevel.DEPARTMENTAL,
            committeeId,
          }),
      },
    ],
  });

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
    clubs: clubsQuery.data ?? [],
    isLoading,
    fetchError,
  };
}
