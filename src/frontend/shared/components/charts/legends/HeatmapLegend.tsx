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

const GRADIENT_STEPS = 32;

function buildGradient(scaleName: string): string {
  const interpKey = `interpolate${
    scaleName.charAt(0).toUpperCase() + scaleName.slice(1)
  }`;
  const fn = (d3 as Record<string, unknown>)[interpKey] as
    | ((t: number) => string)
    | undefined;
  const interp = fn ?? d3.interpolateYlOrRd;
  return Array.from({ length: GRADIENT_STEPS }, (_, i) =>
    interp(i / (GRADIENT_STEPS - 1)),
  ).join(",");
}

export const HeatmapLegend: React.FC<HeatmapLegendProps> = ({
  maxValue,
  colorScale,
  compact,
  colorScaleName,
  setColorScale,
  colorScaleOptions,
}) => {
  const midValue = Math.round(maxValue / 2);

  const activeGradient = React.useMemo(() => {
    if (colorScaleName) return buildGradient(colorScaleName);
    if (colorScale) {
      return Array.from({ length: GRADIENT_STEPS }, (_, i) =>
        colorScale(i / (GRADIENT_STEPS - 1)),
      ).join(",");
    }
    return buildGradient("YlOrRd");
  }, [colorScaleName, colorScale]);

  return (
    <div className={`flex flex-col gap-3 w-full ${compact ? "" : "max-w-sm"}`}>
      {/* Gradient bar */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
          Low
        </span>
        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
          <div
            className="w-full h-4 rounded shadow-sm"
            style={{
              background: `linear-gradient(to right, ${activeGradient})`,
            }}
          />
          <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500 px-0.5">
            <span>0</span>
            <span>{midValue}</span>
            <span>{maxValue}</span>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
          High
        </span>
      </div>

      {/* Color scale picker */}
      {colorScaleOptions && setColorScale && colorScaleName && (
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
            Color
          </span>
          <div className="flex flex-row gap-1.5 flex-wrap">
            {colorScaleOptions.map((scale) => {
              const gradient = buildGradient(scale);
              const isActive = colorScaleName === scale;
              return (
                <button
                  key={scale}
                  onClick={() => setColorScale(scale)}
                  title={scale}
                  className={`
                    flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg border transition-all
                    ${
                      isActive
                        ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-100 dark:ring-blue-900 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 bg-white dark:bg-gray-800"
                    }
                  `}
                >
                  <span
                    className="block w-8 h-2.5 rounded-sm"
                    style={{
                      background: `linear-gradient(to right, ${gradient})`,
                    }}
                  />
                  <span className="text-[11px] text-gray-600 dark:text-gray-300 leading-none">
                    {scale}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatmapLegend;
