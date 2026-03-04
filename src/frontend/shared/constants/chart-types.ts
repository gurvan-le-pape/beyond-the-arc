// src/frontend/shared/constants/chart-types.ts
export const ChartType = {
  SCATTER: "scatter",
  HOTSPOTS: "hotspots",
  HEATMAP: "heatmap",
} as const;

export const CHART_TYPE_LIST = Object.values(ChartType);
export type ChartType = (typeof CHART_TYPE_LIST)[number];
