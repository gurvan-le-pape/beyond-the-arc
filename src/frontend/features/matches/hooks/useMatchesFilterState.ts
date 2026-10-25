// src/frontend/features/matches/hooks/useMatchesFilterState.ts
"use client";

import { useCallback, useMemo } from "react";

import {
  type Category,
  CATEGORY_LIST,
  COMPETITION_LEVEL_LIST,
  type CompetitionLevel,
  type Gender,
  GENDER_LIST,
} from "@/shared/constants";
import { useUrlState } from "@/shared/hooks";
import {
  dateParam,
  enumParam,
  intParam,
  pageSizeParam,
  textParam,
} from "@/shared/utils";

export interface MatchesFilterState {
  search: string;
  dateFilter: string;
  category: Category | undefined;
  gender: Gender | undefined;
  level: CompetitionLevel | undefined;
  committeeId: number | undefined;
  leagueId: number | undefined;
  division: number | undefined;
  poolId: number | undefined;
  matchday: number | undefined;
  currentPage: number;
  pageSize: number;
}

export interface MatchesFilterSetters {
  setSearch: (value: string) => void;
  setDateFilter: (value: string) => void;
  setCategory: (value: Category | undefined) => void;
  setGender: (value: Gender | undefined) => void;
  setLevel: (value: CompetitionLevel | undefined) => void;
  setCommitteeId: (value: number | undefined) => void;
  setLeagueId: (value: number | undefined) => void;
  setDivision: (value: number | undefined) => void;
  setPoolId: (value: number | undefined) => void;
  setMatchday: (value: number | undefined) => void;
}

const DEFAULT_PAGE_SIZE = 50;

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
  page: intParam,
  size: pageSizeParam,
};

/** Merged into every filter change: a new filter starts again from page 1. */
const FIRST_PAGE = { page: undefined } as const;

/**
 * Owns every filter on the matches list, plus its pagination, in the query
 * string: a filtered list survives a reload and the back button, and can be
 * shared as a link.
 *
 * **Changing any filter resets to page 1**, in the same URL update, so a caller
 * must not also reset on change. Page size defaults to 50.
 *
 * The competition filters cascade top-down — level, then committee or league,
 * then division, pool and matchday — and choosing one clears everything below
 * it, whose options depended on it.
 *
 * @returns the current filter values, their setters, and pagination state
 */
export function useMatchesFilterState() {
  const { state, update } = useUrlState(CODECS);

  const filters: MatchesFilterState = {
    search: state.q ?? "",
    dateFilter: state.date ?? "",
    category: state.category,
    gender: state.gender,
    level: state.level,
    committeeId: state.committee,
    leagueId: state.league,
    division: state.division,
    poolId: state.pool,
    matchday: state.matchday,
    currentPage: state.page ?? 1,
    pageSize: state.size ?? DEFAULT_PAGE_SIZE,
  };

  const setters: MatchesFilterSetters = useMemo(
    () => ({
      setSearch: (value) => update({ q: value, ...FIRST_PAGE }),
      setDateFilter: (value) => update({ date: value, ...FIRST_PAGE }),
      setCategory: (value) => update({ category: value, ...FIRST_PAGE }),
      setGender: (value) => update({ gender: value, ...FIRST_PAGE }),
      setLevel: (value) =>
        update({
          level: value,
          committee: undefined,
          league: undefined,
          division: undefined,
          pool: undefined,
          matchday: undefined,
          ...FIRST_PAGE,
        }),
      setCommitteeId: (value) =>
        update({
          committee: value,
          division: undefined,
          pool: undefined,
          matchday: undefined,
          ...FIRST_PAGE,
        }),
      setLeagueId: (value) =>
        update({
          league: value,
          division: undefined,
          pool: undefined,
          matchday: undefined,
          ...FIRST_PAGE,
        }),
      setDivision: (value) =>
        update({
          division: value,
          pool: undefined,
          matchday: undefined,
          ...FIRST_PAGE,
        }),
      setPoolId: (value) =>
        update({ pool: value, matchday: undefined, ...FIRST_PAGE }),
      setMatchday: (value) => update({ matchday: value, ...FIRST_PAGE }),
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
        date: undefined,
        category: undefined,
        gender: undefined,
        level: undefined,
        committee: undefined,
        league: undefined,
        division: undefined,
        pool: undefined,
        matchday: undefined,
        ...FIRST_PAGE,
      }),
    [update],
  );

  return { filters, setters, setCurrentPage, setPageSize, resetFilters };
}
