// src/frontend/features/matches/components/list/matches-by-round/roundWindow.ts

/** A round pill's narrowest width, in pixels. */
export const ROUND_PILL_MIN_WIDTH = 48;
const PILL_WIDTH = ROUND_PILL_MIN_WIDTH + 8; // the pill's horizontal padding
const PILL_SPACING = 8; // space-x-2
const ARROWS_WIDTH = 80; // two 36px arrows and a buffer
const MAX_VISIBLE = 8;

/**
 * How many round pills fit between the two arrows of a carousel this wide.
 *
 * @param width - the carousel's width in pixels
 * @returns between 1 and 8 pills
 */
export function visibleRoundCount(width: number): number {
  const available = width - ARROWS_WIDTH;
  const fitting = Math.floor(
    (available + PILL_SPACING) / (PILL_WIDTH + PILL_SPACING),
  );
  return Math.max(1, Math.min(MAX_VISIBLE, fitting));
}

/**
 * Where the carousel's window starts once the round at `index` must be in it:
 * unchanged if it already is, otherwise moved just far enough.
 *
 * @param start - the window's current first index
 * @param index - the index of the round to show
 * @param visible - how many rounds the window shows
 * @returns the window's new first index
 */
export function windowStartShowing(
  start: number,
  index: number,
  visible: number,
): number {
  if (index < start) return index;
  if (index >= start + visible) return Math.max(0, index - visible + 1);
  return start;
}
