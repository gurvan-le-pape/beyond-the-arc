// src/frontend/features/shot-chart/constants/colorScales.ts

/**
 * The one colour scale of the heatmap and hotspots charts: yellow for few
 * shots, dark red for many. It is fixed rather than a reader's choice: a chart
 * is read, not configured, and one scale means one legend to learn.
 */
export { interpolateYlOrRd as SHOT_COLOR_SCALE } from "d3-scale-chromatic";
