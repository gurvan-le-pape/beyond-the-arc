// src/frontend/shared/constants/courtConstants.ts
// FIBA court measurements (meters)
export const COURT_LENGTH = 28;
export const COURT_WIDTH = 15;
export const HALF_COURT_HEIGHT = 14;
export const BASELINE_TO_RIM = 1.575;
export const BASELINE_TO_BACKBOARD = 1.2;
export const RIM_RADIUS = 0.225;
export const BACKBOARD_WIDTH = 1.8;
export const PAINT_WIDTH = 4.9;
export const PAINT_HEIGHT = 5.8;
export const FREE_THROW_LINE_DIST = 5.8;
export const FREE_THROW_LINE_WIDTH = 3.6;
export const FREE_THROW_CIRCLE_RADIUS = 1.8;
export const NO_CHARGE_RADIUS = 1.25;
export const NO_CHARGE_LINE_LENGTH = 0.375;
export const NO_CHARGE_LINE_DIST = 1.2;
export const THREE_PT_RADIUS = 6.75;
export const THREE_PT_LINE_DIST = 0.9;
export const LINE_WIDTH = 0.05; // 5cm

// y-position where the arc starts curving
export const ARC_Y =
  BASELINE_TO_RIM +
  Math.sqrt(THREE_PT_RADIUS ** 2 - (COURT_WIDTH / 2 - THREE_PT_LINE_DIST) ** 2);

// x center of rim
export const BASKET_X = COURT_WIDTH / 2;
// y center of rim (from baseline)
export const BASKET_Y = BASELINE_TO_RIM;
// x position of left edge of paint
export const PAINT_X0 = (COURT_WIDTH - PAINT_WIDTH) / 2;
// x position of right edge of paint
export const PAINT_X1 = PAINT_X0 + PAINT_WIDTH;
