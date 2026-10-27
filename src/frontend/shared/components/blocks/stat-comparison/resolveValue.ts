// src/frontend/shared/components/blocks/stat-comparison/resolveValue.ts
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

/** How `resolveValue` turns numbers into text, and what it shows for a gap. */
export interface ResolveValueOptions {
  /** A raw numeric stat, e.g. the locale's plain number or a per-game average. */
  readonly formatNumber: (value: number) => string;
  /** A percentage out of 100, shown in parentheses after its paired stat. */
  readonly formatPercent: (value: number) => string;
  /** Stat key to percentage-field key. */
  readonly percentageMap?: Record<string, string>;
  /**
   * What to render when the stat is absent; a locale-neutral dash by default,
   * callers that have a translator in scope pass a translated string.
   */
  readonly missingLabel?: string;
}

/**
 * Produces the two things a comparison row needs from one stat: the string to
 * show, and the number to compare.
 *
 * The pair is deliberately not the same value. A stat paired with a percentage
 * **compares on that percentage**: its raw value is a made/attempted string
 * like `"27/54"`, which is not a number, and shooting is judged on accuracy
 * rather than on volume. An unpaired stat compares on its raw value. The number
 * is always read from the stat itself and never parsed back out of the display,
 * so formatting — a French decimal comma, a percent sign — never affects who
 * wins.
 *
 * A missing stat displays `missingLabel` and compares as `NaN`.
 *
 * @param stats - the side's stat object
 * @param key - which stat to read
 * @param options - the formatters, the percentage pairing and the gap label
 * @returns the display value and the number to compare on
 */
export function resolveValue(
  stats: Stats,
  key: string,
  {
    formatNumber,
    formatPercent,
    percentageMap,
    missingLabel = "–",
  }: ResolveValueOptions,
): { display: string; numeric: number } {
  const raw = stats[key];
  const pctKey = percentageMap?.[key];
  const pct = pctKey ? stats[pctKey] : undefined;

  // The API sends a percentage as a number or null, so its unit is added here,
  // and the absent case simply drops the parenthetical rather than printing an
  // English sentinel like "N/A" into a bilingual UI.
  let display: string;

  if (raw === null || raw === undefined) {
    display = missingLabel;
  } else {
    const value = typeof raw === "number" ? formatNumber(raw) : raw;
    display =
      typeof pct === "number" ? `${value} (${formatPercent(pct)})` : value;
  }

  return {
    display,
    numeric: typeof pct === "number" ? pct : toNumber(raw),
  };
}
