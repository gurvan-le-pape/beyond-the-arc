// src/frontend/features/competitions/hooks/useCommitteeLeagueClubFilters.ts
"use client";

import { useCallback, useMemo, useState } from "react";

import { useClubs } from "@/features/organizations/clubs/api";
import { useCommittees } from "@/features/organizations/committees/api/use-committees";
import { useLeagues } from "@/features/organizations/leagues/api/use-leagues";

export function useCommitteeLeagueClubFilters() {
  // Filter state
  const [committeeId, setCommitteeId] = useState<number | undefined>(undefined);
  const [leagueId, setLeagueId] = useState<number | undefined>(undefined);
  const [clubFilter, setClubFilter] = useState("");

  // Fetch data using React Query hooks
  const { data: committees = [], error: committeesError } = useCommittees();
  const { data: leagues = [], error: leaguesError } = useLeagues();

  // Fetch clubs with current filters - React Query handles caching per filter combination
  const { data: clubs = [], error: clubsError } = useClubs({
    committeeId: committeeId || undefined,
    leagueId: leagueId || undefined,
  });

  // Combine errors
  const error = useMemo(() => {
    if (committeesError || leaguesError || clubsError) {
      return "Error fetching filter options";
    }
    return null;
  }, [committeesError, leaguesError, clubsError]);

  // Reset filters - no need to manually refetch, React Query handles it
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
