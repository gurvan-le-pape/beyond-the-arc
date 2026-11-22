// src/frontend/features/organizations/clubs/components/map/clubs-map/mapConstants.ts

// Zoom level thresholds for layer visibility
export const ZOOM_THRESHOLDS = {
  DEPARTMENTS: 6.5, // Below this: show regions
  CLUBS: 8.5, // Above this: show clubs with clustering
} as const;

/**
 * The club markers' sizes, in pixels: a cluster bubble grows through
 * `CLUSTER_SIZES` with its point count, a single club is a dot of
 * `POINT_RADIUS`. The club layer draws them, and the popup offsets itself by
 * them so it clears the marker underneath.
 */
export const CLUB_MARKER = {
  CLUSTER_SIZES: [15, 20, 25] as const,
  POINT_RADIUS: 6,
} as const;
