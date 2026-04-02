// src/frontend/features/competitions/hooks/useCommitteeLeagueClubFilters.ts
"use client";

import { useCallback, useState } from "react";

import { useClubs } from "@/features/organizations/clubs/api";
import { useCommittees } from "@/features/organizations/committees/api/use-committees";
import { useLeagues } from "@/features/organizations/leagues/api/use-leagues";

export function useCommitteeLeagueClubFilters() {
  // Filter state
  const [committeeId, setCommitteeId] = useState<number | undefined>(undefined);
  const [leagueId, setLeagueId] = useState<number | undefined>(undefined);
  const [clubFilter, setClubFilter] = useState("");

  // Fetch committees and leagues
  const { data: committees = [], error: committeesError } = useCommittees();
  const { data: leagues = [], error: leaguesError } = useLeagues();

  // Fetch clubs
  const { data: clubsData, error: clubsError } = useClubs({
    committeeId: committeeId || undefined,
    leagueId: leagueId || undefined,
  });
  const clubs = clubsData?.items ?? [];

  // Combine errors
  const error = committeesError ?? leaguesError ?? clubsError ?? null;

  const resetFilters = useCallback(() => {
    setCommitteeId(undefined);
    setLeagueId(undefined);
    setClubFilter("");
  }, []);

  return {
    committees,
    leagues,
    clubs,
    committeeId,
    setCommitteeId,
    leagueId,
    setLeagueId,
    clubFilter,
    setClubFilter,
    error,
    resetFilters,
  };
}
