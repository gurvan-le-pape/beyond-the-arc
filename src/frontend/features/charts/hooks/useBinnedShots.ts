// src/frontend/features/charts/hooks/useBinnedShots.ts
import { useMemo } from "react";

import type { MatchEvent } from "@/features/matches/types";
import { transformToShotEvents } from "@/features/players/utils";
import type { ShotEvent } from "@/shared/types";

import type { ZoneStats } from "../types";

/**
 * Bins shot events into a `rows`×`cols` grid and derives the shot events, in
 * one memo.
 *
 * Shots with negative coordinates are dropped; a shot past the last cell is
 * clamped into it rather than dropped, so the grid's edges absorb the
 * overshoot.
 *
 * @returns the shots bucketed into the heatmap grid, memoised so the overlay is not rebuilt on unrelated renders
 *
 * @param matchEvents - every event; non-shots and negative coordinates are dropped
 * @param rows - grid rows across the half court
 * @param cols - grid columns across the half court
 * @param cellWidth - one cell's width in court units
 * @param cellHeight - one cell's height in court units
 */
export function useBinnedShots(
  matchEvents: MatchEvent[],
  rows: number,
  cols: number,
  cellWidth: number,
  cellHeight: number,
): {
  bins: ZoneStats[][];
  shotEvents: ShotEvent[];
} {
  return useMemo(() => {
    const bins = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ made: 0, missed: 0, total: 0 })),
    );
    const shotEvents = transformToShotEvents(matchEvents ?? []);

    shotEvents.forEach((shotEvent) => {
      const col = Math.min(Math.floor(shotEvent.x / cellWidth), cols - 1);
      const row = Math.min(Math.floor(shotEvent.y / cellHeight), rows - 1);

      if (row < 0 || row >= rows || col < 0 || col >= cols) return;

      if (shotEvent.made) {
        bins[row][col].made += 1;
        bins[row][col].total += 1;
      } else {
        bins[row][col].missed += 1;
        bins[row][col].total += 1;
      }
    });

    return { bins, shotEvents };
  }, [matchEvents, rows, cols, cellWidth, cellHeight]);
}
