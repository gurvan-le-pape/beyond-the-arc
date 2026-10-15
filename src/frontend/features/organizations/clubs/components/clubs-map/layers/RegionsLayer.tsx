// src/frontend/features/organizations/clubs/components/clubs-map/layers/RegionsLayer.tsx
"use client";

import { Layer, Source } from "react-map-gl/maplibre";

import { MAP_COLORS } from "../mapConstants";
import type { MapColours } from "../useMapColours";

interface RegionsLayerProps {
  readonly geoJson: any;
  readonly labels?: any;
  readonly colours: MapColours;
}

/**
 * The region polygons and their club counts.
 *
 * Visible only at low zoom — the departments layer replaces it as you zoom in,
 * so the two are mutually exclusive rather than stacked. `labels` carries the
 * centroids the counts are anchored to, computed once outside the render.
 */
export function RegionsLayer({ geoJson, labels, colours }: RegionsLayerProps) {
  const area = colours.regions;
  return (
    <>
      <Source id="regions" type="geojson" data={geoJson}>
        <Layer
          id="regions-fill"
          type="fill"
          paint={{
            "fill-color": area.fill,
            "fill-opacity": MAP_COLORS.REGIONS.FILL_OPACITY,
          }}
        />
        <Layer
          id="regions-outline"
          type="line"
          paint={{
            "line-color": area.border,
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
              "circle-color": colours.labelBackground,
              "circle-stroke-width": 2,
              "circle-stroke-color": area.border,
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
              "text-color": area.label,
            }}
          />
        </Source>
      )}
    </>
  );
}
