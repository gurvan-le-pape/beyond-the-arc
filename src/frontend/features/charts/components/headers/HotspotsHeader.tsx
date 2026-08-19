// src/frontend/features/charts/components/headers/HotspotsHeader.tsx

import type { ColorScaleName } from "../../constants";
import HeatmapLegend from "../legends/HeatmapLegend";

interface HotspotsHeaderProps {
  colorScale: ColorScaleName;
  setColorScale: (s: ColorScaleName) => void;
  colorScaleOptions: readonly ColorScaleName[];
  maxValue: number;
  colorScaleFn: (t: number) => string;
}

/**
 * The controls above a hotspots chart: the colour-scale picker alone.
 *
 * There is no shot filter here, and its absence is the point — hotspot zones
 * are shaded by attempt volume, so filtering to makes or misses would leave the
 * colours unchanged and the chart lying.
 */
export function HotspotsHeader({
  colorScale,
  setColorScale,
  colorScaleOptions,
  maxValue,
  colorScaleFn,
}: HotspotsHeaderProps) {
  return (
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
}

export default HotspotsHeader;
