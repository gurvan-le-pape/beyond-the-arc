// src/frontend/features/matches/hooks/useMatchesFilterState.ts
"use client";

import {
  CATEGORY_LIST,
  COMPETITION_LEVEL_LIST,
  GENDER_LIST,
} from "@/shared/constants";
import { useFilterState } from "@/shared/hooks";
import { dateParam, enumParam, intParam, textParam } from "@/shared/utils";

/** The matches tab's query parameters, one codec each. */
const CODECS = {
  q: textParam,
  date: dateParam,
  category: enumParam(CATEGORY_LIST),
  gender: enumParam(GENDER_LIST),
  level: enumParam(COMPETITION_LEVEL_LIST),
  committee: intParam,
  league: intParam,
  division: intParam,
  pool: intParam,
  matchday: intParam,
};

const CASCADES = {
  category: ["pool"],
  gender: ["pool"],
  level: ["committee", "league"],
  committee: ["division"],
  league: ["division"],
  division: ["pool"],
  pool: ["matchday"],
} as const;

/**
 * The matches list's filters and pagination, in the query string.
 *
 * The competition filters cascade top-down — level, then committee or league,
 * then division, pool and matchday — and a new value clears everything below
 * it, whose options depended on it. A pool belongs to one championship, so
 * changing the category or gender clears it too.
 *
 * @returns the filters, `set`, pagination and `reset`; see `useFilterState`
 */
export function useMatchesFilterState() {
  return useFilterState(CODECS, CASCADES);
}

/** The matches list's filter values. */
export type MatchesFilterValues = ReturnType<
  typeof useMatchesFilterState
>["filters"];
