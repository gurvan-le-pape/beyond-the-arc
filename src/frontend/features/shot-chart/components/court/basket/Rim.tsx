// src/frontend/features/shot-chart/components/court/basket/Rim.tsx

import { COURT_WIDTH, LINE_WIDTH, RIM_RADIUS } from "../../../constants";

interface RimProps {
  readonly centerX: number;
  readonly rimY: number;
  readonly xScale: (x: number) => number;
  readonly svgWidth: number;
}

/**
 * The rim, as a circle of the regulation radius centred on the basket.
 *
 * Takes `centerX` and `rimY` **already in SVG pixels** but `xScale` for the
 * radius, because a radius is a length rather than a position and must be
 * converted from court units. Mixing those two spaces up is the usual reason a
 * rim renders at the wrong size but the right place.
 */
export function Rim({ centerX, rimY, xScale, svgWidth }: RimProps) {
  return (
    <circle
      cx={centerX}
      cy={rimY}
      r={xScale(RIM_RADIUS) - xScale(0)}
      fill="none"
      className="stroke-court-line"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
  );
}
