// src/frontend/features/charts/utils/shotSummary.ts
import type { ShotEvent } from "@/shared/types";

import { ShotFilter } from "../constants";
import type { ZoneStats } from "../types";

/** How many shots were taken and made, for the chart's text description. */
export interface ShotSummary {
  readonly total: number;
  readonly made: number;
  readonly missed: number;
  /** Made over total, rounded to a whole percent; 0 with no shots. */
  readonly percent: number;
}

/**
 * The totals a screen reader is told in place of the chart's colours.
 *
 * @param shots - the shots on the chart
 * @returns taken, made, missed and the rounded percentage
 */
export function summarizeShots(shots: readonly ShotEvent[]): ShotSummary {
  const total = shots.length;
  const made = shots.filter((shot) => shot.made).length;
  return {
    total,
    made,
    missed: total - made,
    percent: total > 0 ? Math.round((made / total) * 100) : 0,
  };
}

/**
 * The highest count in any heatmap cell for the shots the filter shows: the
 * top of the colour scale.
 *
 * @param bins - the heatmap grid
 * @param filter - made, missed or all shots
 * @returns the highest count, never below 1 so the scale never divides by 0
 */
export function maxCellValue(
  bins: readonly (readonly ZoneStats[])[],
  filter: ShotFilter,
): number {
  let key: keyof ZoneStats = "total";
  if (filter === ShotFilter.MADE) key = "made";
  else if (filter === ShotFilter.MISSED) key = "missed";

  let max = 1;
  for (const row of bins)
    for (const cell of row) max = Math.max(max, cell[key]);
  return max;
}
