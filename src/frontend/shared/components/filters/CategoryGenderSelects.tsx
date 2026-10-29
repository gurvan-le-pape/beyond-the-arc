// src/frontend/shared/components/filters/CategoryGenderSelects.tsx
import { useTranslations } from "next-intl";

import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import type { FilterProps } from "@/shared/hooks";

import { useCategoryGenderOptions } from "./useCategoryGenderOptions";

interface CategoryGenderFilters {
  category: Category | undefined;
  gender: Gender | undefined;
}

/**
 * The category + gender pair rendered by the teams, matches and players filter
 * panels — the same two `Select`s and the same "all" option lists, written
 * out three times. It renders the two bare, as a fragment: the panel's own grid
 * places them.
 *
 * It resolves its own labels from the `common` namespace rather than taking a
 * `t`: these strings belong to no feature, which is why `useCategoryGenderOptions`
 * beside it already reads them the same way.
 */
export function CategoryGenderSelects({
  filters: { category, gender },
  set,
}: FilterProps<CategoryGenderFilters>) {
  const tCommon = useTranslations("common");
  const { categoryOptions, genderOptions } = useCategoryGenderOptions();

  return (
    <>
      <Select
        label={tCommon("filters.categories")}
        options={categoryOptions}
        value={category}
        onChange={(category) => set({ category })}
      />

      <Select
        label={tCommon("filters.genders")}
        options={genderOptions}
        value={gender}
        onChange={(gender) => set({ gender })}
      />
    </>
  );
}
