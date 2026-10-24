// src/frontend/features/shot-chart/components/court/ThreePointArc.tsx

import { ARC_Y, LINE_WIDTH } from "../../constants";

interface ThreePointArcProps {
  /** Court units to SVG pixels, horizontally. */
  readonly xScale: (x: number) => number;
  /** Court units to SVG pixels, vertically. */
  readonly yScale: (y: number) => number;
  /** Chart width; scales the stroke so line weight stays proportional. */
  readonly svgWidth: number;
  /**
   * Court width in metres. A **parameter** despite the constant-style name —
   * this and the two below are passed in, unlike every other court part, which
   * reads the same values from the shared constants.
   */
  readonly COURT_WIDTH: number;
  /** Arc radius in metres. Passed in, not imported — see above. */
  readonly THREE_PT_RADIUS: number;
  /** Sideline-to-arc-endpoint distance in metres. Passed in, not imported. */
  readonly THREE_PT_LINE_DIST: number;
}

/** The three-point arc and the two side lines running from its endpoints to the baseline. */
export function ThreePointArc({
  xScale,
  yScale,
  svgWidth,
  COURT_WIDTH,
  THREE_PT_RADIUS,
  THREE_PT_LINE_DIST,
}: ThreePointArcProps) {
  const arcRadiusPx = xScale(THREE_PT_RADIUS) - xScale(0);
  const xLeft_m = THREE_PT_LINE_DIST;
  const xRight_m = COURT_WIDTH - THREE_PT_LINE_DIST;
  const y_m = ARC_Y;
  const xLeft_px = xScale(xLeft_m);
  const xRight_px = xScale(xRight_m);
  const y_px = yScale(y_m);
  // Manual SVG arc path
  const arcPath = `M ${xLeft_px},${y_px} A ${arcRadiusPx},${arcRadiusPx} 0 0 1 ${xRight_px},${y_px}`;
  return (
    <>
      <path
        d={arcPath}
        fill="none"
        className="stroke-court-line"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
      {/* 3pt lines (side) */}
      <line
        x1={xScale(THREE_PT_LINE_DIST)}
        x2={xScale(THREE_PT_LINE_DIST)}
        y1={yScale(0)}
        y2={y_px}
        className="stroke-court-line"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
      <line
        x1={xScale(COURT_WIDTH - THREE_PT_LINE_DIST)}
        x2={xScale(COURT_WIDTH - THREE_PT_LINE_DIST)}
        y1={yScale(0)}
        y2={y_px}
        className="stroke-court-line"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
    </>
  );
}

export default ThreePointArc;
