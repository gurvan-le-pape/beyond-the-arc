// src/frontend/features/competitions/championships/utils/sortCategories.ts

import type { Category } from "@/shared/constants";

// Sort categories (U11, U13, U15, etc.)
export const sortCategories = (categories: Category[]) => {
  return categories.sort((a, b) => {
    const extractNumber = (cat: Category) => {
      const regex = /U(\d+)/;
      const match = regex.exec(cat);
      return match ? Number.parseInt(match[1]) : 999;
    };
    return extractNumber(a) - extractNumber(b);
  });
};
