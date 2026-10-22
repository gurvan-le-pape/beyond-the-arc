// src/frontend/features/matches/components/detail/match-events/event-timeline/TimelineTeamHeader.tsx

import type { TeamInfo } from "@/features/teams/types";

import { TimelineRow } from "./TimelineRow";

interface TimelineTeamHeaderProps {
  readonly homeTeam: TeamInfo;
  readonly awayTeam: TeamInfo;
}

/**
 * Two-column header row displayed above the event timeline.
 * Home team (logo + name) on the left, away team (name + logo) on the right,
 * separated by a bottom border.
 *
 * Hidden from assistive tech: it is a legend for a spatial convention (left =
 * home, right = away) that screen readers never perceive. Each event in the
 * list below names its own team instead, so exposing this row too would only
 * add an orphan pair of team names before the list.
 */
export function TimelineTeamHeader({
  homeTeam,
  awayTeam,
}: TimelineTeamHeaderProps) {
  return (
    <TimelineRow
      aria-hidden="true"
      className="mb-4 pb-3 border-b-2 border-divide"
    >
      <span className="font-bold text-text-heading">{homeTeam.name}</span>

      {/* Centre spacer (matches the 80px score-pill column) */}
      <div />

      <span className="font-bold text-text-heading text-right">
        {awayTeam.name}
      </span>
    </TimelineRow>
  );
}

export default TimelineTeamHeader;
