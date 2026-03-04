// src/frontend/features/organizations/clubs/hooks/useClubsNavigation.tsx
"use client";

import { useCallback, useEffect, useState } from "react";

import { ViewLevel } from "@/shared/constants";

import { clubsService } from "../api";

interface ClubsNavigationState {
  viewLevel: ViewLevel;
  selectedLeague: any | null;
  selectedCommittee: any | null;
  data: any[];
  isLoading: boolean;
  error: string | null;
}

export function useClubsNavigation() {
  const [state, setState] = useState<ClubsNavigationState>({
    viewLevel: ViewLevel.REGION,
    selectedLeague: null,
    selectedCommittee: null,
    data: [],
    isLoading: true,
    error: null,
  });

  // Generic load function
  const loadData = useCallback(
    async (
      loader: () => Promise<any[]>,
      updates: Partial<ClubsNavigationState>,
    ) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const data = await loader();
        setState((prev) => ({ ...prev, ...updates, data, isLoading: false }));
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          error: err.message,
          isLoading: false,
        }));
      }
    },
    [],
  );

  // Navigation actions
  const navigateToRegions = useCallback(() => {
    void loadData(() => clubsService.getStatsByRegion(), {
      viewLevel: ViewLevel.REGION,
      selectedLeague: null,
      selectedCommittee: null,
    });
  }, [loadData]);

  const navigateToDepartments = useCallback(
    (league: any) => {
      void loadData(() => clubsService.getStatsByDepartment(league.id), {
        viewLevel: ViewLevel.DEPARTMENT,
        selectedLeague: league,
        selectedCommittee: null,
      });
    },
    [loadData],
  );

  const navigateToClubs = useCallback(
    (committee: any) => {
      void loadData(() => clubsService.getAll({ committeeId: committee.id }), {
        viewLevel: ViewLevel.CLUBS,
        selectedCommittee: committee,
      });
    },
    [loadData],
  );

  // Load initial regions on mount
  useEffect(() => {
    navigateToRegions();
  }, [navigateToRegions]);

  return {
    ...state,
    navigateToRegions,
    navigateToDepartments,
    navigateToClubs,
  };
}
