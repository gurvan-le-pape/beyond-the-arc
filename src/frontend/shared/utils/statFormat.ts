// src/frontend/shared/utils/statFormat.ts
import type { createFormatter } from "next-intl";

type Formatter = ReturnType<typeof createFormatter>;

/** The two stat shapes that need more than a plain locale number. */
export interface StatFormat {
  /** A per-game average, always with one decimal: `12.0`, `12,5`. */
  readonly perGame: (value: number) => string;
  /**
   * A percentage as the API sends it, out of 100: `46.7` is `46.7%` in
   * English and `46,7 %` in French, where the locale puts the space.
   */
  readonly percent: (value: number) => string;
}

/**
 * Stat formatting on top of a next-intl formatter, so the locale decides the
 * decimal separator and the shape of a percentage.
 *
 * Every stat on the site goes through this or through the formatter directly,
 * never `toFixed` or a hand-appended `"%"` — both print English formatting on
 * `/fr`. It takes the formatter rather than calling `useFormatter` itself so
 * the one function serves client components, server components (sync and
 * async) and tests alike.
 *
 * @param format - `useFormatter()` in a component, `await getFormatter()` in an
 *   async server component, `createFormatter` in a test
 * @returns the per-game and percentage formatters
 */
export function createStatFormat(format: Formatter): StatFormat {
  return {
    perGame: (value) =>
      format.number(value, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    percent: (value) =>
      format.number(value / 100, {
        style: "percent",
        maximumFractionDigits: 1,
      }),
  };
}
