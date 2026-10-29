// src/frontend/features/matches/components/detail/match-events/event-timeline/TimelineLegend.tsx

import type { MatchTeam } from "@/features/matches/types";

interface TimelineLegendProps {
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
}

/**
 * The key to the timeline's colours: a swatch in the home and away tones
 * beside each team's name.
 *
 * Hidden from assistive tech: it explains a visual convention (the stripe
 * colour on each row) that screen readers never perceive. Each row names its
 * own team instead, so exposing this too would only add an orphan pair of
 * team names before the list.
 */
export function TimelineLegend({ homeTeam, awayTeam }: TimelineLegendProps) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-wrap gap-x-6 gap-y-1 mb-3 text-sm font-semibold text-text-heading"
    >
      <span className="flex items-center gap-2">
        <span className="size-3 shrink-0 rounded-sm bg-solid-home" />
        {homeTeam.name}
      </span>
      <span className="flex items-center gap-2">
        <span className="size-3 shrink-0 rounded-sm bg-solid-away" />
        {awayTeam.name}
      </span>
    </div>
  );
}
