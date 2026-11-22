// src/frontend/features/organizations/clubs/components/map/clubs-map/ZoomLayers.tsx
import { useMemo } from "react";

import type { ClubBasic } from "../../../types/ClubBasic";
import { ClubsLayer } from "./layers/ClubsLayer";
import { DepartmentsLayer } from "./layers/DepartmentsLayer";
import { RegionsLayer } from "./layers/RegionsLayer";
import { ZOOM_THRESHOLDS } from "./mapConstants";
import { clubsToGeoJSON } from "./mapHelpers";
import { useAreaLabels } from "./useAreaLabels";
import type { MapColours } from "./useMapColours";
import type { UseMapDataReturn } from "./useMapData";

interface ZoomLayersProps {
  /** The map's current zoom, which picks the layer. */
  readonly zoom: number;
  /** The areas with their club counts, and their boundaries. */
  readonly data: Pick<
    UseMapDataReturn,
    "regions" | "departments" | "regionsGeoJson" | "departmentsGeoJson"
  >;
  /** The clubs the search leaves on the map. */
  readonly displayClubs: ClubBasic[];
  /** The theme's colours; null until they have been read off the document. */
  readonly colours: MapColours | null;
}

/**
 * The one data layer the zoom calls for: the regions with their club counts
 * below the department threshold, the departments with theirs up to the club
 * threshold, the clustered clubs above it. Nothing until the theme's colours
 * are known, and an area layer waits for its boundaries to load.
 */
export function ZoomLayers({
  zoom,
  data,
  displayClubs,
  colours,
}: ZoomLayersProps) {
  const showRegions = zoom < ZOOM_THRESHOLDS.DEPARTMENTS;
  const showDepartments =
    zoom >= ZOOM_THRESHOLDS.DEPARTMENTS && zoom < ZOOM_THRESHOLDS.CLUBS;
  const showClubs = zoom >= ZOOM_THRESHOLDS.CLUBS;

  const { regionsGeoJson, departmentsGeoJson } = data;
  const { regionLabels, departmentLabels } = useAreaLabels({
    ...data,
    showRegions,
    showDepartments,
  });

  const clubPoints = useMemo(
    () => (showClubs ? clubsToGeoJSON(displayClubs) : null),
    [displayClubs, showClubs],
  );

  if (!colours) return null;

  return (
    <>
      {showRegions && regionsGeoJson && (
        <RegionsLayer
          geoJson={regionsGeoJson}
          labels={regionLabels}
          colours={colours}
        />
      )}

      {showDepartments && departmentsGeoJson && (
        <DepartmentsLayer
          geoJson={departmentsGeoJson}
          labels={departmentLabels}
          colours={colours}
        />
      )}

      {clubPoints && <ClubsLayer geoJson={clubPoints} colours={colours} />}
    </>
  );
}
