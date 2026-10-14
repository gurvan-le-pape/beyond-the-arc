// src/frontend/features/charts/components/court/CourtMarkings.tsx
import type { ScaleLinear } from "d3-scale";

import {
  BASELINE_TO_RIM,
  COURT_WIDTH,
  FREE_THROW_LINE_DIST,
  NO_CHARGE_LINE_DIST,
  NO_CHARGE_LINE_LENGTH,
  PAINT_HEIGHT,
  PAINT_WIDTH,
  THREE_PT_LINE_DIST,
  THREE_PT_RADIUS,
} from "../../constants";
import Basket from "./Basket";
import CentreCircle from "./CentreCircle";
import CourtBoundary from "./CourtBoundary";
import FreeThrow from "./FreeThrow";
import NoCharge from "./NoCharge";
import Paint from "./Paint";
import PaintTicks from "./PaintTicks";
import ThreePointArc from "./ThreePointArc";

interface CourtMarkingsProps {
  /** Court metres across to pixels. */
  readonly xScale: ScaleLinear<number, number>;
  /** Court metres from the baseline to pixels, the baseline at the bottom. */
  readonly yScale: ScaleLinear<number, number>;
  readonly svgWidth: number;
  readonly svgHeight: number;
}

// The lane's tick marks and block, in metres from the baseline (FIBA).
const TICK_LENGTH = 0.1;
const TICK_1_Y = 1.75;
const BLOCK_Y = TICK_1_Y + 0.85;
const BLOCK_HEIGHT = 0.4;
const TICK_2_Y = BLOCK_Y + BLOCK_HEIGHT + 0.85;
const TICK_3_Y = TICK_2_Y + 0.85;

/**
 * The lines of a FIBA half court: boundary, paint and its ticks, basket, free
 * throw, no-charge arc, centre circle and three-point line.
 *
 * Drawn after a chart's overlay, so that the lines stay on top of the shots.
 */
export function CourtMarkings({
  xScale,
  yScale,
  svgWidth,
  svgHeight,
}: CourtMarkingsProps) {
  const centerX = xScale(COURT_WIDTH / 2);
  const paintLeft = xScale((COURT_WIDTH - PAINT_WIDTH) / 2);
  const paintRight = xScale((COURT_WIDTH + PAINT_WIDTH) / 2);
  const rimY = yScale(BASELINE_TO_RIM);

  return (
    <>
      <CourtBoundary
        svgWidth={svgWidth}
        svgHeight={svgHeight}
        yScale={yScale}
      />
      <Paint
        paintLeft={paintLeft}
        paintRight={paintRight}
        paintTopY={yScale(PAINT_HEIGHT)}
        paintBottomY={yScale(0)}
        svgWidth={svgWidth}
      />
      <Basket
        centerX={centerX}
        rimY={rimY}
        xScale={xScale}
        yScale={yScale}
        svgWidth={svgWidth}
      />
      <FreeThrow
        centerX={centerX}
        ftLineY={yScale(FREE_THROW_LINE_DIST)}
        xScale={xScale}
        svgWidth={svgWidth}
      />
      <NoCharge
        centerX={centerX}
        rimY={rimY}
        ncLineY1={yScale(NO_CHARGE_LINE_DIST)}
        ncLineY2={yScale(NO_CHARGE_LINE_DIST + NO_CHARGE_LINE_LENGTH)}
        xScale={xScale}
        svgWidth={svgWidth}
      />
      <PaintTicks
        xLeft_px={paintLeft}
        xRight_px={paintRight}
        tickLength_px={xScale(TICK_LENGTH) - xScale(0)}
        tickYs={[TICK_1_Y, TICK_2_Y, TICK_3_Y]}
        yScale={yScale}
        svgWidth={svgWidth}
        blockY={BLOCK_Y}
        blockHeight={BLOCK_HEIGHT}
      />
      <CentreCircle centerX={centerX} xScale={xScale} svgWidth={svgWidth} />
      <ThreePointArc
        xScale={xScale}
        yScale={yScale}
        svgWidth={svgWidth}
        COURT_WIDTH={COURT_WIDTH}
        THREE_PT_RADIUS={THREE_PT_RADIUS}
        THREE_PT_LINE_DIST={THREE_PT_LINE_DIST}
      />
    </>
  );
}

export default CourtMarkings;
