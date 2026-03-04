// src/frontend/features/organizations/clubs/components/map/layers/RegionsLayer.tsx
"use client";

import { Layer, Source } from "react-map-gl/maplibre";

import { MAP_COLORS } from "@/features/organizations/clubs/constants";

interface RegionsLayerProps {
  geoJson: any;
  labels?: any;
}

export function RegionsLayer({ geoJson, labels }: RegionsLayerProps) {
  return (
    <>
      <Source id="regions" type="geojson" data={geoJson}>
        <Layer
          id="regions-fill"
          type="fill"
          paint={{
            "fill-color": MAP_COLORS.REGIONS.FILL,
            "fill-opacity": MAP_COLORS.REGIONS.FILL_OPACITY,
          }}
        />
        <Layer
          id="regions-outline"
          type="line"
          paint={{
            "line-color": MAP_COLORS.REGIONS.BORDER,
            "line-width": MAP_COLORS.REGIONS.BORDER_WIDTH,
          }}
        />
      </Source>

      {labels && labels.features.length > 0 && (
        <Source id="region-labels" type="geojson" data={labels}>
          <Layer
            id="region-labels-circle"
            type="circle"
            paint={{
              "circle-radius": MAP_COLORS.REGIONS.LABEL_CIRCLE_RADIUS,
              "circle-color": "#ffffff",
              "circle-stroke-width": 2,
              "circle-stroke-color": MAP_COLORS.REGIONS.BORDER,
              "circle-opacity": 0.9,
            }}
          />
          <Layer
            id="region-labels-text"
            type="symbol"
            layout={{
              "text-field": ["get", "clubCount"],
              "text-size": MAP_COLORS.REGIONS.LABEL_TEXT_SIZE,
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            }}
            paint={{
              "text-color": MAP_COLORS.REGIONS.BORDER,
            }}
          />
        </Source>
      )}
    </>
  );
}
