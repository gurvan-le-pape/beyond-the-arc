// src/frontend/features/charts/components/headers/HotspotsHeader.tsx

import HeatmapLegend from "../legends/HeatmapLegend";

interface HotspotsHeaderProps {
  readonly maxValue: number;
}

/**
 * The hotspots chart's header: the colour legend, scaled to the busiest zone.
 */
export function HotspotsHeader({ maxValue }: HotspotsHeaderProps) {
  return (
    <div className="w-full mb-2 rounded-xl px-4 py-3 bg-surface-inset border border-divide shadow-sm">
      <HeatmapLegend maxValue={maxValue} compact />
    </div>
  );
}

export default HotspotsHeader;
