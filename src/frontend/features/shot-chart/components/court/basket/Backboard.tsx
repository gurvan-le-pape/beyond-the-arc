// src/frontend/features/shot-chart/components/court/basket/Backboard.tsx

import {
  BACKBOARD_WIDTH,
  BASELINE_TO_BACKBOARD,
  COURT_WIDTH,
  LINE_WIDTH,
} from "../../../constants";

interface BackboardProps {
  readonly xScale: (x: number) => number;
  readonly yScale: (y: number) => number;
  readonly svgWidth: number;
}

/**
 * The backboard line, centred on the court and set back from the baseline by
 * the FIBA distance.
 *
 * Takes **scale functions, not pixels** — the court dimensions are read from
 * constants and converted here, unlike `Paint`, which receives its edges
 * already scaled. Stroke weight is derived from `svgWidth` so the line stays
 * proportionally thin at any chart size.
 */
export function Backboard({ xScale, yScale, svgWidth }: BackboardProps) {
  return (
    <line
      x1={xScale(COURT_WIDTH / 2 - BACKBOARD_WIDTH / 2)}
      x2={xScale(COURT_WIDTH / 2 + BACKBOARD_WIDTH / 2)}
      y1={yScale(BASELINE_TO_BACKBOARD)}
      y2={yScale(BASELINE_TO_BACKBOARD)}
      className="stroke-court-line"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
  );
}
