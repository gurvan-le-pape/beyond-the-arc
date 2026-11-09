// src/frontend/features/competitions/championships/hooks/useChampionshipsFilterState.ts
"use client";

import { useFilterState } from "@/shared/hooks";
import { intParam } from "@/shared/utils";

/** The championships tabs' query parameters, one codec each. */
const CODECS = {
  league: intParam,
  committee: intParam,
};

const CASCADES = {} as const;

/**
 * The organiser a championships tab shows, in the query string.
 *
 * One set of parameters serves the level tabs: `league` picks the regional
 * tab's league and `committee` the departmental tab's committee. Switching
 * tabs resets the query string to `?tab=`, so one tab's choice never reaches
 * another.
 *
 * @returns the filters and `set`; see `useFilterState`
 */
export function useChampionshipsFilterState() {
  return useFilterState(CODECS, CASCADES);
}
