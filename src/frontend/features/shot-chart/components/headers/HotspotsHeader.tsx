// src/frontend/features/shot-chart/components/headers/HotspotsHeader.tsx

import HeatmapLegend from "../legends/HeatmapLegend";

interface HotspotsHeaderProps {
  readonly maxValue: number;
}

/**
 * The hotspots chart's header: the colour legend, scaled to the busiest zone.
 */
export function HotspotsHeader({ maxValue }: HotspotsHeaderProps) {
  return (
    <div className="w-full mb-3">
      <HeatmapLegend maxValue={maxValue} compact />
    </div>
  );
}

export default HotspotsHeader;
