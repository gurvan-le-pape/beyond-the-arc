// src/frontend/features/matches/components/detail/match-events/event-timeline/PeriodSection.tsx
import { useTranslations } from "next-intl";
import { useId } from "react";

import type { EventStyle, MatchTeam } from "@/features/matches/types";
import { Text } from "@/shared/components/typography";

import {
  overtimeNumber,
  type PeriodScore,
  type ScoredMatchEvent,
} from "../matchEventsView";
import { TimelineEventRow } from "./TimelineEventRow";

interface PeriodSectionProps {
  /** 1-based; 5 and above are overtimes. */
  readonly period: number;
  /** The period's score; absent only if the match has no event in it. */
  readonly score: PeriodScore | undefined;
  /** The last period played: its header shows the final score. */
  readonly isLast: boolean;
  readonly events: readonly ScoredMatchEvent[];
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  readonly getEventStyle: (eventType: string) => EventStyle;
  readonly matchDate: Date | string;
}

/**
 * One period of the play-by-play: a header with the period's own points and
 * the score at its end, over the list of its events.
 *
 * The header sticks under the site header (`top-16`, the header's height)
 * while its period scrolls past, so a reader deep in a quarter still sees
 * which one it is and how it ended.
 */
export function PeriodSection({
  period,
  score,
  isLast,
  events,
  homeTeam,
  awayTeam,
  getEventStyle,
  matchDate,
}: PeriodSectionProps) {
  const t = useTranslations("matches.matchEvents");
  const headingId = useId();

  const overtime = overtimeNumber(period);
  const name =
    overtime === null
      ? t("quarterName", { n: period })
      : t("overtimeName", { n: overtime });

  return (
    <section aria-labelledby={headingId}>
      <div className="sticky top-16 z-raised surface-raised flex flex-wrap items-baseline gap-x-4 gap-y-0.5 px-3 sm:px-4 py-2 border-b border-divide tabular-nums">
        <Text variant="title" as="h3" id={headingId}>
          {name}
        </Text>
        {score && (
          <>
            <Text variant="caption" as="span">
              {t.rich("periodPoints", {
                home: score.home,
                away: score.away,
                h: (chunks) => (
                  <span className="font-semibold text-ink-home">{chunks}</span>
                ),
                a: (chunks) => (
                  <span className="font-semibold text-ink-away">{chunks}</span>
                ),
              })}
            </Text>
            <Text variant="caption" as="span" className="ml-auto">
              {t(isLast ? "finalScore" : "periodEndScore", {
                home: score.homeTotal,
                away: score.awayTotal,
              })}
            </Text>
          </>
        )}
      </div>

      <ul aria-labelledby={headingId}>
        {events.map((event) => (
          <TimelineEventRow
            key={event.id}
            event={event}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            style={getEventStyle(event.eventType)}
            matchDate={matchDate}
          />
        ))}
      </ul>
    </section>
  );
}

export default PeriodSection;
