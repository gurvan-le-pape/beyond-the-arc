// src/frontend/shared/utils/entity/table/createFilterRenderers.tsx
import type { RefObject } from "react";

import type { FilterKey } from "@/shared/types/filters/FilterKey";

import type { FilterRenderer } from "../../tableFilters";
import {
  renderDropdownFilter,
  renderInputFilter,
  renderSearchableDropdownFilter,
} from "../../tableFilters";

interface DropdownConfig {
  label: string;
  options: any[];
  filterKey: FilterKey;
  testId: string;
  openDropdown: any;
  setOpenDropdown: any;
  dropdownRefs: Record<FilterKey, RefObject<HTMLDivElement | null>>;
}

interface InputConfig {
  placeholder: string;
  testId: string;
  value?: string;
  onChange?: (val: string) => void;
}

interface SearchableDropdownConfig {
  options: { value: string | number; label: string }[];
  value?: string | number;
  onChange?: (val: string | number | undefined) => void;
  placeholder: string;
  testId: string;
}

export type FilterRendererConfig =
  | { type: "dropdown"; key: FilterKey; config: DropdownConfig }
  | { type: "input"; key: FilterKey; config: InputConfig }
  | {
      type: "searchableDropdown";
      key: FilterKey;
      config: SearchableDropdownConfig;
    };

export function createFilterRenderers(
  configs: FilterRendererConfig[],
): Record<FilterKey, FilterRenderer<any>> {
  const renderers: Partial<Record<FilterKey, FilterRenderer<any>>> = {};
  configs.forEach((item) => {
    if (item.type === "dropdown") {
      renderers[item.key] = renderDropdownFilter(item.config);
    } else if (item.type === "input") {
      renderers[item.key] = renderInputFilter(item.config);
    } else if (item.type === "searchableDropdown") {
      renderers[item.key] = renderSearchableDropdownFilter(item.config);
    }
  });
  return renderers as Record<FilterKey, FilterRenderer<any>>;
}
