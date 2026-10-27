// src/frontend/features/organizations/clubs/components/map/clubs-map/mapConstants.ts

/**
 * Map configuration constants
 */

// Mapping from GeoJSON region codes to database region codes
export const GEOJSON_TO_DB_REGION_CODE: Record<string, string> = {
  "11": "IDF",
  "24": "CVL",
  "27": "BFC",
  "28": "NOR",
  "32": "HDF",
  "44": "GES",
  "52": "PDL",
  "53": "BRE",
  "75": "NAQ",
  "76": "OCC",
  "84": "ARA",
  "93": "PCA",
  "94": "COR",
};

// Initial map view centered on France
export const INITIAL_VIEW = {
  longitude: 2.5,
  latitude: 46.8,
  zoom: 5.8,
  pitch: 0,
  bearing: 0,
};

// Zoom level thresholds for layer visibility
export const ZOOM_THRESHOLDS = {
  DEPARTMENTS: 6.5, // Below this: show regions
  CLUBS: 8.5, // Above this: show clubs with clustering
} as const;

// Map layer sizes and opacities. The colours come from the theme, through
// useMapColours.
export const MAP_COLORS = {
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
  CLUBS: {
    CLUSTER_THRESHOLDS: [10, 30] as const,
    CLUSTER_SIZES: [15, 20, 25] as const,
    POINT_RADIUS: 6,
  },
} as const;

// The OpenStreetMap tiles are drawn light. In the dark themes they are
// inverted (brightness-min above brightness-max flips light and dark) and
// their hues turned back half a circle, so water stays blue and land stays
// green under a dark sea of grey; high contrast drops the colour entirely.
export const BASEMAP_PAINT = {
  light: {},
  dark: {
    "raster-brightness-min": 0.9,
    "raster-brightness-max": 0.1,
    "raster-hue-rotate": 180,
    "raster-saturation": -0.4,
  },
  "high-contrast": {
    "raster-brightness-min": 1,
    "raster-brightness-max": 0,
    "raster-saturation": -1,
  },
} as const;

// Clustering configuration
export const CLUSTER_CONFIG = {
  MAX_ZOOM: 14,
  RADIUS: 50,
} as const;
