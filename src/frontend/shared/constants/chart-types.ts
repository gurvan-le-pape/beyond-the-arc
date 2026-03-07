// src/frontend/shared/constants/chart-types.ts
export const ChartType = {
  SCATTER: "scatter",
  HOTSPOTS: "hotspots",
  HEATMAP: "heatmap",
} as const;

export const CHART_TYPE_LIST = Object.values(ChartType);
export type ChartType = (typeof CHART_TYPE_LIST)[number];

export const ShotFilter = {
  ALL: "all",
  MADE: "made",
  MISSED: "missed",
} as const;

export const SHOT_FILTER_LIST = Object.values(ShotFilter);
export type ShotFilter = (typeof SHOT_FILTER_LIST)[number];
