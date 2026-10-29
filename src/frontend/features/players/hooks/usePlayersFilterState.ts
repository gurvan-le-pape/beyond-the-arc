// src/frontend/features/players/hooks/usePlayersFilterState.ts
"use client";

import {
  CATEGORY_LIST,
  COMPETITION_LEVEL_LIST,
  GENDER_LIST,
} from "@/shared/constants";
import { useFilterState } from "@/shared/hooks";
import { enumParam, intParam, textParam } from "@/shared/utils";

/** The players tab's query parameters, one codec each. */
const CODECS = {
  q: textParam,
  club: intParam,
  clubName: textParam,
  category: enumParam(CATEGORY_LIST),
  gender: enumParam(GENDER_LIST),
  number: intParam,
  teamNumber: intParam,
  level: enumParam(COMPETITION_LEVEL_LIST),
  committee: intParam,
  league: intParam,
};

const CASCADES = {
  level: ["committee", "league"],
  committee: ["number", "teamNumber"],
  league: ["number", "teamNumber"],
} as const;

/**
 * The players list's filters and pagination, in the query string.
 *
 * Jersey and team numbers are offered per committee or league, so a new scope
 * clears them.
 *
 * @returns the filters, `set`, pagination and `reset`; see `useFilterState`
 */
export function usePlayersFilterState() {
  return useFilterState(CODECS, CASCADES);
}

/** The players list's filter values. */
export type PlayersFilterValues = ReturnType<
  typeof usePlayersFilterState
>["filters"];
