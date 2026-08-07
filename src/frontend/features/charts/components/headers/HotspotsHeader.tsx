// src/frontend/features/charts/components/headers/HotspotsHeader.tsx
import React from "react";

import type { ColorScaleName } from "../../constants";
import HeatmapLegend from "../legends/HeatmapLegend";

interface HotspotsHeaderProps {
  colorScale: ColorScaleName;
  setColorScale: (s: ColorScaleName) => void;
  colorScaleOptions: readonly ColorScaleName[];
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
  <div className="w-full mb-2 rounded-xl px-4 py-3 bg-surface-inset border border-divide shadow-sm">
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
