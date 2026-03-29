// src/frontend/shared/components/charts/legends/HeatmapLegend.tsx
import * as d3 from "d3";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("common");
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
        <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark shrink-0">
          {t("shotChart.low")}
        </span>
        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
          <div
            className="w-full h-4 rounded shadow-sm"
            style={{
              background: `linear-gradient(to right, ${activeGradient})`,
            }}
          />
          <div className="flex justify-between text-[11px] text-text-muted dark:text-text-muted-dark px-0.5">
            <span>0</span>
            <span>{midValue}</span>
            <span>{maxValue}</span>
          </div>
        </div>
        <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark shrink-0">
          {t("shotChart.high")}
        </span>
      </div>

      {/* Color scale picker */}
      {colorScaleOptions && setColorScale && colorScaleName && (
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-text-secondary dark:text-text-secondary-dark shrink-0">
            {t("shotChart.color")}
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
                        ? "border-primary-500 dark:border-primary-400 ring-2 ring-primary-100 dark:ring-primary-900 bg-primary-50 dark:bg-primary-950"
                        : "border-divide-light dark:border-divide-dark hover:border-divide-dark dark:hover:border-text-muted-dark bg-white dark:bg-surface-subtle-dark"
                    }
                  `}
                >
                  <span
                    className="block w-8 h-2.5 rounded-sm"
                    style={{
                      background: `linear-gradient(to right, ${gradient})`,
                    }}
                  />
                  <span className="text-[11px] text-text-body dark:text-text-body-dark leading-none">
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
