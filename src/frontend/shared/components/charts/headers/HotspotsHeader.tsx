// src/frontend/shared/components/charts/headers/HotspotsHeader.tsx
import React from "react";

import { HeatmapLegend } from "@/shared/components/charts";

interface HotspotsHeaderProps {
  colorScale: string;
  setColorScale: (s: string) => void;
  colorScaleOptions: string[];
  maxValue: number;
  colorScaleFn: (t: number) => string;
}

export const HotspotsHeader: React.FC<HotspotsHeaderProps> = ({
  colorScale,
  setColorScale,
  colorScaleOptions,
  maxValue,
  colorScaleFn,
}) => (
  <div className="w-full mb-2 rounded-xl px-4 py-3 bg-surface-raised dark:bg-surface-raised-dark border border-divide-light dark:border-divide-dark shadow-sm">
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

export default HotspotsHeader;
