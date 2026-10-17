// src/frontend/features/matches/components/detail/match-events/event-timeline/EventScorePill.tsx

import { cn } from "@/shared/utils";

interface EventScorePillProps {
  readonly homeScore: number;
  readonly awayScore: number;
  /** True when the scoring event belongs to the home team (drives colour). */
  readonly isHomeTeam: boolean;
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
        "px-3 py-1 rounded-button text-sm font-bold",
        isHomeTeam
          ? "bg-tint-primary text-ink-primary"
          : "bg-tint-error text-ink-error",
      )}
    >
      {homeScore} - {awayScore}
    </div>
  );
}

export default EventScorePill;
