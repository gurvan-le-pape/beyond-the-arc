// src/frontend/features/charts/components/court/FreeThrow.tsx
import { arc } from "d3-shape";

import {
  COURT_WIDTH,
  FREE_THROW_CIRCLE_RADIUS,
  FREE_THROW_LINE_WIDTH,
  LINE_WIDTH,
} from "../../constants";

interface FreeThrowProps {
  /** Court centre, already in SVG pixels — the caller applies the scale. */
  readonly centerX: number;
  /** The free-throw line's height, already in SVG pixels — the caller applies the scale. */
  readonly ftLineY: number;
  /** Court units to SVG pixels — used for the half-width and arc radius, which are lengths rather than positions. */
  readonly xScale: (x: number) => number;
  /** Chart width; scales the stroke so line weight stays proportional. */
  readonly svgWidth: number;
}

/** The free-throw line and its semi-circle. */
export function FreeThrow({
  centerX,
  ftLineY,
  xScale,
  svgWidth,
}: FreeThrowProps) {
  return (
    <g>
      {/* Free-throw line */}
      <line
        x1={centerX - xScale(FREE_THROW_LINE_WIDTH / 2) + xScale(0)}
        x2={centerX + xScale(FREE_THROW_LINE_WIDTH / 2) - xScale(0)}
        y1={ftLineY}
        y2={ftLineY}
        stroke="#000"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
      {/* Free-throw semi-circle */}
      <path
        d={
          arc()({
            innerRadius: xScale(FREE_THROW_CIRCLE_RADIUS) - xScale(0),
            outerRadius: xScale(FREE_THROW_CIRCLE_RADIUS) - xScale(0),
            startAngle: -Math.PI / 2,
            endAngle: Math.PI / 2,
          }) ?? undefined
        }
        transform={`translate(${centerX},${ftLineY})`}
        fill="none"
        stroke="#000"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
    </g>
  );
}

export default FreeThrow;
