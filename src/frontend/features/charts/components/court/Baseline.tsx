// src/frontend/features/charts/components/court/Baseline.tsx

import { COURT_WIDTH, LINE_WIDTH } from "../../constants";

interface BaselineProps {
  /** Chart width in SVG pixels; also scales the stroke. */
  readonly svgWidth: number;
  /** Vertical position, already in SVG pixels — the caller applies `yScale`. */
  readonly y: number;
}

/**
 * The baseline — the endline under the basket, the near edge of a half-court
 * render (the rim sits `BASELINE_TO_RIM` inside it). Drawn at `yScale(0)`, the
 * bottom of the chart. The line at the far end, `yScale(HALF_COURT_HEIGHT)`,
 * is `CenterLine`'s job — see `CourtBoundary`.
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
