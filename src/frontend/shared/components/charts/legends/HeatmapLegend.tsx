// src/frontend/shared/components/charts/legends/HeatmapLegend.tsx
import * as d3 from "d3";
import React from "react";

interface HeatmapLegendProps {
  maxValue: number;
  colorScale?: (t: number) => string;
  compact?: boolean;
  colorScaleName?: string;
  setColorScale?: (s: string) => void;
  colorScaleOptions?: string[];
}

export const HeatmapLegend: React.FC<HeatmapLegendProps> = ({
  maxValue,
  colorScale,
  compact,
  colorScaleName,
  setColorScale,
  colorScaleOptions,
}) => {
  // D3 color scale
  const color = d3
    .scaleSequential(colorScale || d3.interpolateYlOrRd)
    .domain([0, maxValue]);
  // Render a horizontal SVG gradient legend
  const legendWidth = 200;
  const legendHeight = 22;
  const steps = 40;
  const midValue = Math.round(maxValue / 2);
  return (
    <div
      className={
        (compact ? "heatmap-legend-compact " : "") +
        "flex flex-col items-center gap-2 w-auto max-w-[340px] min-w-0"
      }
    >
      <div className="flex flex-row items-center gap-2 sm:gap-3 w-full justify-end">
        <span className="text-[13px] text-gray-700 min-w-[24px] text-right">
          Low
        </span>
        <div className="relative inline-block" style={{ width: legendWidth }}>
          <svg
            width={legendWidth}
            height={legendHeight}
            className="block rounded-lg border border-gray-300 bg-white shadow-sm"
          >
            {Array.from({ length: steps }).map((_, i) => {
              const t = i / (steps - 1);
              const val = t * maxValue;
              const key = `legend-${i}`;
              return (
                <rect
                  key={key}
                  x={(i * legendWidth) / steps}
                  y={0}
                  width={legendWidth / steps + 0.5}
                  height={legendHeight}
                  fill={color(val)}
                  stroke="none"
                />
              );
            })}
            {/* Tick marks */}
            {/* Min */}
            <rect x={0} y={legendHeight - 7} width={2} height={7} fill="#444" />
            {/* Mid */}
            <rect
              x={legendWidth / 2 - 1}
              y={legendHeight - 7}
              width={2}
              height={7}
              fill="#444"
            />
            {/* Max */}
            <rect
              x={legendWidth - 2}
              y={legendHeight - 7}
              width={2}
              height={7}
              fill="#444"
            />
          </svg>
          {/* Tick labels */}
          <div
            className="absolute left-0 w-full flex flex-row justify-between text-[12px] text-gray-700 pointer-events-none px-1"
            style={{ top: legendHeight + 1 }}
          >
            <span>0</span>
            <span>{midValue}</span>
            <span>{maxValue}</span>
          </div>
        </div>
        <span className="text-[13px] text-gray-700 min-w-[28px] text-left">
          High
        </span>
      </div>
      {colorScaleOptions && setColorScale && colorScaleName && (
        <div className="flex flex-row items-center mt-2 w-full justify-center">
          <span className="text-[14px] mr-2">Color:</span>
          <div className="flex flex-row gap-2 overflow-x-auto py-1">
            {colorScaleOptions.map((scale) => (
              <button
                key={scale}
                onClick={() => setColorScale(scale)}
                className={
                  "flex flex-col items-center border rounded-md px-1 py-0.5 min-w-[44px] " +
                  (colorScaleName === scale
                    ? "border-blue-600 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-blue-400")
                }
                style={{ background: "#fff" }}
                title={scale}
              >
                {/* Mini gradient preview */}
                <span
                  className="block w-8 h-3 rounded mb-0.5"
                  style={{
                    background: `linear-gradient(to right, ${new Array(8)
                      .fill(0)
                      .map((_, i) => {
                        // Use d3 to get the color for this scale
                        try {
                          const interpKey = `interpolate${
                            scale.charAt(0).toUpperCase() + scale.slice(1)
                          }`;
                          const d3Interp = (d3 as Record<string, unknown>)[
                            interpKey
                          ] as ((t: number) => string) | undefined;
                          const colorScaleFn = d3Interp ?? d3.interpolateYlOrRd;
                          return colorScaleFn(i / 7);
                        } catch {
                          return "#ccc";
                        }
                      })
                      .join(",")})`,
                  }}
                />
                <span className="text-[12px] text-gray-700">{scale}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatmapLegend;
