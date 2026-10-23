// src/frontend/features/charts/utils/shotSummary.ts
import type { ShotEvent } from "@/shared/types";

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
