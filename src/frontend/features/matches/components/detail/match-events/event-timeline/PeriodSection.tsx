// src/frontend/features/matches/components/detail/match-events/event-timeline/PeriodSection.tsx
import { useTranslations } from "next-intl";
import { Fragment, useId } from "react";

import type { EventStyle, MatchTeam } from "@/features/matches/types";
import { Text } from "@/shared/components/typography";

import type { Play, PlayReveal } from "../plays";
import { overtimeNumber } from "../plays";
import type { PeriodScore } from "./periods";
import { RunDivider } from "./RunDivider";
import { TimelineEventRow } from "./TimelineEventRow";

interface PeriodSectionProps {
  /** 1-based; 5 and above are overtimes. */
  readonly period: number;
  /** The period's score; absent only if the match has no event in it. */
  readonly score: PeriodScore | undefined;
  /** The last period played: its header shows the final score. */
  readonly isLast: boolean;
  readonly plays: readonly Play[];
  /** The plays run newest first: a run's band then goes above its last basket. */
  readonly latestFirst: boolean;
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  readonly getEventStyle: (eventType: string) => EventStyle;
  /** The jump the reader just made to a play, if any. */
  readonly reveal: PlayReveal | null;
}

/**
 * One period of the play-by-play: a header with the period's own points and
 * the score at its end, over the list of its plays.
 *
 * The header sticks under the site header (`top-16`, the header's height)
 * while its period scrolls past, so a reader deep in a quarter still sees
 * which one it is and how it ended.
 */
export function PeriodSection({
  period,
  score,
  isLast,
  plays,
  latestFirst,
  homeTeam,
  awayTeam,
  getEventStyle,
  reveal,
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
        {plays.map((play) => {
          const row = (
            <TimelineEventRow
              play={play}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              style={getEventStyle(play.lead.eventType)}
              reveal={play.lead.id === reveal?.playId ? reveal : null}
            />
          );
          const run = play.runEnded;
          if (!run) return <Fragment key={play.lead.id}>{row}</Fragment>;

          const divider = (
            <RunDivider
              points={run.points}
              side={run.teamId === homeTeam.id ? "home" : "away"}
              teamName={
                run.teamId === homeTeam.id ? homeTeam.name : awayTeam.name
              }
            />
          );
          return (
            <Fragment key={play.lead.id}>
              {latestFirst ? divider : row}
              {latestFirst ? row : divider}
            </Fragment>
          );
        })}
      </ul>
    </section>
  );
}
