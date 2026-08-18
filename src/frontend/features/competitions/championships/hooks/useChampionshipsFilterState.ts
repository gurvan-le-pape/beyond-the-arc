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

/**
 * Filter state for the national championships tab.
 *
 * Category and gender only — a national championship has no league or committee
 * above it, so there is no scope to filter by and no cascade to reset.
 *
 * @returns the filter values, their setters, and pagination state
 */
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

/**
 * Filter state for the regional championships tab.
 *
 * Adds a league scope on top of the shared category and gender. Changing the
 * league resets to page 1 — the effect depends on the stable setter rather than
 * on the setters object, which would re-run every render.
 *
 * @returns the filter values, their setters, and pagination state
 */
export function useRegionalFilterState() {
  const { filters, setters } = useSharedFilterState();
  const [leagueId, setLeagueId] = useState("");

  // Depend on the setter itself, not on `setters` — that object is a fresh
  // literal every render, so depending on it would reset the page on every
  // render and pin pagination to 1. `setCurrentPage` is a useState setter and
  // therefore stable.
  const { setCurrentPage } = setters;
  useEffect(() => {
    setCurrentPage(1);
  }, [leagueId, setCurrentPage]);

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

/**
 * Filter state for the departmental championships tab.
 *
 * The committee counterpart of the regional hook: same shared category and
 * gender, same page-1 reset on a scope change, scoped by committee instead of
 * league.
 *
 * @returns the filter values, their setters, and pagination state
 */
export function useDepartmentalFilterState() {
  const { filters, setters } = useSharedFilterState();
  const [committeeId, setCommitteeId] = useState("");

  // See useRegionalFilterState: depend on the stable setter, not on `setters`.
  const { setCurrentPage } = setters;
  useEffect(() => {
    setCurrentPage(1);
  }, [committeeId, setCurrentPage]);

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
