// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/FilterCheckbox.tsx
"use client";

import { memo } from "react";

interface FilterCheckboxProps {
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: () => void;
}

/** A single labelled filter checkbox in the side panel's filters accordion. */
export const FilterCheckbox = memo(function FilterCheckbox({
  label,
  checked,
  onChange,
}: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-solid-primary border-divide rounded focus-ring bg-surface-inset"
      />
      <span className="text-sm text-text-emphasis group-hover:text-text-heading">
        {label}
      </span>
    </label>
  );
});

export default FilterCheckbox;
