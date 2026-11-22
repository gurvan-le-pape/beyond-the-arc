// src/frontend/features/organizations/clubs/components/map/clubs-map/useMapData.ts
import { useMemo } from "react";

import {
  useDepartmentsGeoJson,
  useRegionsGeoJson,
} from "@/features/geography/api";
import type { GeoJsonData } from "@/features/geography/types";
import { useCommittees } from "@/features/organizations/committees/api";
import type { Committee } from "@/features/organizations/committees/types";
import { useLeagues } from "@/features/organizations/leagues/api";
import type { League } from "@/features/organizations/leagues/types";

import { useAllClubs } from "../../../api";
import type { ClubBasic } from "../../../types/ClubBasic";

export interface UseMapDataReturn {
  /** The leagues, one per region, each with its club count. */
  regions: League[];
  /** The committees, one per department, each with its club count. */
  departments: Committee[];
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
  /**
   * Re-runs every query that failed, and only those. Resolves once they have
   * all settled, which is what drives the retry button's pending state.
   */
  retry: () => Promise<unknown>;
}

/**
 * Fetches everything the map shows: leagues for the regions, committees for
 * the departments, every club, and the GeoJSON boundaries. Each league and
 * committee carries its own `clubCount`, which the region and department
 * labels show.
 *
 * @param initialRegions - the server-fetched leagues, the leagues query's
 *   initial data
 * @param initialDepartments - the server-fetched committees, the committees
 *   query's initial data
 * @param initialClubs - the server-fetched clubs, the clubs query's initial data
 * @returns the data, the boundaries (`null` until loaded), the message key of
 *   a failed load (regions first, boundaries last), and a retry of the failed
 *   loads
 */
export function useMapData(
  initialRegions: League[],
  initialDepartments: Committee[],
  initialClubs: ClubBasic[],
): UseMapDataReturn {
  const regionsQuery = useLeagues({ initialData: initialRegions });
  const { data: regions = initialRegions, error: regionsError } = regionsQuery;

  const departmentsQuery = useCommittees(undefined, {
    initialData: initialDepartments,
  });
  const { data: allDepartments = [], error: departmentsError } =
    departmentsQuery;

  // Fetch all clubs
  const clubsQuery = useAllClubs({ initialData: initialClubs });
  const { data: allClubs = [], error: clubsError } = clubsQuery;

  // Fetch GeoJSON data
  const regionsGeoJsonQuery = useRegionsGeoJson();
  const { data: regionsGeoJson = null, error: regionsGeoJsonError } =
    regionsGeoJsonQuery;
  const departmentsGeoJsonQuery = useDepartmentsGeoJson();
  const { data: departmentsGeoJson = null, error: departmentsGeoJsonError } =
    departmentsGeoJsonQuery;

  const queries = [
    regionsQuery,
    departmentsQuery,
    clubsQuery,
    regionsGeoJsonQuery,
    departmentsGeoJsonQuery,
  ];
  const retry = () =>
    Promise.all(
      queries.filter((query) => query.isError).map((query) => query.refetch()),
    );

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

  return {
    regions,
    departments: allDepartments,
    clubs: allClubs,
    regionsGeoJson,
    departmentsGeoJson,
    error,
    retry,
  };
}
