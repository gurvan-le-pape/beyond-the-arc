// src/frontend/shared/components/filters/useCategoryGenderOptions.ts
import { useTranslations } from "next-intl";

import { CATEGORY_LIST, GENDER_LIST } from "@/shared/constants";

/**
 * The category and gender `<Select>` option lists shared by the teams,
 * players, and matches filter panels — an "all" entry followed by every
 * category / gender, translated.
 *
 * @returns the category and gender option lists, translated and in display order
 */
export function useCategoryGenderOptions() {
  const tCommon = useTranslations("common");

  const categoryOptions = [
    { value: "", label: tCommon("filters.allCategories") },
    ...CATEGORY_LIST.map((cat) => ({
      value: cat,
      label: tCommon(`category.${cat}`),
    })),
  ];

  const genderOptions = [
    { value: "", label: tCommon("filters.allGenders") },
    ...GENDER_LIST.map((g) => ({
      value: g,
      label: tCommon(`gender.${g}`),
    })),
  ];

  return { categoryOptions, genderOptions };
}
