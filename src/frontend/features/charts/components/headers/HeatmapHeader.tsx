// src/frontend/features/charts/components/headers/HeatmapHeader.tsx

import type { ShotFilter } from "../../constants";
import HeatmapFilterBar from "../filters/HeatmapFilterBar";
import HeatmapLegend from "../legends/HeatmapLegend";

interface HeatmapHeaderProps {
  readonly shotFilter: ShotFilter;
  readonly setShotFilter: (f: ShotFilter) => void;
  readonly maxValue: number;
}

/**
 * The heatmap chart's header: the made/missed filter and the colour legend,
 * scaled to the busiest cell under the current filter.
 */
export function HeatmapHeader({
  shotFilter,
  setShotFilter,
  maxValue,
}: HeatmapHeaderProps) {
  return (
    <div className="w-full mb-2 rounded-xl px-4 py-3 bg-surface-inset border border-divide shadow-sm flex flex-col gap-3">
      <HeatmapFilterBar shotFilter={shotFilter} setShotFilter={setShotFilter} />
      <HeatmapLegend maxValue={maxValue} compact />
    </div>
  );
}

export default HeatmapHeader;
