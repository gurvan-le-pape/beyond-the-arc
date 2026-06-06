// src/frontend/features/competitions/championships/types/CategoryNav.ts
import type { Category } from "@/shared/constants";

export interface CategoryNav {
  categoryMap: Record<Category, number>;
  availableCategories: Category[];
  currentCategory: Category | undefined;
}
