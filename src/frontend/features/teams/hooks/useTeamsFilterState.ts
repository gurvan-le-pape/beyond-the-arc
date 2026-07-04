// src/frontend/features/teams/hooks/useTeamsFilterState.ts
"use client";

import { useCallback, useEffect, useState } from "react";

import { useCommitteeLeagueClubFilters } from "@/features/competitions/championships/hooks";
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";
import { usePaginationState } from "@/shared/hooks";

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

export function useTeamsFilterState() {
  const {
    committeeId,
    setCommitteeId,
    leagueId,
    setLeagueId,
    resetFilters: resetLocationFilters,
  } = useCommitteeLeagueClubFilters();

  const [clubId, setClubId] = useState<number | undefined>(undefined);
  const [selectedClubName, setSelectedClubName] = useState("");
  const [number, setNumber] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [level, setLevel] = useState<CompetitionLevel | undefined>(undefined);
  const [division, setDivision] = useState<number | undefined>(undefined);
  const [pool, setPool] = useState<string | undefined>(undefined);
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
    clubId,
    number,
    category,
    gender,
    level,
    committeeId,
    leagueId,
    division,
    pool,
    resetToFirstPage,
  ]);

  const handleSetLevel = useCallback(
    (value: CompetitionLevel | undefined) => {
      setLevel(value);
      setCommitteeId(undefined);
      setLeagueId(undefined);
      setDivision(undefined);
      setPool(undefined);
    },
    [setCommitteeId, setLeagueId],
  );

  const handleSetCommitteeId = useCallback(
    (value: number | undefined) => {
      setCommitteeId(value);
      setNumber(undefined);
      setDivision(undefined);
      setPool(undefined);
    },
    [setCommitteeId],
  );

  const handleSetLeagueId = useCallback(
    (value: number | undefined) => {
      setLeagueId(value);
      setNumber(undefined);
      setDivision(undefined);
      setPool(undefined);
    },
    [setLeagueId],
  );

  const handleSetDivision = useCallback((value: number | undefined) => {
    setDivision(value);
    setPool(undefined);
  }, []);

  const resetFilters = useCallback(() => {
    setClubId(undefined);
    setSelectedClubName("");
    setNumber(undefined);
    setCategory(undefined);
    setGender(undefined);
    setLevel(undefined);
    setDivision(undefined);
    setPool(undefined);
    setCurrentPage(1);
    resetLocationFilters();
  }, [resetLocationFilters]);

  const filters: TeamsFilterState = {
    clubId,
    selectedClubName,
    number,
    category,
    gender,
    level,
    committeeId,
    leagueId,
    division,
    pool,
    currentPage,
    pageSize,
  };

  const setters: TeamsFilterSetters = {
    setClubId,
    setSelectedClubName,
    setNumber,
    setCategory,
    setGender,
    setLevel: handleSetLevel,
    setCommitteeId: handleSetCommitteeId,
    setLeagueId: handleSetLeagueId,
    setDivision: handleSetDivision,
    setPool,
  };

  return {
    filters,
    setters,
    setCurrentPage,
    setPageSize,
    resetFilters,
  };
}
