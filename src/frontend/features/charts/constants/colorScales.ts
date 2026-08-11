// src/frontend/features/charts/constants/colorScales.ts
import {
  interpolateCividis,
  interpolateInferno,
  interpolateTurbo,
  interpolateViridis,
  interpolateYlOrRd,
} from "d3-scale-chromatic";

/**
 * The five sequential interpolators the shot chart offers.
 *
 * Resolve a scale name **only** through this map. The equivalent computed
 * lookup — ``d3[`interpolate${name}`]`` — reads the d3 namespace by a key the
 * bundler cannot see, so nothing can be dropped and the whole package lands in
 * the vendor chunk. Measured: that one index was worth 352.3 KB raw / 117.3 kB
 * gzip on its own, and removing it costs no behaviour because these five names
 * are the only ones any call site passes.
 */
export const COLOR_SCALES = {
  YlOrRd: interpolateYlOrRd,
  Viridis: interpolateViridis,
  Inferno: interpolateInferno,
  Cividis: interpolateCividis,
  Turbo: interpolateTurbo,
} as const;

export type ColorScaleName = keyof typeof COLOR_SCALES;

export const COLOR_SCALE_LIST = Object.keys(COLOR_SCALES) as ColorScaleName[];

/** The scale used when a caller supplies neither a function nor a name. */
export const DEFAULT_COLOR_SCALE: ColorScaleName = "YlOrRd";
