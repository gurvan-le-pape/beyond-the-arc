// src/frontend/features/geography/types/GeoJson.ts
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";

/** What each boundary feature in `public/geojson/*.json` carries. */
export interface BoundaryProperties {
  /** INSEE code: `"11"` for a region, `"2A"` or `"75"` for a department. */
  code: string;
  /** Name in French, e.g. `"Île-de-France"`. */
  nom: string;
}

/**
 * A boundary asset: the regions or the departments of metropolitan France.
 * Both files hold only polygons and multipolygons.
 */
export type GeoJsonData = FeatureCollection<
  Polygon | MultiPolygon,
  BoundaryProperties
>;
