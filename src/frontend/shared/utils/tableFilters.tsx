// src/frontend/shared/utils/tableFilters.tsx
import type { Header } from "@tanstack/react-table";
import type { RefObject } from "react";
import React from "react";

import {
  FilterDropdown,
  FilterInput,
  SearchableDropdown,
} from "@/shared/components/entity";
import type { FilterKey } from "@/shared/types/filters/FilterKey";

// Generic filter renderer type
export type FilterRenderer<T> = (
  col: Header<T, unknown>["column"],
) => React.ReactNode;
export type TableColumn<T> = Header<T, unknown>["column"];

// Generic dropdown filter renderer (for use in table filter rows)
export function renderDropdownFilter<T>({
  label,
  options,
  filterKey,
  testId,
  openDropdown,
  setOpenDropdown,
  dropdownRefs,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  filterKey: FilterKey;
  testId: string;
  openDropdown: FilterKey | null;
  setOpenDropdown: (key: FilterKey | null) => void;
  dropdownRefs: Record<FilterKey, RefObject<HTMLDivElement | null>>;
  value?: string;
  onChange?: (val: string) => void;
}): FilterRenderer<T> {
  return () => (
    <FilterDropdown
      label={label}
      options={options}
      selectedValue={typeof value === "string" ? value : ""}
      onSelect={onChange ?? (() => {})}
      isOpen={openDropdown === filterKey}
      setOpen={(open) => setOpenDropdown(open ? filterKey : null)}
      dropdownRef={dropdownRefs[filterKey] as RefObject<HTMLDivElement>}
      data-testid={testId}
    />
  );
}

export function renderInputFilter<T>({
  placeholder,
  testId,
  value,
  onChange,
}: {
  placeholder: string;
  testId: string;
  value?: string;
  onChange?: (val: string) => void;
}): FilterRenderer<T> {
  return () => (
    <FilterInput
      value={value ?? ""}
      onChange={onChange ?? (() => {})}
      placeholder={placeholder}
      showPendingIndicator={true}
    />
  );
}

// Searchable dropdown filter renderer
export function renderSearchableDropdownFilter<T>({
  options,
  value,
  onChange,
  placeholder,
  testId,
}: {
  options: { value: string | number; label: string }[];
  value?: string | number;
  onChange?: (val: string | number | undefined) => void;
  placeholder: string;
  testId: string;
}): FilterRenderer<T> {
  return () => (
    <SearchableDropdown
      options={options}
      value={value}
      onChange={onChange ?? (() => {})}
      placeholder={placeholder}
      testId={testId}
    />
  );
}
