// src/frontend/features/charts/components/legends/HeatmapLegend.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { SegmentedControl } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import type { ColorScaleName } from "../../constants";
import { COLOR_SCALES, DEFAULT_COLOR_SCALE } from "../../constants";

interface HeatmapLegendProps {
  readonly maxValue: number;
  readonly colorScale?: (t: number) => string;
  readonly compact?: boolean;
  readonly colorScaleName?: ColorScaleName;
  readonly setColorScale?: (s: ColorScaleName) => void;
  readonly colorScaleOptions?: readonly ColorScaleName[];
}

const GRADIENT_STEPS = 32;

function buildGradient(interpolate: (t: number) => string): string {
  return Array.from({ length: GRADIENT_STEPS }, (_, i) =>
    interpolate(i / (GRADIENT_STEPS - 1)),
  ).join(",");
}

/**
 * Gradient legend for a heatmap or hotspots fill, from 0 to `maxValue`, with
 * an optional colour-scale picker.
 *
 * The picker renders only when `colorScaleName`, `setColorScale` and
 * `colorScaleOptions` are all present — passing some but not others hides it
 * silently. `colorScale` (the resolved interpolator) wins over `colorScaleName`
 * when both are given.
 */
export function HeatmapLegend({
  maxValue,
  colorScale,
  compact,
  colorScaleName,
  setColorScale,
  colorScaleOptions,
}: HeatmapLegendProps) {
  const t = useTranslations("common");
  const midValue = Math.round(maxValue / 2);

  // `colorScale` first: both call sites already pass the resolved interpolator
  // alongside its name, so preferring the name here would recompute what is
  // sitting unread in props.
  const activeGradient = React.useMemo(
    () =>
      buildGradient(
        colorScale ??
          COLOR_SCALES[colorScaleName ?? DEFAULT_COLOR_SCALE] ??
          COLOR_SCALES[DEFAULT_COLOR_SCALE],
      ),
    [colorScale, colorScaleName],
  );

  return (
    <div className={`flex flex-col gap-3 w-full ${compact ? "" : "max-w-sm"}`}>
      {/* Names the quantity the colour encodes. On hotspots the zone labels
          print FG%, a different quantity from the fill — without this, the two
          are indistinguishable. */}
      <Text variant="caption" as="p" className="text-text-secondary">
        {t("shotChart.colorMeaning")}
      </Text>

      <div className="flex items-center gap-3 w-full">
        <Text variant="caption" as="span" className="font-medium shrink-0">
          {t("shotChart.low")}
        </Text>
        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
          <div
            className="w-full h-4 rounded shadow-sm"
            style={{
              background: `linear-gradient(to right, ${activeGradient})`,
            }}
          />
          <div className="flex justify-between text-[11px] text-text-secondary px-0.5">
            <span>0</span>
            <span>{midValue}</span>
            <span>{maxValue}</span>
          </div>
        </div>
        <Text variant="caption" as="span" className="font-medium shrink-0">
          {t("shotChart.high")}
        </Text>
      </div>

      {colorScaleOptions && setColorScale && colorScaleName && (
        <div className="flex items-center gap-2 w-full">
          <Text variant="caption" as="span" className="shrink-0">
            {t("shotChart.color")}
          </Text>
          <SegmentedControl
            label={t("shotChart.color")}
            size="sm"
            value={colorScaleName}
            onChange={setColorScale}
            options={colorScaleOptions.map((scale) => ({
              value: scale,
              label: (
                <span className="flex flex-col items-center gap-0.5">
                  <span
                    aria-hidden="true"
                    className="block w-8 h-2.5 rounded-sm"
                    style={{
                      background: `linear-gradient(to right, ${buildGradient(COLOR_SCALES[scale])})`,
                    }}
                  />
                  {scale}
                </span>
              ),
            }))}
          />
        </div>
      )}
    </div>
  );
}

export default HeatmapLegend;
