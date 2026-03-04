// src/frontend/shared/utils/createDropdownRefs.ts
import type { RefObject } from "react";
import React from "react";

import type { FilterKey } from "@/shared/types/filters/FilterKey";

/**
 * Create refs for dropdowns by filter key
 * @param {FilterKey[]} keys
 * @returns {Record<FilterKey, RefObject<HTMLDivElement>>}
 */
export function createDropdownRefs(
  keys: FilterKey[],
): Record<FilterKey, RefObject<HTMLDivElement | null>> {
  const refs = {} as Record<FilterKey, RefObject<HTMLDivElement | null>>;
  keys.forEach((key) => {
    refs[key] = React.createRef<HTMLDivElement>();
  });
  return refs;
}
