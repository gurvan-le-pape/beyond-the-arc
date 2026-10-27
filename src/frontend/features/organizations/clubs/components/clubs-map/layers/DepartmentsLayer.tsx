// src/frontend/features/organizations/clubs/components/clubs-map/layers/DepartmentsLayer.tsx
"use client";

import type { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl/maplibre";

import { MAP_COLORS } from "../mapConstants";
import type { MapColours } from "../useMapColours";

interface DepartmentsLayerProps {
  readonly geoJson: FeatureCollection;
  readonly labels: FeatureCollection | null;
  readonly colours: MapColours;
}

/**
 * The department polygons and their club counts.
 *
 * The zoomed-in counterpart of the regions layer; the two swap at a zoom
 * threshold rather than both drawing. `labels` carries the centroids the counts
 * are anchored to, computed once outside the render.
 */
export function DepartmentsLayer({
  geoJson,
  labels,
  colours,
}: DepartmentsLayerProps) {
  const area = colours.departments;
  return (
    <>
      <Source id="departments" type="geojson" data={geoJson}>
        <Layer
          id="departments-fill"
          type="fill"
          paint={{
            "fill-color": area.fill,
            "fill-opacity": MAP_COLORS.DEPARTMENTS.FILL_OPACITY,
          }}
        />
        <Layer
          id="departments-outline"
          type="line"
          paint={{
            "line-color": area.border,
            "line-width": MAP_COLORS.DEPARTMENTS.BORDER_WIDTH,
          }}
        />
      </Source>

      {labels && labels.features.length > 0 && (
        <Source id="department-labels" type="geojson" data={labels}>
          <Layer
            id="department-labels-circle"
            type="circle"
            paint={{
              "circle-radius": MAP_COLORS.DEPARTMENTS.LABEL_CIRCLE_RADIUS,
              "circle-color": colours.labelBackground,
              "circle-stroke-width": 2,
              "circle-stroke-color": area.border,
              "circle-opacity": 0.9,
            }}
          />
          <Layer
            id="department-labels-text"
            type="symbol"
            layout={{
              "text-field": ["get", "clubCount"],
              "text-size": MAP_COLORS.DEPARTMENTS.LABEL_TEXT_SIZE,
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
