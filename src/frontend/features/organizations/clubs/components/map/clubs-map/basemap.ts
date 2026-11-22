// src/frontend/features/organizations/clubs/components/map/clubs-map/basemap.ts
import type { MapColours } from "./useMapColours";

// The OpenStreetMap tiles are drawn light. In the dark themes they are
// inverted (brightness-min above brightness-max flips light and dark) and
// their hues turned back half a circle, so water stays blue and land stays
// green under a dark sea of grey; high contrast drops the colour entirely.
const BASEMAP_PAINT = {
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
