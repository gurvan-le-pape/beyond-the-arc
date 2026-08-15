// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/index.tsx
"use client";

import { useMatchesPrefetch, useMatchEvents } from "@/features/matches/api";
import type { Match } from "@/features/matches/types";
import { Card } from "@/shared/components/primitives";

import { ExpandButton } from "./ExpandButton";
import { MatchExpandedSection } from "./MatchExpandedSection";
import { MatchStatus } from "./MatchStatus";
import { ScoreDisplay } from "./ScoreDisplay";
import { TeamDisplay } from "./TeamDisplay";

interface MatchCardProps {
  readonly match: Match;
  readonly expanded: boolean;
  readonly onToggleExpand: (matchId: number) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  expanded,
  onToggleExpand,
}) => {
  const {
    data: matchEvents,
    isLoading: isLoadingEvents,
    error: matchEventsError,
    refetch: refetchMatchEvents,
  } = useMatchEvents(match.id, { enabled: expanded });

  const prefetch = useMatchesPrefetch();

  const { homeTeamScore, awayTeamScore } = match;
  const hasScore = homeTeamScore !== null && awayTeamScore !== null;
  const isHomeWinner = hasScore && homeTeamScore > awayTeamScore;
  const isAwayWinner = hasScore && awayTeamScore > homeTeamScore;

  return (
    <Card padding="sm" className="overflow-hidden">
      <MatchStatus date={match.startsAt} overtime={match.overtime} />
      <div className="flex items-center justify-between gap-2">
        <TeamDisplay team={match.homeTeam} isWinner={isHomeWinner} />
        <ScoreDisplay
          homeTeamScore={match.homeTeamScore}
          awayTeamScore={match.awayTeamScore}
          matchId={match.id}
        />
        <TeamDisplay team={match.awayTeam} isWinner={isAwayWinner} />
        <ExpandButton
          expanded={expanded}
          onToggle={() => onToggleExpand(match.id)}
          onMouseEnter={() => prefetch.events(match.id)}
        />
      </div>
      {expanded && (
        <MatchExpandedSection
          match={match}
          matchEvents={matchEvents ?? []}
          isLoadingEvents={isLoadingEvents}
          hasError={!!matchEventsError}
          onRetryEvents={refetchMatchEvents}
        />
      )}
    </Card>
  );
};
