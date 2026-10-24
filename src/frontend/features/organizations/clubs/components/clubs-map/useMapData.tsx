// src/frontend/features/organizations/clubs/components/clubs-map/useMapData.tsx
import { useMemo } from "react";

import {
  useDepartmentsGeoJson,
  useRegionsGeoJson,
} from "@/features/geography/api";
import type { GeoJsonData } from "@/features/geography/types";

import {
  useAllClubs,
  useClubStatsByDepartment,
  useClubStatsByRegion,
} from "../../api";
import type { ClubBasic } from "../../types/ClubBasic";
import type { ClubStatsByDepartment } from "../../types/ClubStatsByDepartment";
import type { ClubStatsByRegion } from "../../types/ClubStatsByRegion";

interface UseMapDataReturn {
  regions: ClubStatsByRegion[];
  departments: ClubStatsByDepartment[];
  clubs: ClubBasic[];
  regionsGeoJson: GeoJsonData | null;
  departmentsGeoJson: GeoJsonData | null;
  /** Message key in the `clubs` namespace, or null when everything loaded. */
  error:
    | "errorLoadingRegions"
    | "errorLoadingDepartments"
    | "errorLoadingClubs"
    | "errorLoadingBoundaries"
    | null;
  getRegionClubCount: (regionId: number) => number;
  getDepartmentClubCount: (departmentId: string | number) => number;
}

/**
 * Custom hook to fetch and manage all map-related data.
 * Fetches: regions, departments, clubs, and GeoJSON boundaries.
 * Provides: club counting helpers for regions and departments.
 */
export function useMapData(
  initialRegions: ClubStatsByRegion[],
  initialDepartments: ClubStatsByDepartment[],
  initialClubs: ClubBasic[],
): UseMapDataReturn {
  // Fetch regions
  const { data: regions = initialRegions, error: regionsError } =
    useClubStatsByRegion({ initialData: initialRegions });

  // Fetch all departments
  const { data: allDepartments = [], error: departmentsError } =
    useClubStatsByDepartment({ initialData: initialDepartments });

  // Fetch all clubs
  const { data: allClubs = [], error: clubsError } = useAllClubs({
    initialData: initialClubs,
  });

  // Fetch GeoJSON data
  const { data: regionsGeoJson = null, error: regionsGeoJsonError } =
    useRegionsGeoJson();
  const { data: departmentsGeoJson = null, error: departmentsGeoJsonError } =
    useDepartmentsGeoJson();

  const error = useMemo(() => {
    if (regionsError) return "errorLoadingRegions";
    if (departmentsError) return "errorLoadingDepartments";
    if (clubsError) return "errorLoadingClubs";
    // Boundaries last: without them the map renders, but with no shapes at
    // all — which looks like an empty country rather than a failed load.
    if (regionsGeoJsonError || departmentsGeoJsonError)
      return "errorLoadingBoundaries";
    return null;
  }, [
    regionsError,
    departmentsError,
    clubsError,
    regionsGeoJsonError,
    departmentsGeoJsonError,
  ]);

  /**
   * Get club count for a specific region
   * Aggregates clubs across all departments in the region
   */
  const getRegionClubCount = useMemo(() => {
    if (allDepartments.length === 0 || allClubs.length === 0) {
      return (_regionId: number) => 0;
    }

    const countsByRegion = new Map<number, number>();

    allDepartments.forEach((dept) => {
      const leagueId = dept.leagueId;
      if (!leagueId) return;

      const clubsInDept = allClubs.filter(
        (club) => club.committeeId === dept.id,
      );

      countsByRegion.set(
        leagueId,
        (countsByRegion.get(leagueId) ?? 0) + clubsInDept.length,
      );
    });

    return (regionId: number) => countsByRegion.get(regionId) ?? 0;
  }, [allDepartments, allClubs]);

  /**
   * Get club count for a specific department
   */
  const getDepartmentClubCount = useMemo(() => {
    if (allClubs.length === 0) {
      return (_departmentId: string | number) => 0;
    }

    const countsByDept = new Map<string | number, number>();

    allClubs.forEach((club) => {
      const deptId = club.committeeId;
      if (!deptId) return;
      countsByDept.set(deptId, (countsByDept.get(deptId) ?? 0) + 1);
    });

    return (departmentId: string | number) =>
      countsByDept.get(departmentId) ?? 0;
  }, [allClubs]);

  return {
    regions,
    departments: allDepartments,
    clubs: allClubs,
    regionsGeoJson,
    departmentsGeoJson,
    error,
    getRegionClubCount,
    getDepartmentClubCount,
  };
}
