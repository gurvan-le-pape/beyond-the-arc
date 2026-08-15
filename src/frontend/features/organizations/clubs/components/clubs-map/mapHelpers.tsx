// src/frontend/features/organizations/clubs/components/clubs-map/mapHelpers.tsx
import centroid from "@turf/centroid";

import type { ClubBasic } from "../../types/ClubBasic";

/**
 * Generate label features with club counts from GeoJSON features
 * Only includes features with non-zero club counts
 */
export function generateLabelFeatures(
  features: any[],
  getClubCount: (properties: any) => number,
): any {
  const labelFeatures = features
    .map((feature: any) => {
      const clubCount = getClubCount(feature.properties);

      if (clubCount === 0) return null;

      try {
        const center = centroid(feature);
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center.geometry.coordinates,
          },
          properties: {
            name: feature.properties.nom || feature.properties.code,
            clubCount,
          },
        };
      } catch (error) {
        console.warn("Failed to calculate centroid for feature:", error);
        return null;
      }
    })
    .filter(Boolean);

  return {
    type: "FeatureCollection",
    features: labelFeatures,
  };
}

/**
 * Convert club data to GeoJSON point features for map display
 */
export function clubsToGeoJSON(clubs: ClubBasic[]): any {
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
        type: "Feature",
        geometry: {
          type: "Point",
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
