// src/frontend/features/matches/components/detail/match-events/match-flow/flowGeometry.ts
import type { MarginPoint, PeriodEnd } from "./matchFlow";

// The SVG's own units. It is stretched to its box (`preserveAspectRatio`
// none), so everything drawn in it is a line or a fill that tolerates the
// stretch; text and dots are HTML laid over it, placed by percentage. The
// height is 100, so a percentage of it is also a y coordinate.
export const VIEW_WIDTH = 1000;
export const VIEW_HEIGHT = 100;

/** One period's span on the time axis, in game seconds from tip-off. */
export interface PeriodSpan {
  readonly period: number;
  readonly start: number;
  readonly end: number;
}

/** Where everything in the score-margin chart is drawn. */
export interface FlowGeometry {
  /** The time axis's length: game seconds from tip-off to the last buzzer. */
  readonly duration: number;
  /** Percent of the plot's width at a game second, clamped to the last buzzer. */
  readonly x: (seconds: number) => number;
  /** Percent of the plot's height at a margin, home leads upward. */
  readonly y: (margin: number) => number;
  /** SVG x at a game second. */
  readonly vx: (seconds: number) => number;
  /** The gridline margins on each side of zero, in increasing order. */
  readonly ticks: readonly number[];
  readonly periods: readonly PeriodSpan[];
  /** The margin as a step line from tip-off to the last buzzer. */
  readonly line: string;
  /** The same line closed along the zero line, to be filled. */
  readonly area: string;
}

/**
 * Lays out the chart: the margin range is symmetric around zero, at least
 * ±4 and one past the widest lead, so the line never touches the edge; the
 * gridlines fall every 5 points, or every 10 past a 16-point lead.
 *
 * @param points - the margin after each scoring play, in match order
 * @param periodEnds - each period's buzzer, in period order; the last one ends the axis
 * @returns the scales, gridlines, period spans and paths to draw
 */
export function flowGeometry(
  points: readonly MarginPoint[],
  periodEnds: readonly PeriodEnd[],
): FlowGeometry {
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

  return { duration: total, x, y, vx, ticks, periods, line, area };
}

/**
 * The basket closest in time to a moment of the match.
 *
 * @param points - the chart's baskets, in match order; not empty
 * @param seconds - the moment, in game seconds from tip-off
 * @returns the index of the nearest basket; the earlier one on a tie
 */
export function nearestPoint(
  points: readonly MarginPoint[],
  seconds: number,
): number {
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
}

/**
 * The basket a key moves the slider to. With nothing picked, forward keys
 * start from the first basket and backward keys from the last.
 *
 * @param key - the key pressed
 * @param picked - the index of the picked basket; `null` when none is
 * @param count - how many baskets the chart has
 * @returns the index of the basket; `null` for a key that does not move it
 */
export function stepPicked(
  key: string,
  picked: number | null,
  count: number,
): number | null {
  const last = count - 1;
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
}
