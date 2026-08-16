// src/frontend/shared/components/filters/CategoryGenderSelects.tsx
import { useTranslations } from "next-intl";

import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";

import { useCategoryGenderOptions } from "./useCategoryGenderOptions";

interface CategoryGenderSelectsProps {
  readonly category: Category | undefined;
  readonly setCategory: (value: Category | undefined) => void;
  readonly gender: Gender | undefined;
  readonly setGender: (value: Gender | undefined) => void;
}

/**
 * The category + gender pair rendered by the teams, matches and players filter
 * panels — the same two `Select`s, the same two-column grid, the same "all"
 * option lists, written out three times.
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
 * values come from the URL. Two of the three call sites passed none and fell
 * through to `common.table.filterName` ("Filter name…") in that case, which
 * says nothing useful about a category filter. Naming it here makes the
 * fallback correct everywhere without changing anything a user normally sees.
 */
export function CategoryGenderSelects({
  category,
  setCategory,
  gender,
  setGender,
}: CategoryGenderSelectsProps) {
  const tCommon = useTranslations("common");
  const { categoryOptions, genderOptions } = useCategoryGenderOptions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        label={tCommon("filters.categories")}
        options={categoryOptions}
        value={category ?? ""}
        onChange={(val) => setCategory((val as Category) || undefined)}
        placeholder={tCommon("filters.allCategories")}
      />

      <Select
        label={tCommon("filters.genders")}
        options={genderOptions}
        value={gender ?? ""}
        onChange={(val) => setGender((val as Gender) || undefined)}
        placeholder={tCommon("filters.allGenders")}
      />
    </div>
  );
}
