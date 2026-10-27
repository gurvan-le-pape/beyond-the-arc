// src/frontend/features/matches/components/detail/match-events/match-flow/index.tsx
import type { MatchTeam } from "@/features/matches/types";

import type {
  MarginPoint,
  MatchSummary,
  PeriodEnd,
  Play,
} from "../matchEventsView";
import { FlowChart } from "./FlowChart";
import { SummaryFigures } from "./SummaryFigures";

interface MatchFlowProps {
  readonly summary: MatchSummary;
  readonly margins: readonly MarginPoint[];
  /** Each period's buzzer, which lays out the chart's time axis. */
  readonly periodEnds: readonly PeriodEnd[];
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  /** Called with the play the reader asked to go to from the chart. */
  readonly onGoToPlay: (play: Play) => void;
}

/**
 * The shape of the whole match, above the play-by-play: the summary figures,
 * then the score-margin chart. Neither follows the filters below them.
 */
export function MatchFlow({
  summary,
  margins,
  periodEnds,
  homeTeam,
  awayTeam,
  onGoToPlay,
}: MatchFlowProps) {
  return (
    <div className="flex flex-col gap-2">
      <SummaryFigures
        summary={summary}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />
      <FlowChart
        points={margins}
        periodEnds={periodEnds}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        onGoTo={onGoToPlay}
      />
    </div>
  );
}

export default MatchFlow;
