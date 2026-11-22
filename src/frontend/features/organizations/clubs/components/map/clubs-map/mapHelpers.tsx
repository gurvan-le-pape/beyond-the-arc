// src/frontend/features/organizations/clubs/components/map/clubs-map/mapHelpers.tsx
import type { ClubBasic } from "../../../types/ClubBasic";
import { BASEMAP_PAINT } from "./mapConstants";
import type { MapColours } from "./useMapColours";

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
