// src/frontend/features/charts/components/filters/HeatmapFilterBar.tsx
import { useTranslations } from "next-intl";

import { SegmentedControl } from "@/shared/components/primitives";

import { ShotFilter } from "../../constants";

interface HeatmapFilterBarProps {
  readonly shotFilter: ShotFilter;
  readonly setShotFilter: (f: ShotFilter) => void;
}

/**
 * The all / made / missed selector above a heatmap.
 *
 * Fully controlled — it holds no state and the three options are fixed, so
 * adding a filter is a change here and in `ShotFilter` together.
 *
 * Only the heatmap has this. Hotspots shades by attempt volume rather than by
 * outcome, so a made/missed filter would have nothing to change.
 */
export function HeatmapFilterBar({
  shotFilter,
  setShotFilter,
}: HeatmapFilterBarProps) {
  const t = useTranslations("common");

  const FILTERS: { key: ShotFilter; label: string }[] = [
    { key: ShotFilter.ALL, label: t("shotChart.all") },
    { key: ShotFilter.MADE, label: t("shotChart.made") },
    { key: ShotFilter.MISSED, label: t("shotChart.missed") },
  ];

  return (
    // No visible "Tirs :" prefix: under the chart's title the three options
    // name themselves, and at 390 px the prefix pushed the third onto a second
    // line. The group keeps the name for assistive technology.
    <div className="w-full flex flex-row items-center justify-center">
      <SegmentedControl
        label={t("shotChart.shots")}
        value={shotFilter}
        onChange={setShotFilter}
        options={FILTERS.map(({ key, label }) => ({ value: key, label }))}
      />
    </div>
  );
}

export default HeatmapFilterBar;
