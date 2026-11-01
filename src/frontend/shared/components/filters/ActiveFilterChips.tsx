// src/frontend/shared/components/filters/ActiveFilterChips.tsx
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/primitives";

export interface ActiveFilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  readonly chips: ActiveFilterChip[];
  readonly onReset: () => void;
}

/**
 * The removable chips summarising which filters are currently applied, with a
 * reset control beside them.
 *
 * **Renders nothing when `chips` is empty** — including its own top border — so
 * a panel with no active filters shows no stray divider.
 *
 * Each chip carries its own `onRemove`; this owns no filter state and does not
 * know what a chip means. The remove button's accessible name is built from the
 * chip's label, so a label that reads well in a sentence reads well to a screen
 * reader too.
 */
export function ActiveFilterChips({ chips, onReset }: ActiveFilterChipsProps) {
  const tFilters = useTranslations("filters");

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 pt-1 border-t border-divide">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip.key}
            className="inline-flex items-center gap-1.5 text-xs bg-surface-inset border border-divide rounded-full px-3 py-1 text-text-body"
          >
            {chip.label}
            <button
              type="button"
              onClick={chip.onRemove}
              className="text-text-muted hover:text-text-body transition-colors"
              aria-label={tFilters("filters.removeFilter", {
                label: chip.label,
              })}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <Button
        type="button"
        variant="link"
        size="sm"
        onPress={onReset}
        className="shrink-0 text-xs"
      >
        {tFilters("filters.resetAll")}
      </Button>
    </div>
  );
}
