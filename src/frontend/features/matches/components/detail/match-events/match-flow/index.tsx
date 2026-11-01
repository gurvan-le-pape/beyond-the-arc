// src/frontend/features/matches/components/detail/match-events/match-flow/index.tsx
import { useMemo } from "react";

import type { MatchEvent, MatchTeam } from "@/features/matches/types";

import type { Play } from "../plays";
import { FlowChart } from "./FlowChart";
import { marginPoints, periodEnds, summarizeMatch } from "./matchFlow";
import { SummaryFigures } from "./SummaryFigures";

interface MatchFlowProps {
  /** Every play of the match, in match order, whatever the filters show. */
  readonly plays: readonly Play[];
  /** The match's events, from which each period's buzzer is read. */
  readonly events: readonly MatchEvent[];
  /** When the match started, to place plays in game time. */
  readonly tipOff: Date | string;
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  /** Called with the play the reader asked to go to from the chart. */
  readonly onGoToPlay: (play: Play) => void;
}

/**
 * The shape of the whole match, above the play-by-play: the summary figures,
 * then the score-margin chart. Neither follows the filters below them, so
 * both are derived here from the whole match.
 */
export function MatchFlow({
  plays,
  events,
  tipOff,
  homeTeam,
  awayTeam,
  onGoToPlay,
}: MatchFlowProps) {
  const summary = useMemo(() => summarizeMatch(plays), [plays]);
  const margins = useMemo(() => marginPoints(plays, tipOff), [plays, tipOff]);
  const ends = useMemo(() => periodEnds(events, tipOff), [events, tipOff]);

  return (
    <div className="flex flex-col gap-2">
      <SummaryFigures
        summary={summary}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />
      <FlowChart
        points={margins}
        periodEnds={ends}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        onGoTo={onGoToPlay}
      />
    </div>
  );
}
