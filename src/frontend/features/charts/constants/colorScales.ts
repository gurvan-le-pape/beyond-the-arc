// src/frontend/features/charts/constants/colorScales.ts
import * as d3 from "d3";

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
  YlOrRd: d3.interpolateYlOrRd,
  Viridis: d3.interpolateViridis,
  Inferno: d3.interpolateInferno,
  Cividis: d3.interpolateCividis,
  Turbo: d3.interpolateTurbo,
} as const;

export type ColorScaleName = keyof typeof COLOR_SCALES;

export const COLOR_SCALE_LIST = Object.keys(COLOR_SCALES) as ColorScaleName[];

/** The scale used when a caller supplies neither a function nor a name. */
export const DEFAULT_COLOR_SCALE: ColorScaleName = "YlOrRd";
