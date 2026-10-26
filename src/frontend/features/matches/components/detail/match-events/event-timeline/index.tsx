// src/frontend/features/matches/components/detail/match-events/event-timeline/index.tsx
"use client";

import { useTranslations } from "next-intl";

import type { EventStyle, MatchTeam } from "@/features/matches/types";
import { Text } from "@/shared/components/typography";

import type { PeriodPlays, PeriodScore } from "../matchEventsView";
import { PeriodSection } from "./PeriodSection";
import { TimelineLegend } from "./TimelineLegend";

interface EventTimelineProps {
  /** The plays to show, one run per period, in display order. */
  readonly periods: readonly PeriodPlays[];
  /** Every period's score, from the whole match, whatever is filtered out. */
  readonly periodScores: ReadonlyMap<number, PeriodScore>;
  /** The plays run newest first. */
  readonly latestFirst: boolean;
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  readonly getEventStyle: (eventType: string) => EventStyle;
  readonly matchDate: Date | string;
  /** The lead event id of the play the reader just jumped to, if any. */
  readonly highlightedPlayId: number | null;
}

/**
 * The match's play-by-play: one section per period, each headed by the
 * period's score, its plays in a single column below.
 *
 * The team of an event is carried by colour (the home and away roles) in a
 * stripe on every row, so the legend above is what ties a colour to a team.
 * The last period played is the one whose header shows the final score; it
 * is read from `periodScores`, not from `periods`, so filtering the last
 * period out does not promote another one to "final".
 */
export function EventTimeline({
  periods,
  periodScores,
  latestFirst,
  homeTeam,
  awayTeam,
  getEventStyle,
  matchDate,
  highlightedPlayId,
}: EventTimelineProps) {
  const tMatches = useTranslations("matches");
  const lastPeriod = Math.max(...periodScores.keys());

  return (
    <div>
      <TimelineLegend homeTeam={homeTeam} awayTeam={awayTeam} />

      {periods.length === 0 ? (
        <Text variant="caption" className="py-8 text-center">
          {tMatches("matchEvents.noMatchingEvents")}
        </Text>
      ) : (
        // `overflow-clip`, not `overflow-hidden`: it rounds the corners
        // without becoming a scroll container, which would pin the sticky
        // period headers to this box instead of the page.
        <div className="rounded-card border border-divide surface-subtle shadow-card overflow-clip">
          {periods.map(({ period, plays }) => (
            <PeriodSection
              key={period}
              period={period}
              score={periodScores.get(period)}
              isLast={period === lastPeriod}
              plays={plays}
              latestFirst={latestFirst}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              getEventStyle={getEventStyle}
              matchDate={matchDate}
              highlightedPlayId={highlightedPlayId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
