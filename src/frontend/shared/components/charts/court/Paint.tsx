// src/frontend/shared/components/charts/court/Paint.tsx
import React from "react";

import { COURT_WIDTH, LINE_WIDTH } from "@/shared/constants";

/**
 * Paint (restricted area) component for FIBA half-court.
 * Draws the rectangular paint area under the basket.
 *
 * @param paintLeft - SVG x position of left edge
 * @param paintRight - SVG x position of right edge
 * @param paintTopY - SVG y position of top edge
 * @param paintBottomY - SVG y position of bottom edge
 * @param svgWidth - SVG width for scaling
 */
export interface PaintProps {
  paintLeft: number;
  paintRight: number;
  paintTopY: number;
  paintBottomY: number;
  svgWidth: number;
}

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
