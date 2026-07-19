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
      .filter((c) => c.latitude && c.longitude)
      .map((c) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [c.longitude!, c.latitude!],
        },
        properties: {
          id: c.id,
          name: c.name,
        },
      })),
  };
}
