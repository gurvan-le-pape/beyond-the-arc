// src/frontend/shared/types/ShotEvent.ts

/**
 * A shot, positioned in half-court metres.
 *
 * The frame was previously recoverable only by reading `courtConstants.ts` and
 * inferring it: the origin is the baseline corner, `x` runs across the court's
 * 15 m width and `y` from the baseline towards half-court over 14 m. The
 * basket sits at `x` 7.5, `y` 1.575 (`BASKET_X` / `BASKET_Y`), and the
 * three-point arc is 6.75 m from it.
 *
 * Not `xMeters`/`yMeters`: a unit suffix states half of what was missing and
 * the less important half, since a coordinate means nothing without its
 * origin and no suffix can carry that.
 */
export interface ShotEvent {
  /** Metres across the court from the baseline corner, 0–15. */
  x: number;
  /** Metres from the baseline towards half-court, 0–14. */
  y: number;
  made: boolean;
}
