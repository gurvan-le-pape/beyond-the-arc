// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/SidePanelFilters.tsx
"use client";

import { useTranslations } from "next-intl";

import type { ClubFilters } from "../useFilters";
import { FilterCheckbox } from "./FilterCheckbox";

interface SidePanelFiltersProps {
  readonly filters: ClubFilters;
  readonly onToggleFilter: (key: keyof ClubFilters) => void;
  readonly expanded: boolean;
  readonly onToggleExpanded: () => void;
  readonly activeFilterCount: number;
}

/** Collapsible filters accordion (website / email / phone) in the side panel. */
export function SidePanelFilters({
  filters,
  onToggleFilter,
  expanded,
  onToggleExpanded,
  activeFilterCount,
}: SidePanelFiltersProps) {
  const t = useTranslations("clubs");

  return (
    <div className="border-b border-divide flex-shrink-0">
      <button
        type="button"
        onClick={onToggleExpanded}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-inset transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-text-body"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium text-text-heading">
            {t("map.filters")}
          </span>
          {activeFilterCount > 0 && (
            <span className="bg-primary-subtle text-primary-strong text-xs font-medium px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-text-muted transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          <FilterCheckbox
            label={t("map.filterWebsite")}
            checked={filters.hasWebsite}
            onChange={() => onToggleFilter("hasWebsite")}
          />
          <FilterCheckbox
            label={t("map.filterEmail")}
            checked={filters.hasEmail}
            onChange={() => onToggleFilter("hasEmail")}
          />
          <FilterCheckbox
            label={t("map.filterPhone")}
            checked={filters.hasPhone}
            onChange={() => onToggleFilter("hasPhone")}
          />
        </div>
      )}
    </div>
  );
}

export default SidePanelFilters;
