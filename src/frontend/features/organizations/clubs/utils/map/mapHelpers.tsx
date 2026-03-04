// src/frontend/features/organizations/clubs/utils/map/mapHelpers.tsx
import centroid from "@turf/centroid";

import type { ClubBasic } from "../../types/ClubBasic";

/**
 * Normalize department code by removing leading zeros
 * Example: "01" -> "1", "2A" -> "2A"
 */
export function normalizeDepartmentCode(code: string): string {
  return code.replace(/^0+/, "");
}

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
