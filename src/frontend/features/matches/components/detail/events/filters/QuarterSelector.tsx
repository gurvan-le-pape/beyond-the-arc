// src/frontend/features/matches/components/detail/events/filters/QuarterSelector.tsx
import { useTranslations } from "next-intl";

import { Quarter, QUARTER_LIST } from "@/features/matches/constants";
import { cn } from "@/shared/utils";

interface QuarterSelectorProps {
  readonly selected: Quarter;
  readonly onChange: (q: Quarter) => void;
}

/**
 * Pill-group that lets the user pick a single quarter or "All".
 * The active pill is highlighted; inactive pills are plain text buttons.
 */
export function QuarterSelector({ selected, onChange }: QuarterSelectorProps) {
  const t = useTranslations("matches");

  return (
    <div className="flex surface-subtle rounded-button p-1">
      {QUARTER_LIST.map((quarter) => (
        <button
          key={quarter}
          onClick={() => onChange(quarter)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-button transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ring-offset-surface",
            selected === quarter
              ? "bg-primary text-white"
              : "text-text-body hover:text-text-heading",
          )}
        >
          {quarter === Quarter.ALL ? t("matchEvents.allQuarters") : quarter}
        </button>
      ))}
    </div>
  );
}

export default QuarterSelector;
