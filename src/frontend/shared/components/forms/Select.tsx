// src/frontend/shared/components/forms/Select.tsx
//
// Select — non-searchable single-value picker.
//
// A thin wrapper around ComboBox with searchable=false.
// Uses an `options` array instead of <option> children — this gives us
// a fully custom popover that looks identical to ComboBox.
//
// Use for short, static option lists (≤ ~8 items).
// For long/searchable lists use ComboBox directly.
// For multi-select use MultiSelectDropdown.
//
// @example
// <Select
//   label="Category"
//   value={category}
//   onChange={setCategory}
//   options={CATEGORY_LIST.map(c => ({ value: c, label: t(`category.${c}`) }))}
//   placeholder="All categories"
// />

import type { ComboBoxOption } from "@/shared/components/primitives";
import { ComboBox } from "@/shared/components/primitives";

export interface SelectProps {
  readonly options: ComboBoxOption[];
  readonly value: string | number | undefined;
  readonly onChange: (value: string | number | undefined) => void;
  readonly label?: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly error?: string;
  readonly helperText?: string;
  readonly testId?: string;
}

/**
 * Select — non-searchable single-value picker.
 *
 * Identical visually to ComboBox but without the search input.
 * Both open with the same custom popover — fully consistent UI.
 */
export function Select(props: SelectProps) {
  return <ComboBox {...props} searchable={false} />;
}
