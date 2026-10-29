// src/frontend/features/organizations/hooks/useDropUnknownLocation.ts
"use client";

import { type FilterProps, useDropUnknownValue } from "@/shared/hooks";

import type { useLocationOptions } from "./useLocationOptions";

interface LocationValues {
  league: number | undefined;
  committee: number | undefined;
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
 * @param selection - the current ids and `set`
 */
export function useDropUnknownLocation(
  options: ReturnType<typeof useLocationOptions>,
  { filters: { league, committee }, set }: FilterProps<LocationValues>,
) {
  useDropUnknownValue(
    league,
    options.leagues.map((option) => option.id),
    options.leaguesLoaded,
    () => set({ league: undefined }),
  );
  useDropUnknownValue(
    committee,
    options.committees.map((option) => option.id),
    options.committeesLoaded,
    () => set({ committee: undefined }),
  );
}
