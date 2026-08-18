// src/frontend/features/organizations/shared/components/detail/gender-categorized-section/useToggleCategory.ts
"use client";

import { useCallback, useState } from "react";

/**
 * Expansion state for the category groups, keyed by category.
 *
 * **Independently expandable**, unlike the docs accordion — a reader comparing
 * two age groups keeps both open. A category absent from the record is closed,
 * so the initial state is an empty object rather than one entry per category.
 *
 * @returns the per-category open flags and a toggle taking a category key
 */
export function useToggleCategory() {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = useCallback((categoryKey: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  }, []);

  return { expandedCategories, toggleCategory };
}
