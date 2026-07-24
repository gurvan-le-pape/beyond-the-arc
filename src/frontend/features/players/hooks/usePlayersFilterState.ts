// src/frontend/features/players/hooks/usePlayersFilterState.ts
"use client";

import { useCallback, useEffect, useState } from "react";

import { useCommitteeLeagueClubFilters } from "@/features/competitions/championships/hooks";
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";
import { usePaginationState } from "@/shared/hooks";

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

export function usePlayersFilterState() {
  const {
    committeeId,
    setCommitteeId,
    leagueId,
    setLeagueId,
    resetFilters: resetLocationFilters,
  } = useCommitteeLeagueClubFilters();

  const [name, setName] = useState("");
  const [number, setNumber] = useState<number | undefined>(undefined);
  const [teamNumber, setTeamNumber] = useState<number | undefined>(undefined);
  const [clubId, setClubId] = useState<number | undefined>(undefined);
  const [selectedClubName, setSelectedClubName] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [level, setLevel] = useState<CompetitionLevel | undefined>(undefined);
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
    name,
    number,
    teamNumber,
    clubId,
    category,
    gender,
    resetToFirstPage,
  ]);

  const handleSetLevel = useCallback(
    (value: CompetitionLevel | undefined) => {
      setLevel(value);
      setCommitteeId(undefined);
      setLeagueId(undefined);
    },
    [setCommitteeId, setLeagueId],
  );

  const handleSetCommitteeId = useCallback(
    (value: number | undefined) => {
      setCommitteeId(value);
      setNumber(undefined);
      setTeamNumber(undefined);
    },
    [setCommitteeId],
  );

  const handleSetLeagueId = useCallback(
    (value: number | undefined) => {
      setLeagueId(value);
      setNumber(undefined);
      setTeamNumber(undefined);
    },
    [setLeagueId],
  );

  const resetFilters = useCallback(() => {
    setName("");
    setNumber(undefined);
    setTeamNumber(undefined);
    setClubId(undefined);
    setSelectedClubName("");
    setCategory(undefined);
    setGender(undefined);
    setLevel(undefined);
    setCurrentPage(1);
    resetLocationFilters();
  }, [resetLocationFilters, setCurrentPage]);

  const filters: PlayersFilterState = {
    name,
    clubId,
    selectedClubName,
    category,
    gender,
    number,
    teamNumber,
    level,
    committeeId,
    leagueId,
    currentPage,
    pageSize,
  };

  const setters: PlayersFilterSetters = {
    setName,
    setClubId,
    setSelectedClubName,
    setCategory,
    setGender,
    setNumber,
    setTeamNumber,
    setLevel: handleSetLevel,
    setCommitteeId: handleSetCommitteeId,
    setLeagueId: handleSetLeagueId,
  };

  return {
    filters,
    setters,
    setCurrentPage,
    setPageSize,
    resetFilters,
  };
}
