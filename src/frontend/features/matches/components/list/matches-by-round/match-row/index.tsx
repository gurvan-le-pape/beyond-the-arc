// src/frontend/features/matches/components/list/matches-by-round/match-row/index.tsx
"use client";

import { useTranslations } from "next-intl";

import { useMatchesPrefetch, useMatchEvents } from "@/features/matches/api";
import type { Match } from "@/features/matches/types";
import { matchupSide } from "@/features/matches/utils";
import { Link } from "@/navigation";
import { Matchup } from "@/shared/components/domain";
import { ErrorMessage } from "@/shared/components/feedback";
import { Badge } from "@/shared/components/primitives";

import { ExpandButton } from "./ExpandButton";
import { QuarterScoresTable } from "./QuarterScoresTable";

interface MatchRowProps {
  readonly match: Match;
  readonly expanded: boolean;
  readonly onToggleExpand: (matchId: number) => void;
}

/**
 * One fixture in a matchday's list: home above away, each with its score, and
 * an expandable box score. The list around it gives the date and time, once
 * for every match that starts then.
 *
 * Controlled expansion — `expanded` and `onToggleExpand` belong to the parent,
 * which is what lets several rows stay open together.
 *
 * The events behind the expanded view are fetched lazily and prefetched on
 * hover, so opening a row that has already been pointed at is instant while a
 * list of collapsed rows costs nothing.
 *
 * The matchup links to the match page only once the match is played: before
 * that, the page has nothing to show.
 */
export function MatchRow({ match, expanded, onToggleExpand }: MatchRowProps) {
  const {
    data: matchEvents,
    isLoading: isLoadingEvents,
    error: matchEventsError,
    refetch: refetchMatchEvents,
  } = useMatchEvents(match.id, { enabled: expanded });

  const prefetch = useMatchesPrefetch();
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");

  const { homeTeamScore, awayTeamScore } = match;
  const isPlayed = homeTeamScore !== null && awayTeamScore !== null;

  const matchup = (
    <Matchup
      home={matchupSide(match.homeTeam, homeTeamScore)}
      away={matchupSide(match.awayTeam, awayTeamScore)}
      size="line"
    />
  );

  return (
    <li className="px-4 py-3">
      <div className="flex items-center gap-3">
        {isPlayed ? (
          <Link
            href={`/matches/${match.id}`}
            className="min-w-0 flex-1 rounded-button hover:text-ink-primary"
          >
            {matchup}
          </Link>
        ) : (
          <div className="min-w-0 flex-1">{matchup}</div>
        )}
        {match.overtime && (
          <Badge variant="warning" size="sm">
            {tMatches("overtimeShort")}
          </Badge>
        )}
        <ExpandButton
          expanded={expanded}
          onToggle={() => onToggleExpand(match.id)}
          onMouseEnter={() => prefetch.events(match.id)}
        />
      </div>
      {expanded && (
        <div className="mt-3 animate-slide-down">
          {matchEventsError ? (
            <ErrorMessage
              message={tCommon("errors.fetchMatchEvents")}
              onRetry={refetchMatchEvents}
            />
          ) : (
            <QuarterScoresTable
              match={match}
              matchEvents={matchEvents ?? []}
              isLoadingEvents={isLoadingEvents}
            />
          )}
        </div>
      )}
    </li>
  );
}

export default MatchRow;
