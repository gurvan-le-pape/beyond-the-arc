// src/frontend/features/shot-chart/utils/getTooltipPosition.ts
// getTooltipPosition: Utility to compute the best position for a floating tooltip
// given mouse coordinates, tooltip size, and window size.
/**
 * Places a tooltip next to (x, y), clamped so it stays fully on screen — when
 * it would overflow the right or bottom edge it is moved back inside.
 *
 * Outside a browser the window is assumed to be 1920×1080, so in SSR or tests
 * the clamp can land a tooltip off-screen rather than at the cursor.
 *
 * @returns viewport coordinates for the tooltip, nudged so it stays on screen near an edge
 *
 * @param x - cursor x in viewport coordinates
 * @param y - cursor y in viewport coordinates
 * @param tooltipWidth - the tooltip's width, used for the right-edge clamp
 * @param tooltipHeight - the tooltip's height, used for the bottom-edge clamp
 * @param padding - gap kept between the tooltip and the viewport edge
 * @param winW - viewport width; outside a browser it defaults to 1920
 * @param winH - viewport height; outside a browser it defaults to 1080
 */
export function getTooltipPosition(
  x: number,
  y: number,
  tooltipWidth: number = 240,
  tooltipHeight: number = 110,
  padding: number = 12,
  winW?: number,
  winH?: number,
): { left: number; top: number } {
  // Use provided window size or fallback to globalThis.window or defaults
  let windowWidth: number;
  if (typeof winW === "number") {
    windowWidth = winW;
  } else if (typeof globalThis.window === "object" && globalThis.window) {
    windowWidth = globalThis.window.innerWidth;
  } else {
    windowWidth = 1920;
  }

  let windowHeight: number;
  if (typeof winH === "number") {
    windowHeight = winH;
  } else if (typeof globalThis.window === "object" && globalThis.window) {
    windowHeight = globalThis.window.innerHeight;
  } else {
    windowHeight = 1080;
  }
  let left = x + padding;
  let top = y + padding;
  if (left + tooltipWidth > windowWidth)
    left = windowWidth - tooltipWidth - padding;
  if (top + tooltipHeight > windowHeight)
    top = windowHeight - tooltipHeight - padding;
  if (left < 0) left = padding;
  if (top < 0) top = padding;
  return { left, top };
}
