// src/frontend/shared/components/charts/court/PaintTicks.tsx
import React from "react";

import { COURT_WIDTH, LINE_WIDTH } from "@/shared/constants";

/**
 * PaintTicks component draws the tick marks and blocks on the paint (restricted area).
 *
 * @param xLeft_px - SVG x position of left paint edge
 * @param xRight_px - SVG x position of right paint edge
 * @param tickLength_px - length of tick marks in SVG units
 * @param tickYs - array of y positions for tick marks
 * @param yScale - d3 scale function for y
 * @param svgWidth - SVG width for scaling
 * @param blockY - y position of block start
 * @param blockHeight - height of block
 */
export interface PaintTicksProps {
  xLeft_px: number;
  xRight_px: number;
  tickLength_px: number;
  tickYs: number[];
  yScale: (y: number) => number;
  svgWidth: number;
  blockY: number;
  blockHeight: number;
}

export const PaintTicks: React.FC<PaintTicksProps> = ({
  xLeft_px,
  xRight_px,
  tickLength_px,
  tickYs,
  yScale,
  svgWidth,
  blockY,
  blockHeight,
}) => {
  // Block (rectangle) at low post
  const blockY_px = yScale(blockY + blockHeight); // SVG y is inverted
  const blockYStart_px = yScale(blockY);
  return (
    <g>
      {/* Tick marks */}
      {tickYs.map((y) => {
        const y_px = yScale(y);
        return (
          <g key={`tick-${y}`}>
            {/* Left tick */}
            <line
              x1={xLeft_px}
              y1={y_px}
              x2={xLeft_px - tickLength_px}
              y2={y_px}
              stroke="#000"
              strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
            />
            {/* Right tick */}
            <line
              x1={xRight_px}
              y1={y_px}
              x2={xRight_px + tickLength_px}
              y2={y_px}
              stroke="#000"
              strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
            />
          </g>
        );
      })}
      {/* Left block */}
      <rect
        x={xLeft_px - tickLength_px}
        y={blockY_px}
        width={tickLength_px}
        height={blockYStart_px - blockY_px}
        fill="#000"
      />
      {/* Right block */}
      <rect
        x={xRight_px}
        y={blockY_px}
        width={tickLength_px}
        height={blockYStart_px - blockY_px}
        fill="#000"
      />
    </g>
  );
};

export default PaintTicks;
