// src/frontend/features/matches/components/detail/MatchBody.tsx
import type { MatchDetail, MatchTeamWithStats } from "@/features/matches/types";
import { MatchStatus } from "@/shared/constants";

import { ForfeitNotice } from "./ForfeitNotice";
import { MatchSummaryTabs } from "./MatchSummaryTabs";
import { ResultUnavailableNotice } from "./ResultUnavailableNotice";
import { UpcomingMatchNotice } from "./UpcomingMatchNotice";

interface MatchBodyProps {
  readonly match: MatchDetail;
  readonly homeTeam: MatchTeamWithStats;
  readonly awayTeam: MatchTeamWithStats;
}

/**
 * What a match page shows under its hero, by the match's state: a forfeit
 * gets its notice; a played match its stats and play-by-play; a match the
 * simulator failed to play says its result is unavailable; and a match not
 * yet played, or being played, says when it tips off.
 */
export function MatchBody({ match, homeTeam, awayTeam }: MatchBodyProps) {
  if (match.forfeit) {
    return <ForfeitNotice homeTeam={homeTeam} awayTeam={awayTeam} />;
  }

  switch (match.status) {
    case MatchStatus.COMPLETED:
      return (
        <MatchSummaryTabs
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          matchEvents={match.matchEvents}
          matchDate={match.startsAt}
        />
      );
    case MatchStatus.FAILED:
      return <ResultUnavailableNotice />;
    case MatchStatus.SCHEDULED:
    case MatchStatus.GENERATING:
      return <UpcomingMatchNotice startsAt={match.startsAt} />;
  }
}
