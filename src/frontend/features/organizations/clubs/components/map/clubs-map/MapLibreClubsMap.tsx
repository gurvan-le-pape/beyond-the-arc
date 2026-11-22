// src/frontend/features/organizations/clubs/components/map/clubs-map/MapLibreClubsMap.tsx
"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { Map as MapGL } from "react-map-gl/maplibre";

import type { Committee } from "@/features/organizations/committees/types";
import type { League } from "@/features/organizations/leagues/types";
import { ErrorMessage } from "@/shared/components/feedback";

import type { ClubBasic } from "../../../types/ClubBasic";
import { ClubsPopup } from "./clubs-popup";
import { INITIAL_VIEW, ZOOM_THRESHOLDS } from "./mapConstants";
import { basemapStyle } from "./mapHelpers";
import { SidePanel } from "./side-panel";
import { useClubSelection } from "./useClubSelection";
import { useMapColours } from "./useMapColours";
import { useMapData } from "./useMapData";
import { useSearch } from "./useSearch";
import { ZoomLayers } from "./ZoomLayers";

// MapLibre 6 ships its worker as a separate module and no longer finds it on
// its own: without this the basemap still draws, but every GeoJSON source —
// regions, departments, clubs — is parsed in the worker and silently never
// appears. `new URL(…, import.meta.url)` is the form the bundler recognises
// and emits as an asset with a hashed URL.
const MAPLIBRE_WORKER_URL = new URL(
  "maplibre-gl/dist/maplibre-gl-worker.mjs",
  import.meta.url,
).toString();

interface MapLibreClubsMapProps {
  readonly initialRegions: League[];
  readonly initialDepartments: Committee[];
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
  const [viewState, setViewState] = useState(INITIAL_VIEW);

  const data = useMapData(initialRegions, initialDepartments, initialClubs);
  const { departments, clubs, error, retry } = data;

  const showClubs = viewState.zoom >= ZOOM_THRESHOLDS.CLUBS;

  const {
    query,
    setQuery,
    results: displayClubs,
    clearSearch,
  } = useSearch(clubs);

  const moveTo = useCallback(
    (target: { longitude: number; latitude: number; zoom: number }) =>
      setViewState((prev) => ({ ...prev, ...target })),
    [],
  );
  const { selectedClubs, clearSelection, selectFromList, onMapClick } =
    useClubSelection({ clubs, displayClubs, moveTo });

  const colours = useMapColours();
  const basemapTheme = colours?.theme ?? "light";
  const mapStyle = useMemo(() => basemapStyle(basemapTheme), [basemapTheme]);

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
        workerUrl={MAPLIBRE_WORKER_URL}
        // MapLibre labels its own canvas `role="region"` with the untranslated
        // string "Map"; `locale` patches that table, so the region is named for
        // what it shows and is named in the reader's language.
        locale={{ "Map.Title": t("map.mapAriaLabel") }}
        interactiveLayerIds={showClubs ? ["clubs-point", "clusters"] : []}
        onClick={onMapClick}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomLayers
          zoom={viewState.zoom}
          data={data}
          displayClubs={displayClubs}
          colours={colours}
        />

        <ClubsPopup
          clubs={selectedClubs}
          departments={departments}
          onClose={clearSelection}
        />
      </MapGL>

      <SidePanel
        clubs={displayClubs}
        onClubClick={selectFromList}
        query={query}
        onQueryChange={setQuery}
        onClearSearch={clearSearch}
      />
    </div>
  );
}
