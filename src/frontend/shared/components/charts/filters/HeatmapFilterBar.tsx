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
      <span className="font-semibold text-sm text-text-body dark:text-text-body-dark mr-1">
        {t("shotChart.shots")}:
      </span>
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setShotFilter(key)}
          className={`px-3 py-1 rounded-md border text-sm transition-all ${
            shotFilter === key
              ? "font-semibold border-primary-500 bg-primary-50 text-primary-700 shadow-sm dark:border-primary-400 dark:bg-primary-950 dark:text-primary-300"
              : "border-divide-light bg-white text-text-body hover:border-divide-dark dark:border-divide-dark dark:bg-surface-subtle-dark dark:text-text-body-dark dark:hover:border-text-muted-dark"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default HeatmapFilterBar;
