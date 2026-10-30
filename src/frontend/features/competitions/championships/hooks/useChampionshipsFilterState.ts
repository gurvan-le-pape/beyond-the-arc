// src/frontend/features/competitions/championships/hooks/useChampionshipsFilterState.ts
"use client";

import { CATEGORY_LIST, GENDER_LIST } from "@/shared/constants";
import { useFilterState } from "@/shared/hooks";
import { enumParam, intParam } from "@/shared/utils";

/** The championships tabs' query parameters, one codec each. */
const CODECS = {
  category: enumParam(CATEGORY_LIST),
  gender: enumParam(GENDER_LIST),
  league: intParam,
  committee: intParam,
};

const CASCADES = {} as const;

/**
 * A championships tab's filters and pagination, in the query string.
 *
 * One set of parameters serves the three level tabs: `league` scopes the
 * regional tab and `committee` the departmental one, and the national tab
 * reads neither. Switching tabs resets the query string to `?tab=`, so one
 * tab's filters never reach another.
 *
 * @returns the filters, `set`, pagination and `reset`; see `useFilterState`
 */
export function useChampionshipsFilterState() {
  return useFilterState(CODECS, CASCADES);
}
