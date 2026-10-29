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
 *
 * **On the `placeholder`.** `useCategoryGenderOptions` puts an `{ value: "" }`
 * entry at the head of both lists, and callers pass `value={category ?? ""}`,
 * so `ComboBox` always finds a matching option and renders *its* label. The
 * placeholder is therefore unreachable on the normal path — it surfaces only
 * if a value arrives that is in neither list, which is possible because these
 * values come from the URL. Without one, `ComboBox` would show a blank trigger
 * in that case. Naming it here makes the fallback correct everywhere without
 * changing anything a user normally sees.
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
        value={category ?? ""}
        onChange={(val) => set({ category: (val as Category) || undefined })}
        placeholder={tCommon("filters.allCategories")}
      />

      <Select
        label={tCommon("filters.genders")}
        options={genderOptions}
        value={gender ?? ""}
        onChange={(val) => set({ gender: (val as Gender) || undefined })}
        placeholder={tCommon("filters.allGenders")}
      />
    </>
  );
}
