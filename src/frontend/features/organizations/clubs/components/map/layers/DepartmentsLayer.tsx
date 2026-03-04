// src/frontend/features/organizations/clubs/components/map/layers/DepartmentsLayer.tsx
"use client";

import { Layer, Source } from "react-map-gl/maplibre";

import { MAP_COLORS } from "@/features/organizations/clubs/constants";

interface DepartmentsLayerProps {
  geoJson: any;
  labels?: any;
}

export function DepartmentsLayer({ geoJson, labels }: DepartmentsLayerProps) {
  return (
    <>
      <Source id="departments" type="geojson" data={geoJson}>
        <Layer
          id="departments-fill"
          type="fill"
          paint={{
            "fill-color": MAP_COLORS.DEPARTMENTS.FILL,
            "fill-opacity": MAP_COLORS.DEPARTMENTS.FILL_OPACITY,
          }}
        />
        <Layer
          id="departments-outline"
          type="line"
          paint={{
            "line-color": MAP_COLORS.DEPARTMENTS.BORDER,
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
              "circle-color": "#ffffff",
              "circle-stroke-width": 2,
              "circle-stroke-color": MAP_COLORS.DEPARTMENTS.BORDER,
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
              "text-color": MAP_COLORS.DEPARTMENTS.BORDER,
            }}
          />
        </Source>
      )}
    </>
  );
}
