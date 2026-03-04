// src/frontend/features/competitions/hooks/useToggleCategory.ts
"use client";

import { useCallback, useState } from "react";

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
