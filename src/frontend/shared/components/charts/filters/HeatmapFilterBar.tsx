// src/frontend/shared/components/charts/filters/HeatmapFilterBar.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { ShotFilter } from "@/shared/constants";

interface HeatmapFilterBarProps {
  shotFilter: ShotFilter;
  setShotFilter: (f: ShotFilter) => void;
}

export const HeatmapFilterBar: React.FC<HeatmapFilterBarProps> = ({
  shotFilter,
  setShotFilter,
}) => {
  const t = useTranslations("common");

  const FILTERS: { key: ShotFilter; label: string }[] = [
    { key: ShotFilter.ALL, label: t("shotChart.all") },
    { key: ShotFilter.MADE, label: t("shotChart.made") },
    { key: ShotFilter.MISSED, label: t("shotChart.missed") },
  ];

  return (
    <div className="w-full flex flex-row items-center gap-2 justify-center">
      <span className="font-semibold text-sm text-text-body mr-1">
        {t("shotChart.shots")}:
      </span>
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setShotFilter(key)}
          className={`px-3 py-1 rounded-md border text-sm transition-all ${
            shotFilter === key
              ? "font-semibold border-primary bg-primary-subtle text-primary-strong shadow-sm"
              : "border-divide bg-surface-inset text-text-body hover:border-text-muted"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default HeatmapFilterBar;
