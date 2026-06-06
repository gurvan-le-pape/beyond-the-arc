// src/frontend/features/competitions/championships/utils/buildCategoryNavigation.ts
import type { Category, Gender } from "@/shared/constants";
import { sortCategories } from "@/shared/utils";

import type { Championship } from "../types";

export function buildCategoryNavigation(
  championships: Championship[],
  championshipId: number,
  gender: Gender | undefined,
) {
  if (!gender) {
    return {
      categoryMap: {} as Record<Category, number>,
      availableCategories: [] as Category[],
      currentCategory: undefined,
    };
  }

  const filtered = championships.filter((c) => c.gender === gender);

  const map: Record<string, number> = {};
  const categories: Category[] = [];
  let currentCategory: Category | undefined;

  filtered.forEach((champ) => {
    if (!champ.category) return;
    if (!categories.includes(champ.category)) categories.push(champ.category);
    if (!map[champ.category]) map[champ.category] = champ.id;
    if (champ.id === championshipId) currentCategory = champ.category;
  });

  const availableCategories = sortCategories(categories.slice());

  return {
    categoryMap: map as Record<Category, number>,
    availableCategories,
    currentCategory: currentCategory ?? availableCategories[0],
  };
}
