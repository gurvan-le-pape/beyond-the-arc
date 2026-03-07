// src/frontend/shared/components/charts/filters/HeatmapFilterBar.tsx
import React from "react";

import { ShotFilter } from "@/shared/constants";

interface HeatmapFilterBarProps {
  shotFilter: ShotFilter;
  setShotFilter: (f: ShotFilter) => void;
}

const FILTERS: { key: ShotFilter; label: string }[] = [
  { key: ShotFilter.ALL, label: "All" },
  { key: ShotFilter.MADE, label: "Made" },
  { key: ShotFilter.MISSED, label: "Missed" },
];

export const HeatmapFilterBar: React.FC<HeatmapFilterBarProps> = ({
  shotFilter,
  setShotFilter,
}) => (
  <div className="w-full flex flex-row items-center gap-2 justify-center">
    <span className="font-semibold text-sm text-gray-600 dark:text-gray-300 mr-1">
      Shots:
    </span>
    {FILTERS.map(({ key, label }) => (
      <button
        key={key}
        onClick={() => setShotFilter(key)}
        className={`px-3 py-1 rounded-md border text-sm transition-all ${
          shotFilter === key
            ? "font-semibold border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-400"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default HeatmapFilterBar;
