// src/frontend/shared/components/filters/ActiveFilterChips.tsx
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/shared/components/primitives/Button";

export interface ActiveFilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  readonly chips: ActiveFilterChip[];
  readonly onReset: () => void;
}

export function ActiveFilterChips({ chips, onReset }: ActiveFilterChipsProps) {
  const tFilters = useTranslations("filters");

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 pt-1 border-t border-divide-light dark:border-divide-dark">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip.key}
            className="inline-flex items-center gap-1.5 text-xs bg-surface-subtle dark:bg-surface-subtle-dark border border-divide-light dark:border-divide-dark rounded-full px-3 py-1 text-text-body dark:text-text-body-dark"
          >
            {chip.label}
            <button
              type="button"
              onClick={chip.onRemove}
              className="text-text-muted dark:text-text-muted-dark hover:text-text-body dark:hover:text-text-body-dark transition-colors"
              aria-label={`Remove ${chip.label} filter`}
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <Button
        type="button"
        variant="link"
        size="sm"
        onClick={onReset}
        className="shrink-0 text-xs"
      >
        {tFilters("filters.resetAll")}
      </Button>
    </div>
  );
}

export default ActiveFilterChips;
