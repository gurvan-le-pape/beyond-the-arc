// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/index.tsx
"use client";

import { useTranslations } from "next-intl";

import { useMatchesPrefetch, useMatchEvents } from "@/features/matches/api";
import type { Match } from "@/features/matches/types";
import { matchupSide } from "@/features/matches/utils";
import { Matchup } from "@/shared/components/domain";
import { Card, TextLink } from "@/shared/components/primitives";

import { ExpandButton } from "./ExpandButton";
import { MatchExpandedSection } from "./MatchExpandedSection";
import { MatchStatus } from "./MatchStatus";

interface MatchCardProps {
  readonly match: Match;
  readonly expanded: boolean;
  readonly onToggleExpand: (matchId: number) => void;
}

/**
 * One fixture: teams, score, status, and an expandable box score.
 *
 * Controlled expansion — `expanded` and `onToggleExpand` belong to the parent,
 * which is what lets several cards stay open together.
 *
 * The events behind the expanded view are fetched lazily and prefetched on
 * hover, so opening a card that has already been pointed at is instant while a
 * page of collapsed cards costs nothing.
 *
 * The link to the match page appears only once the match is played: before
 * that, the page has nothing to show.
 */
export function MatchCard({ match, expanded, onToggleExpand }: MatchCardProps) {
  const {
    data: matchEvents,
    isLoading: isLoadingEvents,
    error: matchEventsError,
    refetch: refetchMatchEvents,
  } = useMatchEvents(match.id, { enabled: expanded });

  const prefetch = useMatchesPrefetch();
  const tMatches = useTranslations("matches");

  const { homeTeamScore, awayTeamScore } = match;
  const hasScore = homeTeamScore !== null && awayTeamScore !== null;

  return (
    <Card padding="sm" className="overflow-hidden">
      <MatchStatus date={match.startsAt} overtime={match.overtime} />
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Matchup
            home={matchupSide(match.homeTeam, homeTeamScore)}
            away={matchupSide(match.awayTeam, awayTeamScore)}
            size="row"
            belowScore={
              hasScore && (
                <span className="text-sm">
                  <TextLink href={`/matches/${match.id}`}>
                    {tMatches("summary")}
                  </TextLink>
                </span>
              )
            }
          />
        </div>
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
}
