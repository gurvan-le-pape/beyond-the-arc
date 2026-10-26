// src/frontend/features/matches/components/detail/match-events/event-timeline/EventScorePill.tsx

import { cn } from "@/shared/utils";

interface EventScorePillProps {
  readonly homeScore: number;
  readonly awayScore: number;
  /** True when the scoring event belongs to the home team (drives colour). */
  readonly isHomeTeam: boolean;
}

/**
 * Coloured pill that displays the running score after a scoring event, in
 * the tone of the side that scored: the home and away roles, the same pair the
 * team stats comparison uses, so a team keeps one colour across the match tabs.
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
          ? "bg-tint-home text-ink-home"
          : "bg-tint-away text-ink-away",
      )}
    >
      {homeScore}–{awayScore}
    </div>
  );
}

export default EventScorePill;
