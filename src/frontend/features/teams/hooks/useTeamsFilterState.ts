// src/frontend/features/teams/hooks/useTeamsFilterState.ts
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
import { enumParam, intParam, pageSizeParam, textParam } from "@/shared/utils";

export interface TeamsFilterState {
  clubId: number | undefined;
  selectedClubName: string;
  number: number | undefined;
  category: Category | undefined;
  gender: Gender | undefined;
  level: CompetitionLevel | undefined;
  committeeId: number | undefined;
  leagueId: number | undefined;
  division: number | undefined;
  pool: string | undefined;
  currentPage: number;
  pageSize: number;
}

export interface TeamsFilterSetters {
  setClubId: (value: number | undefined) => void;
  setSelectedClubName: (value: string) => void;
  setNumber: (value: number | undefined) => void;
  setCategory: (value: Category | undefined) => void;
  setGender: (value: Gender | undefined) => void;
  setLevel: (value: CompetitionLevel | undefined) => void;
  setCommitteeId: (value: number | undefined) => void;
  setLeagueId: (value: number | undefined) => void;
  setDivision: (value: number | undefined) => void;
  setPool: (value: string | undefined) => void;
}

const DEFAULT_PAGE_SIZE = 50;

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
  page: intParam,
  size: pageSizeParam,
};

/** Merged into every filter change: a new filter starts again from page 1. */
const FIRST_PAGE = { page: undefined } as const;

/**
 * Owns every filter on the teams list, plus its pagination, in the query
 * string: a filtered list survives a reload and the back button, and can be
 * shared as a link.
 *
 * **Changing any filter resets to page 1**, in the same URL update, so a caller
 * must not also reset on change. Page size defaults to 50.
 *
 * Cascades: a new level clears the committee, league, division and pool; a new
 * committee or league clears the team number, division and pool; a new
 * division clears the pool.
 *
 * @returns the current filter values, their setters, and pagination state
 */
export function useTeamsFilterState() {
  const { state, update } = useUrlState(CODECS);

  const filters: TeamsFilterState = {
    clubId: state.club,
    selectedClubName: state.clubName ?? "",
    number: state.number,
    category: state.category,
    gender: state.gender,
    level: state.level,
    committeeId: state.committee,
    leagueId: state.league,
    division: state.division,
    pool: state.pool,
    currentPage: state.page ?? 1,
    pageSize: state.size ?? DEFAULT_PAGE_SIZE,
  };

  const setters: TeamsFilterSetters = useMemo(
    () => ({
      setClubId: (value) => update({ club: value, ...FIRST_PAGE }),
      setSelectedClubName: (value) => update({ clubName: value }),
      setNumber: (value) => update({ number: value, ...FIRST_PAGE }),
      setCategory: (value) => update({ category: value, ...FIRST_PAGE }),
      setGender: (value) => update({ gender: value, ...FIRST_PAGE }),
      setLevel: (value) =>
        update({
          level: value,
          committee: undefined,
          league: undefined,
          division: undefined,
          pool: undefined,
          ...FIRST_PAGE,
        }),
      setCommitteeId: (value) =>
        update({
          committee: value,
          number: undefined,
          division: undefined,
          pool: undefined,
          ...FIRST_PAGE,
        }),
      setLeagueId: (value) =>
        update({
          league: value,
          number: undefined,
          division: undefined,
          pool: undefined,
          ...FIRST_PAGE,
        }),
      setDivision: (value) =>
        update({ division: value, pool: undefined, ...FIRST_PAGE }),
      setPool: (value) => update({ pool: value, ...FIRST_PAGE }),
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
        club: undefined,
        clubName: undefined,
        number: undefined,
        category: undefined,
        gender: undefined,
        level: undefined,
        committee: undefined,
        league: undefined,
        division: undefined,
        pool: undefined,
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
