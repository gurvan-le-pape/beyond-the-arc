// src/frontend/features/matches/components/detail/match-events/match-flow/FlowChart.tsx
import { useTranslations } from "next-intl";
import { type KeyboardEvent, type MouseEvent, useId, useState } from "react";

import type { MatchTeam } from "@/features/matches/types";
import { getEventStyle } from "@/features/matches/utils";
import { Button } from "@/shared/components/primitives";
import { EventCategory, Role } from "@/shared/constants";
import { cn } from "@/shared/utils";

import {
  formatClock,
  type MarginPoint,
  type PeriodEnd,
  type Play,
} from "../matchEventsView";
import { usePeriodAbbr } from "./usePeriodAbbr";

// The SVG's own units. It is stretched to its box (`preserveAspectRatio`
// none), so everything drawn in it is a line or a fill that tolerates the
// stretch; text and dots are HTML laid over it, placed by percentage. The
// height is 100, so a percentage of it is also a y coordinate.
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 100;

interface FlowChartProps {
  /** The margin after each scoring play, in match order. */
  readonly points: readonly MarginPoint[];
  /** Each period's buzzer, in period order; the last one ends the time axis. */
  readonly periodEnds: readonly PeriodEnd[];
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  /** Called with the play the reader asked to go to. */
  readonly onGoTo: (play: Play) => void;
}

/**
 * The name of the player whose basket scored the play.
 *
 * @param play - a scoring play
 * @returns the shooter of its first made shot or free throw; `undefined` when none is named
 */
function scorerName(play: Play): string | undefined {
  const made = [play.lead, ...play.followers].find(
    (event) =>
      getEventStyle(event.eventType).eventCategory === EventCategory.MADE,
  );
  return made?.players?.find((p) => p.role === Role.SHOOTER)?.player.name;
}

/**
 * The score margin over the match, as a step line: above the zero line while
 * the home side leads, below while the away side does, each half filled in
 * its side's tone. Dashed lines split the periods.
 *
 * The plot is one slider over the match's baskets. Picking a basket and going
 * to it are two steps, so the chart stays in view while the reader looks for
 * the right one:
 *
 * - pointing at the plot previews the nearest basket with a guide line, and
 *   writes it under the chart while none is picked;
 * - a click or tap picks the nearest basket and focuses the plot, and the
 *   arrow keys, Home and End then step from it;
 * - "Go to play", Enter or Space scroll to the picked play in the list below.
 */
export function FlowChart({
  points,
  periodEnds,
  homeTeam,
  awayTeam,
  onGoTo,
}: FlowChartProps) {
  const t = useTranslations("matches.matchEvents");
  const periodAbbr = usePeriodAbbr();
  const clipId = useId();
  const helpId = useId();
  const [picked, setPicked] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const total = periodEnds[periodEnds.length - 1]?.seconds ?? 1;
  const maxAbs =
    Math.max(4, ...points.map((point) => Math.abs(point.margin))) + 1;
  const x = (seconds: number) => (Math.min(seconds, total) / total) * 100;
  const y = (margin: number) => ((maxAbs - margin) / (2 * maxAbs)) * 100;
  const tickStep = maxAbs > 16 ? 10 : 5;
  const ticks: number[] = [];
  for (let tick = tickStep; tick < maxAbs; tick += tickStep) ticks.push(tick);

  const periods = periodEnds.map((end, index) => ({
    period: end.period,
    start: index === 0 ? 0 : periodEnds[index - 1].seconds,
    end: end.seconds,
  }));

  const vx = (seconds: number) => (x(seconds) / 100) * VIEW_WIDTH;
  let line = `M0,${y(0)}`;
  for (const point of points) {
    line += ` H${vx(point.seconds)} V${y(point.margin)}`;
  }
  line += ` H${VIEW_WIDTH}`;
  const area = `${line} V${y(0)} H0 Z`;

  const describe = (index: number) => {
    const { play } = points[index];
    const clock = formatClock(play.lead.secondsLeft);
    return t("flowPoint", {
      period: periodAbbr(play.period),
      clock,
      home: play.homeScore,
      away: play.awayScore,
      who: scorerName(play) ?? "none",
    });
  };

  const nearest = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const seconds = ((event.clientX - box.left) / box.width) * total;
    let best = 0;
    points.forEach((point, index) => {
      if (
        Math.abs(point.seconds - seconds) <
        Math.abs(points[best].seconds - seconds)
      ) {
        best = index;
      }
    });
    return best;
  };

  /**
   * The basket a key moves the cursor to.
   *
   * @param key - the key pressed
   * @returns the index of the basket; `null` for a key that does not move it
   */
  const moveFor = (key: string): number | null => {
    const last = points.length - 1;
    switch (key) {
      case "ArrowRight":
      case "ArrowUp":
        return picked === null ? 0 : Math.min(last, picked + 1);
      case "ArrowLeft":
      case "ArrowDown":
        return picked === null ? last : Math.max(0, picked - 1);
      case "Home":
        return 0;
      case "End":
        return last;
      default:
        return null;
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = moveFor(event.key);
    if (move !== null) {
      event.preventDefault();
      setPicked(move);
    } else if (
      (event.key === "Enter" || event.key === " ") &&
      picked !== null
    ) {
      event.preventDefault();
      onGoTo(points[picked].play);
    }
  };

  if (points.length === 0) return null;
  const pickedPoint = picked === null ? null : points[picked];
  const pickedSide =
    pickedPoint?.play.scoringTeamId === homeTeam.id ? "home" : "away";
  const hoveredPoint = hovered === null ? null : points[hovered];
  const readout = picked ?? hovered;

  return (
    <figure className="rounded-card border border-divide surface-raised px-3 pt-3 pb-2">
      <figcaption>
        <p className="text-sm font-semibold text-text-heading">
          {t("flowTitle")}
        </p>
        <p className="text-xs text-text-secondary">
          {t.rich("flowLegend", {
            home: homeTeam.name,
            away: awayTeam.name,
            h: (chunks) => (
              <span className="font-semibold text-ink-home">{chunks}</span>
            ),
            a: (chunks) => (
              <span className="font-semibold text-ink-away">{chunks}</span>
            ),
          })}
        </p>
      </figcaption>

      <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] grid-rows-[1.25rem_9rem] sm:grid-rows-[1.25rem_11rem] mt-2 text-[11px] text-text-secondary tabular-nums">
        <span />
        <div aria-hidden="true" className="relative">
          {periods.map(({ period, start, end }) => (
            <span
              key={period}
              className="absolute top-0 -translate-x-1/2"
              style={{
                left: `${(x(start) + x(end)) / 2}%`,
              }}
            >
              {periodAbbr(period)}
            </span>
          ))}
        </div>

        <div aria-hidden="true" className="relative">
          {ticks.flatMap((tick) => [
            <span
              key={`h${tick}`}
              className="absolute right-1 -translate-y-1/2 text-ink-home"
              style={{ top: `${y(tick)}%` }}
            >
              +{tick}
            </span>,
            <span
              key={`a${tick}`}
              className="absolute right-1 -translate-y-1/2 text-ink-away"
              style={{ top: `${y(-tick)}%` }}
            >
              +{tick}
            </span>,
          ])}
        </div>

        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          >
            <defs>
              <clipPath id={`${clipId}-above`}>
                <rect width={VIEW_WIDTH} height={y(0)} />
              </clipPath>
              <clipPath id={`${clipId}-below`}>
                <rect y={y(0)} width={VIEW_WIDTH} height={VIEW_HEIGHT} />
              </clipPath>
            </defs>
            {ticks.flatMap((tick) =>
              [tick, -tick].map((margin) => (
                <line
                  key={margin}
                  x1={0}
                  x2={VIEW_WIDTH}
                  y1={y(margin)}
                  y2={y(margin)}
                  className="stroke-divide/60"
                  vectorEffect="non-scaling-stroke"
                />
              )),
            )}
            {periods.slice(1).map(({ period, start }) => {
              const at = vx(start);
              return (
                <line
                  key={period}
                  x1={at}
                  x2={at}
                  y1={0}
                  y2={VIEW_HEIGHT}
                  className="stroke-divide"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
            <path
              d={area}
              clipPath={`url(#${clipId}-above)`}
              className="fill-solid-home/20"
            />
            <path
              d={area}
              clipPath={`url(#${clipId}-below)`}
              className="fill-solid-away/20"
            />
            <line
              x1={0}
              x2={VIEW_WIDTH}
              y1={y(0)}
              y2={y(0)}
              className="stroke-text-secondary"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={line}
              fill="none"
              strokeWidth={1.5}
              strokeLinejoin="round"
              className="stroke-text-emphasis"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {hoveredPoint && hovered !== picked && (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 w-px bg-text-secondary/50"
              style={{ left: `${x(hoveredPoint.seconds)}%` }}
            />
          )}

          {pickedPoint && (
            <span aria-hidden="true">
              <span
                className="absolute inset-y-0 w-px bg-text-secondary"
                style={{ left: `${x(pickedPoint.seconds)}%` }}
              />
              <span
                className={cn(
                  "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 surface-raised",
                  pickedSide === "home"
                    ? "border-solid-home"
                    : "border-solid-away",
                )}
                style={{
                  left: `${x(pickedPoint.seconds)}%`,
                  top: `${y(pickedPoint.margin)}%`,
                }}
              />
            </span>
          )}

          {/* Last, so it lies over the drawing and takes the pointer. */}
          <div
            role="slider"
            tabIndex={0}
            aria-label={t("flowTitle")}
            aria-describedby={helpId}
            aria-valuemin={1}
            aria-valuemax={points.length}
            aria-valuenow={(picked ?? points.length - 1) + 1}
            aria-valuetext={describe(picked ?? points.length - 1)}
            onPointerMove={(event) => setHovered(nearest(event))}
            onPointerLeave={() => setHovered(null)}
            onClick={(event) => setPicked(nearest(event))}
            onKeyDown={onKeyDown}
            className="absolute inset-0 cursor-crosshair touch-pan-y rounded-input focus-ring"
          />
        </div>
      </div>

      <div className="flex min-h-7 items-center justify-between gap-3 mt-1">
        <p
          aria-hidden="true"
          className="min-w-0 text-xs font-medium text-text-emphasis tabular-nums truncate"
        >
          {readout !== null && describe(readout)}
        </p>
        {pickedPoint && (
          <Button
            variant="link"
            size="sm"
            className="shrink-0"
            onClick={() => onGoTo(pickedPoint.play)}
          >
            {t("goToPlay")}
            <span aria-hidden="true"> ↓</span>
          </Button>
        )}
      </div>
      <p id={helpId} className="text-xs text-text-secondary">
        {t("flowHelp")}
      </p>
    </figure>
  );
}

export default FlowChart;
