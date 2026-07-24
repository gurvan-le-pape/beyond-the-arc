// src/frontend/features/organizations/clubs/components/clubs-map/ClubsMap.tsx
"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Map as MapGL, Popup } from "react-map-gl/maplibre";

import { normalizeDepartmentCode } from "@/shared/utils";

import type { ClubBasic } from "../../types/ClubBasic";
import type { ClubStatsByDepartment } from "../../types/ClubStatsByDepartment";
import type { ClubStatsByRegion } from "../../types/ClubStatsByRegion";
import { ClubPopupContent } from "./ClubPopupContent";
import { ClubsLayer } from "./layers/ClubsLayer";
import { DepartmentsLayer } from "./layers/DepartmentsLayer";
import { RegionsLayer } from "./layers/RegionsLayer";
import {
  GEOJSON_TO_DB_REGION_CODE,
  INITIAL_VIEW,
  ZOOM_THRESHOLDS,
} from "./mapConstants";
import { clubsToGeoJSON, generateLabelFeatures } from "./mapHelpers";
import { SidePanel } from "./side-panel";
import { useFilters } from "./useFilters";
import { useMapData } from "./useMapData";
import { useSearch } from "./useSearch";

interface ClubsMapProps {
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
export function ClubsMap({
  initialRegions,
  initialDepartments,
  initialClubs,
}: ClubsMapProps) {
  const t = useTranslations("clubs");
  const [selectedClub, setSelectedClub] = useState<ClubBasic | null>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW);
  const [isPending, startTransition] = useTransition();

  const {
    regions,
    departments,
    clubs,
    regionsGeoJson,
    departmentsGeoJson,
    getRegionClubCount,
    getDepartmentClubCount,
    error,
  } = useMapData(initialRegions, initialDepartments, initialClubs);

  // Determine which layers to show based on zoom level
  const zoom = viewState.zoom;
  const showRegions = zoom < ZOOM_THRESHOLDS.DEPARTMENTS;
  const showDepartments =
    zoom >= ZOOM_THRESHOLDS.DEPARTMENTS && zoom < ZOOM_THRESHOLDS.CLUBS;
  const showClubs = zoom >= ZOOM_THRESHOLDS.CLUBS;

  // Search and filter logic
  const { query, setQuery, results, clearSearch } = useSearch(clubs);
  const { filters, toggleFilter, filteredClubs } = useFilters(results);
  const displayClubs = filteredClubs;

  // Wrap filter toggle in transition for better UX
  const handleToggleFilter = useCallback(
    (key: any) => {
      startTransition(() => {
        toggleFilter(key);
      });
    },
    [toggleFilter],
  );

  // Handle club marker click - zoom and show popup
  const handleClubClick = useCallback((club: ClubBasic) => {
    if (club.latitude && club.longitude) {
      setViewState((prev) => ({
        ...prev,
        longitude: club.longitude!,
        latitude: club.latitude!,
        zoom: 12,
      }));
      setTimeout(() => setSelectedClub(club), 300);
    }
  }, []);

  // Map style configuration
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
      layers: [{ id: "osm", type: "raster" as const, source: "osm" }],
    }),
    [],
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

  // Generate club points for clustering
  const clubPoints = useMemo(() => {
    if (!showClubs) return null;
    return clubsToGeoJSON(displayClubs);
  }, [displayClubs, showClubs]);

  // Handle map clicks (cluster expansion and club selection)
  const onClick = useCallback(
    (e: any) => {
      const f = e.features?.[0];
      if (!f) return;

      if (f.source === "clubs") {
        if (f.properties.cluster) {
          // Zoom into cluster
          const clusterId = f.properties.cluster_id;
          const mapRef = e.target;
          const source = mapRef.getSource("clubs");

          source.getClusterExpansionZoom(
            clusterId,
            (err: any, zoom: number) => {
              if (err) return;

              setViewState((prev) => ({
                ...prev,
                longitude: f.geometry.coordinates[0],
                latitude: f.geometry.coordinates[1],
                zoom: zoom + 0.5,
              }));
            },
          );
        } else {
          // Show individual club popup
          const club = clubs.find((c) => c.id === f.properties.id);
          if (club) setSelectedClub(club);
        }
      }
    },
    [clubs],
  );

  // Error state
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center surface-subtle">
        <div className="text-center">
          <p className="text-error font-semibold">{t(error)}</p>
          <button
            type="button"
            onClick={() => globalThis.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-strong text-white rounded-lg hover:bg-primary-bold"
          >
            {t("map.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <MapGL
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapStyle={mapStyle}
        interactiveLayerIds={showClubs ? ["clubs-point", "clusters"] : []}
        onClick={onClick}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Regions Layer */}
        {showRegions && regionsGeoJson && (
          <RegionsLayer geoJson={regionsGeoJson} labels={regionLabels} />
        )}

        {/* Departments Layer */}
        {showDepartments && departmentsGeoJson && (
          <DepartmentsLayer
            geoJson={departmentsGeoJson}
            labels={departmentLabels}
          />
        )}

        {/* Clubs Layer */}
        {clubPoints && <ClubsLayer geoJson={clubPoints} />}

        {/* Club Popup */}
        {selectedClub && (
          <Popup
            longitude={selectedClub.longitude!}
            latitude={selectedClub.latitude!}
            onClose={() => setSelectedClub(null)}
          >
            <ClubPopupContent
              club={selectedClub}
              onClose={() => setSelectedClub(null)}
            />
          </Popup>
        )}
      </MapGL>

      {/* Side Panel */}
      <SidePanel
        clubs={displayClubs}
        filters={filters}
        onToggleFilter={handleToggleFilter}
        onClubClick={handleClubClick}
        query={query}
        onQueryChange={setQuery}
        onClearSearch={clearSearch}
        resultCount={displayClubs.length}
        isPending={isPending}
      />
    </div>
  );
}
