// src/frontend/shared/components/charts/utils/getTooltipPosition.ts
// getTooltipPosition: Utility to compute the best position for a floating tooltip
// given mouse coordinates, tooltip size, and window size.
// Can be used in overlays or any component needing smart tooltip placement.
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
