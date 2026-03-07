// src/frontend/features/matches/components/detail/events/filters/QuarterSelector.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Quarter, QUARTER_LIST } from "@/features/matches/constants";
import { cn } from "@/shared/utils/cn";

interface QuarterSelectorProps {
  selected: Quarter;
  onChange: (q: Quarter) => void;
}

/**
 * Pill-group that lets the user pick a single quarter or "All".
 * The active pill is highlighted; inactive pills are plain text buttons.
 */
export function QuarterSelector({ selected, onChange }: QuarterSelectorProps) {
  const t = useTranslations("matches");

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-button p-1">
      {QUARTER_LIST.map((quarter) => (
        <button
          key={quarter}
          onClick={() => onChange(quarter)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-button transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1",
            selected === quarter
              ? "bg-primary-600 dark:bg-primary-500 text-white"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
          )}
        >
          {quarter === Quarter.ALL ? t("matchEvents.allQuarters") : quarter}
        </button>
      ))}
    </div>
  );
}

export default QuarterSelector;
