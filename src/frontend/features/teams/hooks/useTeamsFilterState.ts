// src/frontend/features/teams/hooks/useTeamsFilterState.ts
"use client";

import {
  CATEGORY_LIST,
  COMPETITION_LEVEL_LIST,
  GENDER_LIST,
} from "@/shared/constants";
import { useFilterState } from "@/shared/hooks";
import { enumParam, intParam, textParam } from "@/shared/utils";

/** The teams tab's query parameters, one codec each. */
const CODECS = {
  club: intParam,
  clubName: textParam,
  number: intParam,
  category: enumParam(CATEGORY_LIST),
  gender: enumParam(GENDER_LIST),
  level: enumParam(COMPETITION_LEVEL_LIST),
  committee: intParam,
  league: intParam,
  division: intParam,
  pool: textParam,
};

const CASCADES = {
  level: ["committee", "league"],
  committee: ["number", "division"],
  league: ["number", "division"],
  division: ["pool"],
} as const;

/**
 * The teams list's filters and pagination, in the query string.
 *
 * Team numbers and divisions are offered per committee or league, and pools
 * per division, so a new scope clears them.
 *
 * @returns the filters, `set`, pagination and `reset`; see `useFilterState`
 */
export function useTeamsFilterState() {
  return useFilterState(CODECS, CASCADES);
}

/** The teams list's filter values. */
export type TeamsFilterValues = ReturnType<
  typeof useTeamsFilterState
>["filters"];
