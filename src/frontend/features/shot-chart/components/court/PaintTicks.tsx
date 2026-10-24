// src/frontend/features/shot-chart/components/court/PaintTicks.tsx

import { COURT_WIDTH, LINE_WIDTH } from "../../constants";

interface PaintTicksProps {
  /** Left paint edge, in SVG pixels — the `_px` suffix is the unit, and load-bearing. */
  readonly xLeft_px: number;
  /** Right paint edge, in SVG pixels. */
  readonly xRight_px: number;
  /** Tick length in SVG pixels, so ticks keep their proportion at any chart size. */
  readonly tickLength_px: number;
  /** Tick heights in **court units** — unlike the `_px` props above, these go through `yScale`. */
  readonly tickYs: number[];
  /** Court units to SVG pixels, vertically. */
  readonly yScale: (y: number) => number;
  /** Chart width; scales the stroke so line weight stays proportional. */
  readonly svgWidth: number;
  /** Block start, in court units. */
  readonly blockY: number;
  /** Block height, in court units. */
  readonly blockHeight: number;
}

/**
 * Tick marks along the paint edges and the low-post block rectangles — the
 * name says ticks, but the blocks are drawn here too.
 */
export function PaintTicks({
  xLeft_px,
  xRight_px,
  tickLength_px,
  tickYs,
  yScale,
  svgWidth,
  blockY,
  blockHeight,
}: PaintTicksProps) {
  // Block (rectangle) at low post
  const blockY_px = yScale(blockY + blockHeight); // SVG y is inverted
  const blockYStart_px = yScale(blockY);
  return (
    <g>
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
              className="stroke-court-line"
              strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
            />
            {/* Right tick */}
            <line
              x1={xRight_px}
              y1={y_px}
              x2={xRight_px + tickLength_px}
              y2={y_px}
              className="stroke-court-line"
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
        className="fill-court-line"
      />
      {/* Right block */}
      <rect
        x={xRight_px}
        y={blockY_px}
        width={tickLength_px}
        height={blockYStart_px - blockY_px}
        className="fill-court-line"
      />
    </g>
  );
}

export default PaintTicks;
