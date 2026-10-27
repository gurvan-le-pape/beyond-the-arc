// src/frontend/features/organizations/clubs/components/clubs-map/MapLibreClubsMap.tsx
"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import type { GeoJSONSource } from "maplibre-gl";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import {
  Map as MapGL,
  type MapLayerMouseEvent,
  Popup,
} from "react-map-gl/maplibre";

import { normalizeDepartmentCode } from "@/features/organizations/utils";
import { ErrorMessage } from "@/shared/components/feedback";
import { logger } from "@/shared/utils";

import type { ClubBasic } from "../../types/ClubBasic";
import type { ClubStatsByDepartment } from "../../types/ClubStatsByDepartment";
import type { ClubStatsByRegion } from "../../types/ClubStatsByRegion";
import { ClubGroupPopupContent } from "./ClubGroupPopupContent";
import { ClubPopupContent } from "./ClubPopupContent";
import { ClubsLayer } from "./layers/ClubsLayer";
import { DepartmentsLayer } from "./layers/DepartmentsLayer";
import { RegionsLayer } from "./layers/RegionsLayer";
import {
  BASEMAP_PAINT,
  GEOJSON_TO_DB_REGION_CODE,
  INITIAL_VIEW,
  MAP_COLORS,
  ZOOM_THRESHOLDS,
} from "./mapConstants";
import { clubsToGeoJSON, generateLabelFeatures, pointKey } from "./mapHelpers";
import { SidePanel } from "./side-panel";
import { useMapColours } from "./useMapColours";
import { useMapData } from "./useMapData";
import { useSearch } from "./useSearch";

interface MapLibreClubsMapProps {
  readonly initialRegions: ClubStatsByRegion[];
  readonly initialDepartments: ClubStatsByDepartment[];
  readonly initialClubs: ClubBasic[];
}

/**
 * Main map component for displaying basketball clubs across France
 * Features:
 * - Zoom-based layer switching (regions → departments → clubs)
 * - Club clustering at high zoom levels
 * - Search and filter functionality via side panel
 * - Interactive popups with club details
 */
export function MapLibreClubsMap({
  initialRegions,
  initialDepartments,
  initialClubs,
}: MapLibreClubsMapProps) {
  const t = useTranslations("clubs");
  // The clubs whose popup is open: one, or several sharing exact coordinates.
  const [selectedClubs, setSelectedClubs] = useState<ClubBasic[]>([]);
  const [viewState, setViewState] = useState(INITIAL_VIEW);

  const {
    regions,
    departments,
    clubs,
    regionsGeoJson,
    departmentsGeoJson,
    getRegionClubCount,
    getDepartmentClubCount,
    error,
    retry,
  } = useMapData(initialRegions, initialDepartments, initialClubs);

  // Determine which layers to show based on zoom level
  const zoom = viewState.zoom;
  const showRegions = zoom < ZOOM_THRESHOLDS.DEPARTMENTS;
  const showDepartments =
    zoom >= ZOOM_THRESHOLDS.DEPARTMENTS && zoom < ZOOM_THRESHOLDS.CLUBS;
  const showClubs = zoom >= ZOOM_THRESHOLDS.CLUBS;

  const {
    query,
    setQuery,
    results: displayClubs,
    clearSearch,
  } = useSearch(clubs);

  // Handle club marker click - zoom and show popup
  const handleClubClick = useCallback((club: ClubBasic) => {
    if (club.latitude && club.longitude) {
      setViewState((prev) => ({
        ...prev,
        longitude: club.longitude!,
        latitude: club.latitude!,
        zoom: 12,
      }));
      setTimeout(() => setSelectedClubs([club]), 300);
    }
  }, []);

  // Map style configuration
  const colours = useMapColours();
  const basemapTheme = colours?.theme ?? "light";
  const mapStyle = useMemo(
    () => ({
      version: 8 as const,
      sources: {
        osm: {
          type: "raster" as const,
          tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: "osm",
          type: "raster" as const,
          source: "osm",
          paint: BASEMAP_PAINT[basemapTheme],
        },
      ],
    }),
    [basemapTheme],
  );

  // Generate region labels with club counts
  const regionLabels = useMemo(() => {
    if (!showRegions || !regionsGeoJson) return null;

    return generateLabelFeatures(regionsGeoJson.features, (properties) => {
      const geoJsonCode = properties.code;
      const dbRegionCode = GEOJSON_TO_DB_REGION_CODE[geoJsonCode];
      const region = regions.find((r) => r.code === dbRegionCode);
      return region ? getRegionClubCount(region.id) : 0;
    });
  }, [regionsGeoJson, regions, getRegionClubCount, showRegions]);

  // Generate department labels with club counts
  const departmentLabels = useMemo(() => {
    if (!showDepartments || !departmentsGeoJson) return null;

    return generateLabelFeatures(departmentsGeoJson.features, (properties) => {
      const geoJsonCode = properties.code;
      const normalizedGeoCode = normalizeDepartmentCode(geoJsonCode);

      const dept = departments.find((d) => {
        const dbCode = d.department?.code;
        if (!dbCode) return false;
        return normalizeDepartmentCode(dbCode) === normalizedGeoCode;
      });

      return dept ? getDepartmentClubCount(dept.id) : 0;
    });
  }, [
    departmentsGeoJson,
    departments,
    getDepartmentClubCount,
    showDepartments,
  ]);

  // A club's department, through the committee it belongs to: the popup's
  // second line. Departments come already loaded for the department layer.
  const departmentNameByCommittee = useMemo(
    () => new Map(departments.map((d) => [d.id, d.department.name])),
    [departments],
  );

  // Clubs on the map grouped by exact coordinates. Many were geocoded to their
  // town's centre and share one point no zoom level separates, so a click on
  // that point has to offer all of them.
  const clubsByPoint = useMemo(() => {
    const groups = new Map<string, ClubBasic[]>();
    for (const club of displayClubs) {
      if (club.latitude === null || club.longitude === null) continue;
      const key = pointKey(club);
      groups.set(key, [...(groups.get(key) ?? []), club]);
    }
    return groups;
  }, [displayClubs]);

  // Generate club points for clustering
  const clubPoints = useMemo(() => {
    if (!showClubs) return null;
    return clubsToGeoJSON(displayClubs);
  }, [displayClubs, showClubs]);

  // A cluster whose clubs all share one point never splits, so it opens their
  // list; any other cluster zooms in until it does. MapLibre 5 answers both
  // queries with a Promise and takes no callback.
  const openOrExpandCluster = useCallback(
    async (
      source: GeoJSONSource,
      clusterId: number,
      pointCount: number,
      longitude: number,
      latitude: number,
    ) => {
      const leaves = await source.getClusterLeaves(clusterId, pointCount, 0);
      const leafIds = new Set(leaves.map((leaf) => leaf.properties?.id));
      const leafClubs = clubs.filter((c) => leafIds.has(c.id));
      const keys = new Set(leafClubs.map(pointKey));
      if (keys.size === 1) {
        setSelectedClubs(leafClubs);
        return;
      }
      const zoom = await source.getClusterExpansionZoom(clusterId);
      setViewState((prev) => ({
        ...prev,
        longitude,
        latitude,
        zoom: zoom + 0.5,
      }));
    },
    [clubs],
  );

  // Handle map clicks (cluster expansion and club selection)
  const onClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (f?.source !== "clubs" || f.geometry.type !== "Point") return;
      const [longitude, latitude] = f.geometry.coordinates;

      if (f.properties.cluster) {
        const source = e.target.getSource<GeoJSONSource>("clubs");
        if (!source) return;
        openOrExpandCluster(
          source,
          f.properties.cluster_id,
          f.properties.point_count,
          longitude,
          latitude,
        ).catch((error: unknown) => logger.error(error, "cluster click"));
      } else {
        // Feature coordinates come back tile-quantised, so the group is
        // looked up from the club's own coordinates rather than the click's.
        const club = clubs.find((c) => c.id === f.properties.id);
        if (club) setSelectedClubs(clubsByPoint.get(pointKey(club)) ?? [club]);
      }
    },
    [clubs, clubsByPoint, openOrExpandCluster],
  );

  // Error state
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center surface-subtle">
        <ErrorMessage
          message={t(error)}
          onRetry={retry}
          className="text-center"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <MapGL
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapStyle={mapStyle}
        // MapLibre labels its own canvas `role="region"` with the untranslated
        // string "Map"; `locale` patches that table, so the region is named for
        // what it shows and is named in the reader's language.
        locale={{ "Map.Title": t("map.mapAriaLabel") }}
        interactiveLayerIds={showClubs ? ["clubs-point", "clusters"] : []}
        onClick={onClick}
        style={{ width: "100%", height: "100%" }}
      >
        {colours && showRegions && regionsGeoJson && (
          <RegionsLayer
            geoJson={regionsGeoJson}
            labels={regionLabels}
            colours={colours}
          />
        )}

        {colours && showDepartments && departmentsGeoJson && (
          <DepartmentsLayer
            geoJson={departmentsGeoJson}
            labels={departmentLabels}
            colours={colours}
          />
        )}

        {colours && clubPoints && (
          <ClubsLayer geoJson={clubPoints} colours={colours} />
        )}

        {selectedClubs.length > 0 && (
          <Popup
            longitude={selectedClubs[0].longitude!}
            latitude={selectedClubs[0].latitude!}
            onClose={() => setSelectedClubs([])}
            // The card brings its own close button and width; MapLibre's
            // default caps every popup at 240px.
            closeButton={false}
            maxWidth="320px"
            // Clear the marker underneath: a shared point is usually drawn as
            // a cluster bubble, a single club as a dot.
            offset={
              selectedClubs.length > 1
                ? MAP_COLORS.CLUBS.CLUSTER_SIZES[2] + 4
                : MAP_COLORS.CLUBS.POINT_RADIUS + 4
            }
          >
            {selectedClubs.length === 1 ? (
              <ClubPopupContent
                club={selectedClubs[0]}
                departmentName={
                  departmentNameByCommittee.get(selectedClubs[0].committeeId) ??
                  null
                }
                onClose={() => setSelectedClubs([])}
              />
            ) : (
              <ClubGroupPopupContent
                clubs={selectedClubs}
                departmentName={
                  departmentNameByCommittee.get(selectedClubs[0].committeeId) ??
                  null
                }
                onClose={() => setSelectedClubs([])}
              />
            )}
          </Popup>
        )}
      </MapGL>

      <SidePanel
        clubs={displayClubs}
        onClubClick={handleClubClick}
        query={query}
        onQueryChange={setQuery}
        onClearSearch={clearSearch}
      />
    </div>
  );
}
