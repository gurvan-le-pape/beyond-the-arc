// src/frontend/shared/components/blocks/stat-comparison/resolveValue.ts
import { NA } from "@/shared/constants";

import type { Stats, StatValue } from "./types";

/**
 * Decides which side of a stat comparison wins.
 *
 * **Anything unresolvable is a tie**, not an error: an equal pair, and also any
 * `NaN` — which is what `resolveValue` produces for a missing stat. So a stat
 * one side simply does not have neither wins nor loses, and no bar fills.
 *
 * @param numA - the left side's numeric value
 * @param numB - the right side's numeric value
 * @param lowerIsBetter - invert the comparison, for turnovers and fouls
 * @returns which side wins, or `"tie"`
 */
export function getWinner(
  numA: number,
  numB: number,
  lowerIsBetter?: boolean,
): "A" | "B" | "tie" {
  if (Number.isNaN(numA) || Number.isNaN(numB) || numA === numB) return "tie";
  const aWins = lowerIsBetter ? numA < numB : numA > numB;
  return aWins ? "A" : "B";
}

function toNumber(value: StatValue): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : Number.NaN;
  }
  return Number.NaN;
}

/**
 * Produces the two things a comparison row needs from one stat: the string to
 * show, and the number to compare.
 *
 * The pair is deliberately not the same value. In the key-lookup path the
 * numeric side is read from the **raw** stat, so appending a percentage to the
 * display never affects who wins.
 *
 * **The custom-resolver path does not have that separation** — with `valueFn`
 * the number is parsed back out of whatever it returned. A resolver that
 * formats its output (`"12 (45%)"`, a thousands separator, a unit) yields `NaN`
 * and therefore a permanent tie. Return a bare number from `valueFn` and let
 * this add the presentation.
 *
 * A missing stat displays the shared `NA` constant and compares as `NaN`.
 *
 * @param stats - the side's stat object
 * @param key - which stat to read
 * @param valueFn - custom resolver; must return an unformatted value
 * @param percentageMap - stat key to percentage-field key, appended in parentheses
 * @returns the display value and the number to compare on
 */
export function resolveValue(
  stats: Stats,
  key: string,
  valueFn?: (s: Stats) => string | number,
  percentageMap?: Record<string, string>,
): { display: string | number; numeric: number } {
  // Custom resolver path
  if (valueFn) {
    const display = valueFn(stats);
    return {
      display,
      numeric: toNumber(display),
    };
  }

  const raw = stats[key];
  const pctKey = percentageMap?.[key];
  const pct = pctKey ? stats[pctKey] : undefined;

  // The "%" belongs here, not in the value. The API sends a number or null, so
  // the unit is added at the point of display and the absent case simply drops
  // the parenthetical rather than printing an English sentinel like "N/A" into
  // a bilingual UI.
  let display: string | number;

  if (raw === null || raw === undefined) {
    display = NA;
  } else if (typeof pct === "number") {
    display = `${raw} (${pct}%)`;
  } else {
    display = raw;
  }

  return {
    display,
    numeric: toNumber(raw),
  };
}
