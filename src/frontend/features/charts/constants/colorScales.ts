// src/frontend/features/charts/constants/colorScales.ts
import { interpolateYlOrRd } from "d3-scale-chromatic";

/**
 * The one colour scale of the heatmap and hotspots charts: yellow for few
 * shots, dark red for many. It is fixed rather than a reader's choice: a chart
 * is read, not configured, and one scale means one legend to learn.
 */
export const SHOT_COLOR_SCALE = interpolateYlOrRd;
