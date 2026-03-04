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
  <div className="w-full max-w-xl mx-auto bg-gray-50 rounded-xl shadow-sm p-4 flex flex-col gap-3 items-center">
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
