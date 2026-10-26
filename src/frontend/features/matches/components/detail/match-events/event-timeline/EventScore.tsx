// src/frontend/features/matches/components/detail/match-events/event-timeline/EventScore.tsx

import { cn } from "@/shared/utils";

interface EventScoreProps {
  readonly homeScore: number;
  readonly awayScore: number;
  /** The side whose basket this score follows; its number is set in its tone. */
  readonly scoredBy: "home" | "away";
}

/**
 * The match score right after a basket, home first, with the scoring side's
 * number in bold and in its home or away tone, so a column of scores shows
 * who scored without reading the row.
 */
export function EventScore({
  homeScore,
  awayScore,
  scoredBy,
}: EventScoreProps) {
  return (
    <span className="text-sm tabular-nums whitespace-nowrap text-text-secondary pt-px">
      <span className={cn(scoredBy === "home" && "font-bold text-ink-home")}>
        {homeScore}
      </span>
      –
      <span className={cn(scoredBy === "away" && "font-bold text-ink-away")}>
        {awayScore}
      </span>
    </span>
  );
}

export default EventScore;
