// src/frontend/features/organizations/clubs/components/map/clubs-map/zoom-layers/layerStyle.ts

// Area layer sizes and opacities. The colours come from the theme, through
// useMapColours.
export const AREA_STYLE = {
  REGIONS: {
    FILL_OPACITY: 0.25,
    BORDER_WIDTH: 2,
    LABEL_CIRCLE_RADIUS: 20,
    LABEL_TEXT_SIZE: 14,
  },
  DEPARTMENTS: {
    FILL_OPACITY: 0.25,
    BORDER_WIDTH: 2,
    LABEL_CIRCLE_RADIUS: 18,
    LABEL_TEXT_SIZE: 12,
  },
} as const;

/** The point counts at which a cluster bubble steps up to its next size. */
export const CLUSTER_THRESHOLDS = [10, 30] as const;

// Clustering configuration
export const CLUSTER_CONFIG = {
  MAX_ZOOM: 14,
  RADIUS: 50,
} as const;
