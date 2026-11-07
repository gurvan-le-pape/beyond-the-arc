// src/frontend/features/matches/components/detail/match-events/event-timeline/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { EventStyle, MatchTeam } from "@/features/matches/types";
import { Text } from "@/shared/components/typography";

import type { Play, PlayReveal } from "../plays";
import { groupByPeriod, scorePeriods } from "./periods";
import { PeriodSection } from "./PeriodSection";
import { TimelineLegend } from "./TimelineLegend";

interface EventTimelineProps {
  /** Every play of the match, in match order, whatever is filtered out. */
  readonly plays: readonly Play[];
  /** The plays the filters keep, in display order. */
  readonly shownPlays: readonly Play[];
  /** The plays run newest first. */
  readonly latestFirst: boolean;
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  readonly getEventStyle: (eventType: string) => EventStyle;
  /** The jump the reader just made to a play, if any. */
  readonly reveal: PlayReveal | null;
}

/**
 * The match's play-by-play: one section per period, each headed by the
 * period's score, its plays in a single column below.
 *
 * The team of an event is carried by colour (the home and away roles) in a
 * stripe on every row, so the legend above is what ties a colour to a team.
 * The period scores come from every play, not from the shown ones, so a
 * header keeps the period's real score whatever is filtered out, and
 * filtering the last period out does not promote another one to "final".
 */
export function EventTimeline({
  plays,
  shownPlays,
  latestFirst,
  homeTeam,
  awayTeam,
  getEventStyle,
  reveal,
}: EventTimelineProps) {
  const tMatches = useTranslations("matches");
  const periods = useMemo(() => groupByPeriod(shownPlays), [shownPlays]);
  const periodScores = useMemo(() => scorePeriods(plays), [plays]);
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
              reveal={reveal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
