// src/frontend/features/charts/components/court/Baseline.tsx

import { COURT_WIDTH, LINE_WIDTH } from "../../constants";

interface BaselineProps {
  /** Chart width in SVG pixels; also scales the stroke. */
  readonly svgWidth: number;
  /** Vertical position, already in SVG pixels — the caller applies `yScale`. */
  readonly y: number;
}

/**
 * The baseline — the court's far edge, spanning the full chart width.
 *
 * On a half-court render this coincides with `CenterLine`: both draw at
 * `yScale(0)`, so the two overlap exactly.
 */
export function Baseline({ svgWidth, y }: BaselineProps) {
  return (
    <line
      x1={0}
      y1={y}
      x2={svgWidth}
      y2={y}
      stroke="#000"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
  );
}

export default Baseline;
