// src/frontend/features/organizations/hooks/useLocationOptions.ts
"use client";

import { useCommittees } from "@/features/organizations/committees/api";
import { useLeagues } from "@/features/organizations/leagues/api";

/**
 * The league and committee lists a location filter offers, plus the first
 * error either lookup produced and a `retry` that re-runs it.
 *
 * Data only — the selection itself lives in `useLocationFilterState`.
 *
 * Pass `leagueId` to narrow the committees to that league, which is what a
 * league → committee cascade needs. Left off, both queries are
 * unparameterised and every caller shares one cache entry per list.
 *
 * @param params - `leagueId` narrows the committees to that league; omitted, both lists are unparameterised and shared across callers
 * @returns the two option lists, the first error either lookup produced, and a `retry` for it
 */
export function useLocationOptions(params?: { leagueId?: number }) {
  const {
    data: committees = [],
    error: committeesError,
    refetch: refetchCommittees,
  } = useCommittees(
    params?.leagueId ? { leagueId: params.leagueId } : undefined,
  );
  const {
    data: leagues = [],
    error: leaguesError,
    refetch: refetchLeagues,
  } = useLeagues();

  return {
    committees,
    leagues,
    error: committeesError ?? leaguesError ?? null,
    // Re-runs only the lookup that failed: the other one's list is already on
    // screen, and refetching it would be a request nobody asked for.
    retry: () =>
      Promise.all([
        committeesError ? refetchCommittees() : undefined,
        leaguesError ? refetchLeagues() : undefined,
      ]),
  };
}
