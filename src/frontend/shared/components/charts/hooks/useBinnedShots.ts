// src/frontend/shared/components/charts/hooks/useBinnedShots.ts
import { useMemo } from "react";

import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import type { ShotEvent } from "@/shared/types/ShotEvent";

export function useBinnedShots(
  matchEvents: MatchEvent[],
  rows: number,
  cols: number,
  cellWidth: number,
  cellHeight: number,
): {
  bins: { made: number; missed: number; total: number }[][];
  shotEvents: ShotEvent[];
} {
  return useMemo(() => {
    const bins = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ made: 0, missed: 0, total: 0 })),
    );
    const shotEvents: ShotEvent[] = [];

    matchEvents.forEach((matchEvent) => {
      const { shotLocation, eventType } = matchEvent;
      if (!shotLocation) return;

      const et = eventType.toLowerCase();
      const made = et.includes("made")
        ? true
        : et.includes("missed")
        ? false
        : null;

      if (made === null) return;

      shotEvents.push({ x: shotLocation.x, y: shotLocation.y, made });

      const col = Math.min(Math.floor(shotLocation.x / cellWidth), cols - 1);
      const row = Math.min(Math.floor(shotLocation.y / cellHeight), rows - 1);

      if (row < 0 || row >= rows || col < 0 || col >= cols) return;

      if (made) {
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

export default useBinnedShots;
