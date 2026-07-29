// src/frontend/features/organizations/hooks/useLocationOptions.ts
"use client";

import { useCommittees } from "@/features/organizations/committees/api";
import { useLeagues } from "@/features/organizations/leagues/api";

/**
 * The league and committee lists a location filter offers, plus the first
 * error either lookup produced.
 *
 * Data only — the selection itself lives in `useLocationFilterState`. Both
 * queries are unparameterised, so every caller shares one cache entry per list.
 */
export function useLocationOptions() {
  const { data: committees = [], error: committeesError } = useCommittees();
  const { data: leagues = [], error: leaguesError } = useLeagues();

  return {
    committees,
    leagues,
    error: committeesError ?? leaguesError ?? null,
  };
}
