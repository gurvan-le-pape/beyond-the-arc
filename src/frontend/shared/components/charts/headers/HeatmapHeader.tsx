// src/frontend/shared/components/charts/headers/HeatmapHeader.tsx
import React from "react";

import { HeatmapFilterBar, HeatmapLegend } from "@/shared/components/charts";
import type { ShotFilter } from "@/shared/constants";

interface HeatmapHeaderProps {
  shotFilter: ShotFilter;
  setShotFilter: (f: ShotFilter) => void;
  colorScale: string;
  setColorScale: (s: string) => void;
  colorScaleOptions: string[];
  maxValue: number;
  colorScaleFn: (t: number) => string;
}

export const HeatmapHeader: React.FC<HeatmapHeaderProps> = ({
  shotFilter,
  setShotFilter,
  colorScale,
  setColorScale,
  colorScaleOptions,
  maxValue,
  colorScaleFn,
}) => (
  <div className="w-full mb-2 rounded-xl px-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3">
    <HeatmapFilterBar shotFilter={shotFilter} setShotFilter={setShotFilter} />
    <HeatmapLegend
      maxValue={maxValue}
      colorScale={colorScaleFn}
      compact
      colorScaleName={colorScale}
      setColorScale={setColorScale}
      colorScaleOptions={colorScaleOptions}
    />
  </div>
);

export default HeatmapHeader;
