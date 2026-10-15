// src/frontend/features/organizations/shared/components/detail/gender-categorized-section/useToggleCategory.ts
"use client";

import { useCallback, useState } from "react";

/**
 * Expansion state for the category groups, keyed by category.
 *
 * **Independently expandable**, unlike the docs accordion — a reader comparing
 * two age groups keeps both open. A category absent from the record takes
 * `defaultExpanded`, so the initial state is an empty object rather than one
 * entry per category.
 *
 * @param defaultExpanded - whether a category nobody has toggled yet is open
 * @returns whether a category is open, and a toggle taking a category key
 */
export function useToggleCategory(defaultExpanded = false) {
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const isExpanded = useCallback(
    (categoryKey: string) => toggled[categoryKey] ?? defaultExpanded,
    [toggled, defaultExpanded],
  );

  const toggleCategory = useCallback(
    (categoryKey: string) => {
      setToggled((prev) => ({
        ...prev,
        [categoryKey]: !(prev[categoryKey] ?? defaultExpanded),
      }));
    },
    [defaultExpanded],
  );

  return { isExpanded, toggleCategory };
}
