// src/frontend/shared/hooks/charts/useBinnedShots.ts
import { useMemo } from "react";

import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import { transformToShotEvents } from "@/features/players/utils";
import type { ZoneStats } from "@/shared/types/charts/ZoneStats";
import type { ShotEvent } from "@/shared/types/ShotEvent";

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
