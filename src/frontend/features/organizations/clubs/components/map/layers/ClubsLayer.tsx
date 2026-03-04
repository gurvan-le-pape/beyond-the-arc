// src/frontend/features/organizations/clubs/components/map/layers/ClubsLayer.tsx
"use client";

import { Layer, Source } from "react-map-gl/maplibre";

import {
  CLUSTER_CONFIG,
  MAP_COLORS,
} from "@/features/organizations/clubs/constants";

interface ClubsLayerProps {
  geoJson: any;
}

export function ClubsLayer({ geoJson }: ClubsLayerProps) {
  return (
    <Source
      id="clubs"
      type="geojson"
      data={geoJson}
      cluster={true}
      clusterMaxZoom={CLUSTER_CONFIG.MAX_ZOOM}
      clusterRadius={CLUSTER_CONFIG.RADIUS}
    >
      {/* Cluster circles */}
      <Layer
        id="clusters"
        type="circle"
        filter={["has", "point_count"]}
        paint={{
          "circle-color": [
            "step",
            ["get", "point_count"],
            MAP_COLORS.CLUBS.CLUSTER_COLORS[0],
            MAP_COLORS.CLUBS.CLUSTER_THRESHOLDS[0],
            MAP_COLORS.CLUBS.CLUSTER_COLORS[1],
            MAP_COLORS.CLUBS.CLUSTER_THRESHOLDS[1],
            MAP_COLORS.CLUBS.CLUSTER_COLORS[2],
          ],
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
          "circle-stroke-color": "#ffffff",
        }}
      />

      {/* Cluster count labels */}
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
          "text-color": "#ffffff",
        }}
      />

      {/* Individual club points */}
      <Layer
        id="clubs-point"
        type="circle"
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-radius": MAP_COLORS.CLUBS.POINT_RADIUS,
          "circle-color": MAP_COLORS.CLUBS.POINT_COLOR,
          "circle-stroke-width": 2,
          "circle-stroke-color": "white",
        }}
      />
    </Source>
  );
}
