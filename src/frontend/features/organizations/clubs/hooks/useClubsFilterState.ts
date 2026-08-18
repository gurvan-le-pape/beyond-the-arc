// src/frontend/features/organizations/clubs/hooks/useClubsFilterState.ts
"use client";

import { useCallback, useEffect, useState } from "react";

import { useLocationFilterState } from "@/features/organizations/hooks";
import { usePaginationState } from "@/shared/hooks";

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

/**
 * Owns the clubs list's filters and pagination.
 *
 * Any filter change resets to page 1, and the location half is delegated to
 * `useLocationFilterState` so the level → committee/league cascade behaves the
 * same here as on the other lists. Page size defaults to 50.
 *
 * @returns the filter values, their setters, and pagination state
 */
export function useClubsFilterState() {
  const {
    committeeId,
    setCommitteeId,
    leagueId,
    setLeagueId,
    resetFilters: resetLocationFilters,
  } = useLocationFilterState();

  const [search, setSearch] = useState("");
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    resetToFirstPage,
  } = usePaginationState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    resetToFirstPage();
  }, [search, leagueId, committeeId, resetToFirstPage]);

  // Committees are offered scoped to the selected league, so a committee
  // chosen under one league is meaningless under another.
  const handleSetLeagueId = useCallback(
    (value: number | undefined) => {
      setLeagueId(value);
      setCommitteeId(undefined);
    },
    [setLeagueId, setCommitteeId],
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setCurrentPage(1);
    resetLocationFilters();
  }, [resetLocationFilters, setCurrentPage]);

  const filters: ClubsFilterState = {
    search,
    leagueId,
    committeeId,
    currentPage,
    pageSize,
  };

  const setters: ClubsFilterSetters = {
    setSearch,
    setLeagueId: handleSetLeagueId,
    setCommitteeId,
  };

  return {
    filters,
    setters,
    setCurrentPage,
    setPageSize,
    resetFilters,
  };
}
