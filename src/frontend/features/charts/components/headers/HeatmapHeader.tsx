// src/frontend/features/charts/components/headers/HeatmapHeader.tsx
import React from "react";

import type { ShotFilter } from "../../constants";
import HeatmapFilterBar from "../filters/HeatmapFilterBar";
import HeatmapLegend from "../legends/HeatmapLegend";

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
  <div className="w-full mb-2 rounded-xl px-4 py-3 bg-surface-inset border border-divide shadow-sm flex flex-col gap-3">
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
