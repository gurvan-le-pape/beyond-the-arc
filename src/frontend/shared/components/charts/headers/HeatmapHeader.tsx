// src/frontend/shared/components/charts/headers/HeatmapHeader.tsx
import React from "react";

import { HeatmapFilterBar, HeatmapLegend } from "@/shared/components/charts";

interface HeatmapHeaderProps {
  shotFilter: "all" | "made" | "missed";
  setShotFilter: (f: "all" | "made" | "missed") => void;
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
  <div className="w-full max-w-xl mx-auto bg-gray-50 rounded-xl shadow-sm p-4 flex flex-col gap-3 items-center">
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
