// src/frontend/features/competitions/championships/hooks/useChampionshipsFilterState.ts
"use client";

import { useEffect, useState } from "react";

import type { Category, Gender } from "@/shared/constants";
import { usePaginationState } from "@/shared/hooks";

function useSharedFilterState() {
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    resetToFirstPage,
  } = usePaginationState(20);

  useEffect(() => {
    resetToFirstPage();
  }, [category, gender, pageSize, resetToFirstPage]);

  return {
    filters: { category, gender, currentPage, pageSize },
    setters: { setCategory, setGender, setCurrentPage, setPageSize },
  };
}

export function useNationalFilterState() {
  const { filters, setters } = useSharedFilterState();

  const resetFilters = () => {
    setters.setCategory(undefined);
    setters.setGender(undefined);
  };

  return {
    filters,
    setters,
    setCurrentPage: setters.setCurrentPage,
    setPageSize: setters.setPageSize,
    resetFilters,
  };
}

export function useRegionalFilterState() {
  const { filters, setters } = useSharedFilterState();
  const [leagueId, setLeagueId] = useState("");

  useEffect(() => {
    setters.setCurrentPage(1);
  }, [leagueId]);

  const resetFilters = () => {
    setLeagueId("");
    setters.setCategory(undefined);
    setters.setGender(undefined);
  };

  return {
    filters: { ...filters, leagueId },
    setters: { ...setters, setLeagueId },
    setCurrentPage: setters.setCurrentPage,
    setPageSize: setters.setPageSize,
    resetFilters,
  };
}

export function useDepartmentalFilterState() {
  const { filters, setters } = useSharedFilterState();
  const [committeeId, setCommitteeId] = useState("");

  useEffect(() => {
    setters.setCurrentPage(1);
  }, [committeeId]);

  const resetFilters = () => {
    setCommitteeId("");
    setters.setCategory(undefined);
    setters.setGender(undefined);
  };

  return {
    filters: { ...filters, committeeId },
    setters: { ...setters, setCommitteeId },
    setCurrentPage: setters.setCurrentPage,
    setPageSize: setters.setPageSize,
    resetFilters,
  };
}
