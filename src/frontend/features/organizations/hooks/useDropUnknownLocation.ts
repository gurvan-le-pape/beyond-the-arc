// src/frontend/features/organizations/hooks/useDropUnknownLocation.ts
"use client";

import { useDropUnknownValue } from "@/shared/hooks";

import type { useLocationOptions } from "./useLocationOptions";

interface LocationSelection {
  leagueId: number | undefined;
  setLeagueId: (value: number | undefined) => void;
  committeeId: number | undefined;
  setCommitteeId: (value: number | undefined) => void;
}

/**
 * Clears a league or committee id that the loaded lists do not contain, so a
 * stale link does not filter by a location no picker can show.
 *
 * Pair it with the `useLocationOptions` call that feeds the same pickers: on
 * the clubs directory committees are narrowed to the selected league, so a
 * committee from another league is dropped too.
 *
 * @param options - the result of that `useLocationOptions` call
 * @param selection - the current ids and their setters
 */
export function useDropUnknownLocation(
  options: ReturnType<typeof useLocationOptions>,
  { leagueId, setLeagueId, committeeId, setCommitteeId }: LocationSelection,
) {
  useDropUnknownValue(
    leagueId,
    options.leagues.map((league) => league.id),
    options.leaguesLoaded,
    () => setLeagueId(undefined),
  );
  useDropUnknownValue(
    committeeId,
    options.committees.map((committee) => committee.id),
    options.committeesLoaded,
    () => setCommitteeId(undefined),
  );
}
