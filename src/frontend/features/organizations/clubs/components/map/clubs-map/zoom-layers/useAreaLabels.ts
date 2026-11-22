// src/frontend/features/organizations/clubs/components/map/clubs-map/zoom-layers/useAreaLabels.ts
import { useMemo } from "react";

import type { GeoJsonData } from "@/features/geography/types";
import type { Committee } from "@/features/organizations/committees/types";
import type { League } from "@/features/organizations/leagues/types";
import { normalizeDepartmentCode } from "@/features/organizations/utils";

import { generateLabelFeatures } from "./layerSources";

interface AreaLabelsInput {
  readonly regions: League[];
  readonly departments: Committee[];
  readonly regionsGeoJson: GeoJsonData | null;
  readonly departmentsGeoJson: GeoJsonData | null;
  /** Whether the zoom shows the regions layer. */
  readonly showRegions: boolean;
  /** Whether the zoom shows the departments layer. */
  readonly showDepartments: boolean;
}

// Mapping from GeoJSON region codes to database region codes
const GEOJSON_TO_DB_REGION_CODE: Record<string, string> = {
  "11": "IDF",
  "24": "CVL",
  "27": "BFC",
  "28": "NOR",
  "32": "HDF",
  "44": "GES",
  "52": "PDL",
  "53": "BRE",
  "75": "NAQ",
  "76": "OCC",
  "84": "ARA",
  "93": "PCA",
  "94": "COR",
};

/**
 * The club-count labels of the regions and of the departments, one point per
 * boundary. Each set is `null` while its layer is hidden or its boundaries
 * have not loaded, so only the layer on screen is computed.
 *
 * A region boundary is matched to its league through the GeoJSON-to-database
 * region code table; a department boundary to its committee by department
 * code, normalised on both sides. A boundary with no match is labelled 0.
 *
 * @param root0 - the leagues and committees with their club counts, the two
 *   boundary sets, and which of the two layers the zoom shows
 * @returns the region labels and the department labels
 */
export function useAreaLabels({
  regions,
  departments,
  regionsGeoJson,
  departmentsGeoJson,
  showRegions,
  showDepartments,
}: AreaLabelsInput) {
  const regionLabels = useMemo(() => {
    if (!showRegions || !regionsGeoJson) return null;

    return generateLabelFeatures(regionsGeoJson.features, (properties) => {
      const dbRegionCode = GEOJSON_TO_DB_REGION_CODE[properties.code];
      const region = regions.find((r) => r.region.code === dbRegionCode);
      return region?.clubCount ?? 0;
    });
  }, [regionsGeoJson, regions, showRegions]);

  const departmentLabels = useMemo(() => {
    if (!showDepartments || !departmentsGeoJson) return null;

    return generateLabelFeatures(departmentsGeoJson.features, (properties) => {
      const geoCode = normalizeDepartmentCode(properties.code);
      const department = departments.find(
        (d) => normalizeDepartmentCode(d.department.code) === geoCode,
      );
      return department?.clubCount ?? 0;
    });
  }, [departmentsGeoJson, departments, showDepartments]);

  return { regionLabels, departmentLabels };
}
