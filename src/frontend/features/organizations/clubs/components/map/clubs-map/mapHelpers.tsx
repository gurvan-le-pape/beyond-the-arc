// src/frontend/features/organizations/clubs/components/map/clubs-map/mapHelpers.tsx
import centroid from "@turf/centroid";
import type { FeatureCollection, Point } from "geojson";

import type {
  BoundaryProperties,
  GeoJsonData,
} from "@/features/geography/types";
import { logger } from "@/shared/utils";

import type { ClubBasic } from "../../../types/ClubBasic";
import { BASEMAP_PAINT } from "./mapConstants";
import type { MapColours } from "./useMapColours";

/**
 * One point per boundary with clubs in it, at the boundary's centroid,
 * carrying the count the layer prints there. Boundaries with no clubs get no
 * point, so no "0" is drawn.
 *
 * @param features - the region or department boundaries
 * @param getClubCount - the club count for one boundary
 * @returns the label points, as a source for a symbol layer
 */
export function generateLabelFeatures(
  features: GeoJsonData["features"],
  getClubCount: (properties: BoundaryProperties) => number,
): FeatureCollection<Point, { name: string; clubCount: number }> {
  return {
    type: "FeatureCollection",
    features: features.flatMap((feature) => {
      const clubCount = getClubCount(feature.properties);
      if (clubCount === 0) return [];

      try {
        const center = centroid(feature);
        return [
          {
            type: "Feature" as const,
            geometry: center.geometry,
            properties: {
              name: feature.properties.nom || feature.properties.code,
              clubCount,
            },
          },
        ];
      } catch (error) {
        logger.warn("Failed to calculate centroid for feature:", error);
        return [];
      }
    }),
  };
}

/**
 * A key equal for two clubs exactly when they sit on the same coordinates.
 *
 * @param club - a club with coordinates; one without gets the key `null,null`
 * @returns the club's longitude and latitude, joined
 */
export function pointKey(club: Pick<ClubBasic, "latitude" | "longitude">) {
  return `${club.longitude},${club.latitude}`;
}

/**
 * The clubs as GeoJSON points for the clustered clubs source. Clubs without
 * coordinates are left out.
 *
 * @param clubs - the clubs to place
 * @returns one point per located club, carrying its id and name
 */
export function clubsToGeoJSON(
  clubs: ClubBasic[],
): FeatureCollection<Point, { id: number; name: string }> {
  return {
    type: "FeatureCollection",
    features: clubs
      // Explicitly null-checked rather than truthy: coordinates arrive as JSON
      // numbers, so `0` is falsy, and the Greenwich meridian runs through
      // France. Measured against all 4,368 production clubs — 142 have null
      // coordinates and are correctly dropped, none sits at exactly 0, and the
      // closest is CONLIE B.C. at -0.005115 with three clubs inside 0.01°. So
      // the truthy form has never dropped a real club; it would the first time
      // a re-geocode lands one of those three on 0.000000, silently and with
      // no error anywhere.
      .filter(
        (c): c is ClubBasic & { latitude: number; longitude: number } =>
          c.latitude !== null && c.longitude !== null,
      )
      .map((c) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          // [lng, lat] — GeoJSON's order, which is the reverse of how
          // coordinates are spoken and of `ClubBasic`'s own field order.
          coordinates: [c.longitude, c.latitude],
        },
        properties: {
          id: c.id,
          name: c.name,
        },
      })),
  };
}

/**
 * The map's style: OpenStreetMap's raster tiles as the only basemap layer,
 * repainted for the theme (dimmed and hue-inverted for dark, greyscale for
 * high contrast).
 *
 * @param theme - the active theme
 * @returns a MapLibre style with the one raster source and layer
 */
export function basemapStyle(theme: MapColours["theme"]) {
  return {
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
        paint: BASEMAP_PAINT[theme],
      },
    ],
  };
}
