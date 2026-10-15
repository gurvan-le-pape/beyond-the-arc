// src/frontend/features/charts/components/court/BoundaryRect.tsx

import { COURT_WIDTH, LINE_WIDTH } from "../../constants";

interface BoundaryRectProps {
  /** Chart width in SVG pixels; also scales the stroke. */
  readonly svgWidth: number;
  /** Chart height in SVG pixels. */
  readonly svgHeight: number;
}

/**
 * Draws the outer boundary rectangle of the court.
 */
export function BoundaryRect({ svgWidth, svgHeight }: BoundaryRectProps) {
  return (
    <rect
      x={0}
      y={0}
      width={svgWidth}
      height={svgHeight}
      fill="none"
      className="stroke-court-line"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
  );
}

export default BoundaryRect;
