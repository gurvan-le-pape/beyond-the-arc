// src/frontend/features/organizations/clubs/hooks/useMapData.tsx
import { useMemo } from "react";
import useSWR from "swr";

import type { ClubBasic } from "../types/ClubBasic";
import type { ClubStatsByDepartment } from "../types/ClubStatsByDepartement";
import type { ClubStatsByRegion } from "../types/ClubStatsByRegion";
import type { GeoJsonData } from "../types/Map";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface UseMapDataReturn {
  regions: ClubStatsByRegion[];
  departments: ClubStatsByDepartment[];
  clubs: ClubBasic[];
  regionsGeoJson: GeoJsonData | null;
  departmentsGeoJson: GeoJsonData | null;
  isLoading: boolean;
  error: string | null;
  getRegionClubCount: (regionId: number) => number;
  getDepartmentClubCount: (departmentId: string | number) => number;
}

/**
 * Custom hook to fetch and manage all map-related data
 * Fetches: regions, departments, clubs, and GeoJSON boundaries
 * Provides: club counting helpers for regions and departments
 */
export function useMapData(
  initialRegions: ClubStatsByRegion[],
): UseMapDataReturn {
  // Fetch regions
  const {
    data: regions = initialRegions,
    error: regionsError,
    isLoading: regionsLoading,
  } = useSWR<ClubStatsByRegion[]>("/api/clubs/regions", fetcher, {
    fallbackData: initialRegions,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Fetch all departments
  const {
    data: allDepartments = [],
    error: departmentsError,
    isLoading: departmentsLoading,
  } = useSWR<ClubStatsByDepartment[]>("/api/clubs/departments", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Fetch all clubs
  const {
    data: allClubs = [],
    error: clubsError,
    isLoading: clubsLoading,
  } = useSWR<ClubBasic[]>("/api/clubs/all", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Fetch GeoJSON data
  const { data: regionsGeoJson = null } = useSWR<GeoJsonData>(
    "/geojson/regions.json",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const { data: departmentsGeoJson = null } = useSWR<GeoJsonData>(
    "/geojson/departments.json",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  // Compute loading state
  const isLoading = regionsLoading || departmentsLoading || clubsLoading;

  // Compute error state
  const error = useMemo(() => {
    if (regionsError) return "Failed to load regions";
    if (departmentsError) return "Failed to load departments";
    if (clubsError) return "Failed to load clubs";
    return null;
  }, [regionsError, departmentsError, clubsError]);

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
        (countsByRegion.get(leagueId) || 0) + clubsInDept.length,
      );
    });

    return (regionId: number) => countsByRegion.get(regionId) || 0;
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

      countsByDept.set(deptId, (countsByDept.get(deptId) || 0) + 1);
    });

    return (departmentId: string | number) =>
      countsByDept.get(departmentId) || 0;
  }, [allClubs]);

  return {
    regions,
    departments: allDepartments,
    clubs: allClubs,
    regionsGeoJson,
    departmentsGeoJson,
    isLoading,
    error,
    getRegionClubCount,
    getDepartmentClubCount,
  };
}
