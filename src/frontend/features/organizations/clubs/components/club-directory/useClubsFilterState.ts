// src/frontend/features/organizations/clubs/components/club-directory/useClubsFilterState.ts
"use client";

import { useCallback, useMemo } from "react";

import { useUrlState } from "@/shared/hooks";
import { intParam, pageSizeParam, textParam } from "@/shared/utils";

export interface ClubsFilterState {
  search: string;
  leagueId: number | undefined;
  committeeId: number | undefined;
  currentPage: number;
  pageSize: number;
}

export interface ClubsFilterSetters {
  setSearch: (value: string) => void;
  setLeagueId: (value: number | undefined) => void;
  setCommitteeId: (value: number | undefined) => void;
}

const DEFAULT_PAGE_SIZE = 50;

/** The clubs list's query parameters, one codec each. */
const CODECS = {
  q: textParam,
  league: intParam,
  committee: intParam,
  page: intParam,
  size: pageSizeParam,
};

/** Merged into every filter change: a new filter starts again from page 1. */
const FIRST_PAGE = { page: undefined } as const;

/**
 * Owns the clubs list's filters and pagination in the query string, so a
 * filtered list survives a reload and the back button, and can be shared as a
 * link.
 *
 * **Changing any filter resets to page 1**, in the same URL update. A new
 * league clears the committee: committees are offered scoped to the selected
 * league, so one chosen under another league is meaningless. Page size
 * defaults to 50.
 *
 * @returns the filter values, their setters, and pagination state
 */
export function useClubsFilterState() {
  const { state, update } = useUrlState(CODECS);

  const filters: ClubsFilterState = {
    search: state.q ?? "",
    leagueId: state.league,
    committeeId: state.committee,
    currentPage: state.page ?? 1,
    pageSize: state.size ?? DEFAULT_PAGE_SIZE,
  };

  const setters: ClubsFilterSetters = useMemo(
    () => ({
      setSearch: (value) => update({ q: value, ...FIRST_PAGE }),
      setLeagueId: (value) =>
        update({ league: value, committee: undefined, ...FIRST_PAGE }),
      setCommitteeId: (value) => update({ committee: value, ...FIRST_PAGE }),
    }),
    [update],
  );

  const setCurrentPage = useCallback(
    (page: number) => update({ page: page > 1 ? page : undefined }),
    [update],
  );

  const setPageSize = useCallback(
    (size: number) =>
      update({
        size: size === DEFAULT_PAGE_SIZE ? undefined : size,
        ...FIRST_PAGE,
      }),
    [update],
  );

  const resetFilters = useCallback(
    () =>
      update({
        q: undefined,
        league: undefined,
        committee: undefined,
        ...FIRST_PAGE,
      }),
    [update],
  );

  return {
    filters,
    setters,
    setCurrentPage,
    setPageSize,
    resetFilters,
  };
}
