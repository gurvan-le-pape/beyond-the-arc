// src/frontend/features/charts/components/court/Paint.tsx
import React from "react";

import { COURT_WIDTH, LINE_WIDTH } from "../../constants";

interface PaintProps {
  /** Left edge, already in SVG pixels — the caller applies the scale. */
  readonly paintLeft: number;
  /** Right edge, already in SVG pixels — the caller applies the scale. */
  readonly paintRight: number;
  /** Top edge, already in SVG pixels — the caller applies the scale. */
  readonly paintTopY: number;
  /** Bottom edge, already in SVG pixels — the caller applies the scale. */
  readonly paintBottomY: number;
  /** Chart width; scales the stroke so line weight stays proportional. */
  readonly svgWidth: number;
}

/**
 * The paint, drawn as an unfilled rectangle from four edges.
 *
 * **Receives its edges already in SVG pixels**, unlike the court parts that
 * take scale functions and convert internally. The caller owns the conversion
 * here, so passing court units silently draws a rectangle a few pixels wide in
 * the corner rather than failing.
 */
export const Paint: React.FC<PaintProps> = ({
  paintLeft,
  paintRight,
  paintTopY,
  paintBottomY,
  svgWidth,
}) => (
  <rect
    x={paintLeft}
    y={paintTopY}
    width={paintRight - paintLeft}
    height={paintBottomY - paintTopY}
    fill="none"
    stroke="#000"
    strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
  />
);

export default Paint;
