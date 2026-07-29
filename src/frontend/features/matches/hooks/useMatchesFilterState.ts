// src/frontend/features/matches/hooks/useMatchesFilterState.ts
"use client";

import { useCallback, useEffect, useState } from "react";

import { useCommitteeLeagueClubFilters } from "@/features/organizations/hooks";
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";
import { usePaginationState } from "@/shared/hooks";

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

export function useMatchesFilterState() {
  const {
    committeeId,
    setCommitteeId,
    leagueId,
    setLeagueId,
    resetFilters: resetLocationFilters,
  } = useCommitteeLeagueClubFilters();

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [level, setLevel] = useState<CompetitionLevel | undefined>(undefined);
  const [division, setDivision] = useState<number | undefined>(undefined);
  const [poolId, setPoolId] = useState<number | undefined>(undefined);
  const [matchday, setMatchday] = useState<number | undefined>(undefined);
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    resetToFirstPage,
  } = usePaginationState(50);

  useEffect(() => {
    resetToFirstPage();
  }, [
    level,
    committeeId,
    leagueId,
    division,
    poolId,
    matchday,
    category,
    gender,
    search,
    dateFilter,
    resetToFirstPage,
  ]);

  const handleSetLevel = useCallback(
    (value: CompetitionLevel | undefined) => {
      setLevel(value);
      setCommitteeId(undefined);
      setLeagueId(undefined);
      setDivision(undefined);
      setPoolId(undefined);
      setMatchday(undefined);
    },
    [setCommitteeId, setLeagueId],
  );

  const handleSetCommitteeId = useCallback(
    (value: number | undefined) => {
      setCommitteeId(value);
      setDivision(undefined);
      setPoolId(undefined);
      setMatchday(undefined);
    },
    [setCommitteeId],
  );

  const handleSetLeagueId = useCallback(
    (value: number | undefined) => {
      setLeagueId(value);
      setDivision(undefined);
      setPoolId(undefined);
      setMatchday(undefined);
    },
    [setLeagueId],
  );

  const handleSetDivision = useCallback((value: number | undefined) => {
    setDivision(value);
    setPoolId(undefined);
    setMatchday(undefined);
  }, []);

  const handleSetPoolId = useCallback((value: number | undefined) => {
    setPoolId(value);
    setMatchday(undefined);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setDateFilter("");
    setCategory(undefined);
    setGender(undefined);
    setLevel(undefined);
    setDivision(undefined);
    setPoolId(undefined);
    setMatchday(undefined);
    setCurrentPage(1);
    resetLocationFilters();
  }, [resetLocationFilters, setCurrentPage]);

  const filters: MatchesFilterState = {
    search,
    dateFilter,
    category,
    gender,
    level,
    committeeId,
    leagueId,
    division,
    poolId,
    matchday,
    currentPage,
    pageSize,
  };

  const setters: MatchesFilterSetters = {
    setSearch,
    setDateFilter,
    setCategory,
    setGender,
    setLevel: handleSetLevel,
    setCommitteeId: handleSetCommitteeId,
    setLeagueId: handleSetLeagueId,
    setDivision: handleSetDivision,
    setPoolId: handleSetPoolId,
    setMatchday,
  };

  return { filters, setters, setCurrentPage, setPageSize, resetFilters };
}
