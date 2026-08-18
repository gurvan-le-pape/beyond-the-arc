// src/frontend/features/charts/components/overlays/HeatmapOverlay.tsx
"use client";

// HeatmapOverlay: React component for rendering a binned heatmap overlay (SVG) with interactive tooltips.
// Uses D3 for color scaling and supports filtering by shot type (made/missed/all).
import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { useMemo, useState } from "react";

import { ShotFilter } from "../../constants";
import HeatmapCell from "./HeatmapCell";
import type { TooltipState } from "./TooltipContent";
import TooltipContent from "./TooltipContent";

// Props for HeatmapOverlay
interface HeatmapOverlayProps {
  // 2D array of binned shot data per cell
  heatmapData: { made: number; missed: number; total: number }[][];
  // Which shot type to visualize (affects color intensity and tooltip)
  shotFilter: ShotFilter;
  // Scales to convert court coordinates to SVG coordinates
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  // Cell size in meters
  cellWidth: number;
  cellHeight: number;
  // Maximum value for color scaling (precomputed for performance)
  maxValue: number;
  // Optional: custom color scale (defaults to interpolateYlOrRd)
  colorScale?: (t: number) => string;
}

// Selects the value to visualize for a cell based on the current filter.
function getCellValue(
  cell: { made: number; missed: number; total: number },
  shotFilter: ShotFilter,
) {
  if (shotFilter === ShotFilter.MADE) return cell.made;
  if (shotFilter === ShotFilter.MISSED) return cell.missed;
  return cell.total;
}

/**
 * Binned heatmap of shot density — one coloured cell per grid bin.
 *
 * Zero-shot cells render nothing, and the colour domain is fixed to
 * `0..maxValue`, which the caller must precompute across the whole grid so the
 * same value means the same colour everywhere.
 */
export function HeatmapOverlay({
  heatmapData,
  shotFilter,
  xScale,
  yScale,
  cellWidth,
  cellHeight,
  maxValue,
  colorScale,
}: HeatmapOverlayProps) {
  // Memoize the 2D array of values to display (avoids unnecessary recalculation)
  const heatmapOverlayData = useMemo(
    () =>
      heatmapData.map((row) =>
        row.map((cell) => getCellValue(cell, shotFilter)),
      ),
    [heatmapData, shotFilter],
  );

  // Tooltip state: stores info about the currently hovered cell (or null if none)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // D3 color scale for cell fill (default: YlOrRd, can be overridden by prop)
  const color = scaleSequential(colorScale || interpolateYlOrRd).domain([
    0,
    maxValue,
  ]);

  return (
    <>
      {/* Render SVG rects for each nonzero cell. Each cell is colored by value and filter. */}
      <g>
        {heatmapOverlayData.map((row, i) =>
          row.map((value, j) => {
            if (value === 0) return null; // Hide cells with zero shots for clarity
            const x = j * cellWidth;
            const y = i * cellHeight;
            const isHighlighted =
              tooltip && tooltip.cellRow === i && tooltip.cellCol === j;
            return (
              <HeatmapCell
                key={`${i}-${j}`}
                x={xScale(x)}
                y={yScale(y + cellHeight)}
                width={xScale(x + cellWidth) - xScale(x)}
                height={yScale(y) - yScale(y + cellHeight)}
                fill={color(value)}
                fillOpacity={0.6}
                stroke={isHighlighted ? "#222" : "none"}
                strokeWidth={isHighlighted ? 1.5 : 0}
                onMouseMove={(e) => {
                  const cell = heatmapData[i]?.[j] || {
                    made: 0,
                    missed: 0,
                    total: 0,
                  };
                  const fg =
                    cell.total > 0
                      ? Math.round((cell.made / cell.total) * 100)
                      : null;
                  setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    made: cell.made,
                    missed: cell.missed,
                    total: cell.total,
                    fg,
                    cellRow: i,
                    cellCol: j,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "pointer", pointerEvents: "all" }}
              />
            );
          }),
        )}
      </g>
      {/* Render tooltip as a React portal (absolutely positioned, outside SVG) */}
      {tooltip &&
        typeof globalThis.window === "object" &&
        globalThis.window &&
        typeof globalThis.document === "object" &&
        globalThis.document && (
          <TooltipContent tooltip={tooltip} shotFilter={shotFilter} />
        )}
    </>
  );
}

export default HeatmapOverlay;
