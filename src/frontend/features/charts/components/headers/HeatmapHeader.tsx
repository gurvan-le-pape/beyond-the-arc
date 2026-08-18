// src/frontend/features/charts/components/headers/HeatmapHeader.tsx

import type { ColorScaleName, ShotFilter } from "../../constants";
import HeatmapFilterBar from "../filters/HeatmapFilterBar";
import HeatmapLegend from "../legends/HeatmapLegend";

interface HeatmapHeaderProps {
  shotFilter: ShotFilter;
  setShotFilter: (f: ShotFilter) => void;
  colorScale: ColorScaleName;
  setColorScale: (s: ColorScaleName) => void;
  colorScaleOptions: readonly ColorScaleName[];
  maxValue: number;
  colorScaleFn: (t: number) => string;
}

/**
 * The controls above a heatmap: the shot filter and the colour-scale picker.
 *
 * Carries one control more than `HotspotsHeader` — the made/missed filter —
 * because a heatmap shades by outcome and hotspots shade by volume. The two
 * headers are deliberately not interchangeable.
 */
export function HeatmapHeader({
  shotFilter,
  setShotFilter,
  colorScale,
  setColorScale,
  colorScaleOptions,
  maxValue,
  colorScaleFn,
}: HeatmapHeaderProps) {
  return (
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
}

export default HeatmapHeader;
