// src/frontend/features/charts/components/legends/HeatmapLegend.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Text } from "@/shared/components/typography";

import { SHOT_COLOR_SCALE } from "../../constants";

interface HeatmapLegendProps {
  readonly maxValue: number;
  readonly compact?: boolean;
}

const GRADIENT_STEPS = 32;

function buildGradient(interpolate: (t: number) => string): string {
  return Array.from({ length: GRADIENT_STEPS }, (_, i) =>
    interpolate(i / (GRADIENT_STEPS - 1)),
  ).join(",");
}

/**
 * The colour legend of the heatmap and hotspots charts: the gradient from no
 * shot to the busiest cell or zone.
 *
 * Only the two ends are labelled. A middle tick would be a rounded count
 * printed at an exact midpoint: with a maximum of 3, "2" where the colour
 * means 1.5.
 */
export function HeatmapLegend({ maxValue, compact }: HeatmapLegendProps) {
  const t = useTranslations("common");
  const gradient = React.useMemo(() => buildGradient(SHOT_COLOR_SCALE), []);

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
            style={{ background: `linear-gradient(to right, ${gradient})` }}
          />
          <div className="flex justify-between text-[11px] text-text-secondary px-0.5">
            <span>0</span>
            <span>{maxValue}</span>
          </div>
        </div>
        <Text variant="caption" as="span" className="font-medium shrink-0">
          {t("shotChart.high")}
        </Text>
      </div>
    </div>
  );
}

export default HeatmapLegend;
