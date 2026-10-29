// src/frontend/features/organizations/clubs/components/list/club-directory/useClubsFilterState.ts
"use client";

import { useFilterState } from "@/shared/hooks";
import { intParam, textParam } from "@/shared/utils";

/** The clubs directory's query parameters, one codec each. */
const CODECS = {
  q: textParam,
  league: intParam,
  committee: intParam,
};

const CASCADES = { league: ["committee"] } as const;

/**
 * The clubs directory's filters and pagination, in the query string.
 *
 * Committees are offered scoped to the selected league, so a new league
 * clears the committee.
 *
 * @returns the filters, `set`, pagination and `reset`; see `useFilterState`
 */
export function useClubsFilterState() {
  return useFilterState(CODECS, CASCADES);
}

/** The clubs directory's filter values. */
export type ClubsFilterValues = ReturnType<
  typeof useClubsFilterState
>["filters"];
