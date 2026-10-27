// src/frontend/features/organizations/clubs/components/map/clubs-map/layers/ClubsLayer.tsx
"use client";

import type { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl/maplibre";

import { CLUSTER_CONFIG, MAP_COLORS } from "../mapConstants";
import type { MapColours } from "../useMapColours";

interface ClubsLayerProps {
  readonly geoJson: FeatureCollection;
  readonly colours: MapColours;
}

/**
 * The club points, clustered by MapLibre rather than by React.
 *
 * Clustering, colour steps and radii are declared as **MapLibre paint
 * expressions** and evaluated on the GPU — one `Source` for thousands of clubs
 * instead of a marker component each, which is what keeps panning smooth.
 *
 * `geoJson` must keep a stable identity between renders; a fresh object forces
 * MapLibre to re-diff the whole source.
 */
export function ClubsLayer({ geoJson, colours }: ClubsLayerProps) {
  return (
    <Source
      id="clubs"
      type="geojson"
      data={geoJson}
      cluster={true}
      clusterMaxZoom={CLUSTER_CONFIG.MAX_ZOOM}
      clusterRadius={CLUSTER_CONFIG.RADIUS}
    >
      <Layer
        id="clusters"
        type="circle"
        filter={["has", "point_count"]}
        paint={{
          "circle-color": colours.clubs.fill,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            MAP_COLORS.CLUBS.CLUSTER_SIZES[0],
            MAP_COLORS.CLUBS.CLUSTER_THRESHOLDS[0],
            MAP_COLORS.CLUBS.CLUSTER_SIZES[1],
            MAP_COLORS.CLUBS.CLUSTER_THRESHOLDS[1],
            MAP_COLORS.CLUBS.CLUSTER_SIZES[2],
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": colours.labelBackground,
        }}
      />

      <Layer
        id="cluster-count"
        type="symbol"
        filter={["has", "point_count"]}
        layout={{
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
        }}
        paint={{
          "text-color": colours.clubs.text,
        }}
      />

      <Layer
        id="clubs-point"
        type="circle"
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-radius": MAP_COLORS.CLUBS.POINT_RADIUS,
          "circle-color": colours.clubs.fill,
          "circle-stroke-width": 2,
          "circle-stroke-color": colours.labelBackground,
        }}
      />
    </Source>
  );
}
