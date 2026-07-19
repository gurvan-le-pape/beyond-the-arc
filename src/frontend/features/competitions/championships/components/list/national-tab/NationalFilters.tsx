// src/frontend/features/competitions/championships/components/list/national-tab/NationalFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { FiltersShell } from "@/shared/components/filters";
import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import { CATEGORY_LIST, GENDER_LIST } from "@/shared/constants";

interface NationalFilters {
  category: Category | undefined;
  gender: Gender | undefined;
}

interface NationalSetters {
  setCategory: (value: Category | undefined) => void;
  setGender: (value: Gender | undefined) => void;
}

interface NationalFiltersProps {
  filters: NationalFilters;
  setters: NationalSetters;
  onReset: () => void;
}

export const NationalFilters: React.FC<NationalFiltersProps> = ({
  filters,
  setters,
  onReset,
}) => {
  const tCommon = useTranslations("common");

  const chips = [
    filters.category && {
      key: "category",
      label: tCommon(`category.${filters.category}`),
      onRemove: () => setters.setCategory(undefined),
    },
    filters.gender && {
      key: "gender",
      label: tCommon(`gender.${filters.gender}`),
      onRemove: () => setters.setGender(undefined),
    },
  ].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

  return (
    <FiltersShell
      activeFilterCount={chips.length}
      chips={chips}
      onReset={onReset}
      title={tCommon("competition.levels.national")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={tCommon("filters.categories")}
          value={filters.category ?? ""}
          onChange={(val) =>
            setters.setCategory((val as Category) || undefined)
          }
          options={[
            { value: "", label: tCommon("filters.allCategories") },
            ...CATEGORY_LIST.map((cat) => ({
              value: cat,
              label: tCommon(`category.${cat}`),
            })),
          ]}
        />

        <Select
          label={tCommon("filters.genders")}
          value={filters.gender ?? ""}
          onChange={(val) => setters.setGender((val as Gender) || undefined)}
          options={[
            { value: "", label: tCommon("filters.allGenders") },
            ...GENDER_LIST.map((g) => ({
              value: g,
              label: tCommon(`gender.${g}`),
            })),
          ]}
        />
      </div>
    </FiltersShell>
  );
};
