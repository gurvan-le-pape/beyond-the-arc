// src/frontend/features/matches/components/detail/events/timeline/EventScorePill.tsx
import React from "react";

import { cn } from "@/shared/utils/cn";

interface EventScorePillProps {
  homeScore: number;
  awayScore: number;
  /** True when the scoring event belongs to the home team (drives colour). */
  isHomeTeam: boolean;
}

/**
 * Coloured pill that displays the running score after a scoring event.
 * Blue-tinted when the home team scored, red-tinted when the away team scored.
 */
export function EventScorePill({
  homeScore,
  awayScore,
  isHomeTeam,
}: EventScorePillProps) {
  return (
    <div
      className={cn(
        "px-3 py-1 rounded-button text-body-sm font-bold",
        isHomeTeam
          ? "bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-300"
          : "bg-error-light/20 dark:bg-error-dark/40 text-error-dark dark:text-error-light",
      )}
    >
      {homeScore} - {awayScore}
    </div>
  );
}

export default EventScorePill;
