// src/frontend/features/competitions/hooks/useDepartmentalChampionships.ts
"use client";

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

interface UseDepartmentalChampionshipsDataResult {
  championships: Championship[];
  committee: Committee | null;
  committees: Committee[];
  clubs: ClubBasic[];
  isLoading: boolean;
  error: Error | null;
}

export function useDepartmentalChampionshipsData(
  committeeId: number,
): UseDepartmentalChampionshipsDataResult {
  const results = useQueries({
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

  const [championshipsQuery, committeesQuery, clubsQuery] = results;

  const isLoading = results.some((r) => r.isLoading);
  const error = results.find((r) => r.error)?.error ?? null;

  const committees = committeesQuery.data ?? [];
  const committee =
    committees.find((c: Committee) => c.id === committeeId) ?? null;

  return {
    championships: championshipsQuery.data ?? [],
    committee,
    committees,
    clubs: clubsQuery.data ?? [],
    isLoading,
    error,
  };
}
