// src/frontend/features/players/hooks/usePlayersFilterState.ts
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

export interface PlayersFilterState {
  name: string;
  clubId: number | undefined;
  selectedClubName: string;
  category: Category | undefined;
  gender: Gender | undefined;
  number: number | undefined;
  teamNumber: number | undefined;
  level: CompetitionLevel | undefined;
  committeeId: number | undefined;
  leagueId: number | undefined;
  currentPage: number;
  pageSize: number;
}

export interface PlayersFilterSetters {
  setName: (value: string) => void;
  setClubId: (value: number | undefined) => void;
  setSelectedClubName: (value: string) => void;
  setCategory: (value: Category | undefined) => void;
  setGender: (value: Gender | undefined) => void;
  setNumber: (value: number | undefined) => void;
  setTeamNumber: (value: number | undefined) => void;
  setLevel: (value: CompetitionLevel | undefined) => void;
  setCommitteeId: (value: number | undefined) => void;
  setLeagueId: (value: number | undefined) => void;
}

const DEFAULT_PAGE_SIZE = 50;

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
  page: intParam,
  size: pageSizeParam,
};

/** Merged into every filter change: a new filter starts again from page 1. */
const FIRST_PAGE = { page: undefined } as const;

/**
 * Owns every filter on the players list, plus its pagination, in the query
 * string: a filtered list survives a reload and the back button, and can be
 * shared as a link.
 *
 * **Changing any filter resets to page 1**, in the same URL update, so a caller
 * must not also reset on change. Page size defaults to 50.
 *
 * The cascades are the same as on every list: a new level clears the committee
 * and the league; a new committee or league clears the two number filters,
 * whose options depend on it.
 *
 * @returns the current filter values, their setters, and pagination state
 */
export function usePlayersFilterState() {
  const { state, update } = useUrlState(CODECS);

  const filters: PlayersFilterState = {
    name: state.q ?? "",
    clubId: state.club,
    selectedClubName: state.clubName ?? "",
    category: state.category,
    gender: state.gender,
    number: state.number,
    teamNumber: state.teamNumber,
    level: state.level,
    committeeId: state.committee,
    leagueId: state.league,
    currentPage: state.page ?? 1,
    pageSize: state.size ?? DEFAULT_PAGE_SIZE,
  };

  const setters: PlayersFilterSetters = useMemo(
    () => ({
      setName: (value) => update({ q: value, ...FIRST_PAGE }),
      setClubId: (value) => update({ club: value, ...FIRST_PAGE }),
      setSelectedClubName: (value) => update({ clubName: value }),
      setCategory: (value) => update({ category: value, ...FIRST_PAGE }),
      setGender: (value) => update({ gender: value, ...FIRST_PAGE }),
      setNumber: (value) => update({ number: value, ...FIRST_PAGE }),
      setTeamNumber: (value) => update({ teamNumber: value, ...FIRST_PAGE }),
      setLevel: (value) =>
        update({
          level: value,
          committee: undefined,
          league: undefined,
          ...FIRST_PAGE,
        }),
      setCommitteeId: (value) =>
        update({
          committee: value,
          number: undefined,
          teamNumber: undefined,
          ...FIRST_PAGE,
        }),
      setLeagueId: (value) =>
        update({
          league: value,
          number: undefined,
          teamNumber: undefined,
          ...FIRST_PAGE,
        }),
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
        club: undefined,
        clubName: undefined,
        category: undefined,
        gender: undefined,
        number: undefined,
        teamNumber: undefined,
        level: undefined,
        committee: undefined,
        league: undefined,
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
