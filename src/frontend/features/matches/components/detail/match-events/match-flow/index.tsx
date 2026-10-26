// src/frontend/features/matches/components/detail/match-events/match-flow/index.tsx
import type { MatchTeam } from "@/features/matches/types";

import type { MarginPoint, MatchSummary, Play } from "../matchEventsView";
import { FlowChart } from "./FlowChart";
import { SummaryFigures } from "./SummaryFigures";

interface MatchFlowProps {
  readonly summary: MatchSummary;
  readonly margins: readonly MarginPoint[];
  /** The last period played, which sets where the chart's time axis ends. */
  readonly lastPeriod: number;
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  readonly matchDate: Date | string;
  /** Called with the play the reader chose to go to from the chart. */
  readonly onSelectPlay: (play: Play) => void;
}

/**
 * The shape of the whole match, above the play-by-play: the summary figures,
 * then the score-margin chart. Neither follows the filters below them.
 */
export function MatchFlow({
  summary,
  margins,
  lastPeriod,
  homeTeam,
  awayTeam,
  matchDate,
  onSelectPlay,
}: MatchFlowProps) {
  return (
    <div className="flex flex-col gap-2">
      <SummaryFigures
        summary={summary}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        matchDate={matchDate}
      />
      <FlowChart
        points={margins}
        lastPeriod={lastPeriod}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        matchDate={matchDate}
        onSelect={onSelectPlay}
      />
    </div>
  );
}

export default MatchFlow;
