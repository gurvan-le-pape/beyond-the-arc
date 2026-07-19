// src/frontend/features/competitions/championships/components/list/departmental-tab/DepartmentalFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { FiltersShell } from "@/shared/components/filters";
import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import { CATEGORY_LIST, GENDER_LIST } from "@/shared/constants";

interface Committee {
  id: number;
  name: string;
}

interface DepartmentalFilters {
  committeeId: string;
  category: Category | undefined;
  gender: Gender | undefined;
}

interface DepartmentalSetters {
  setCommitteeId: (value: string) => void;
  setCategory: (value: Category | undefined) => void;
  setGender: (value: Gender | undefined) => void;
}

interface DepartmentalFiltersProps {
  filters: DepartmentalFilters;
  setters: DepartmentalSetters;
  committees: Committee[];
  onReset: () => void;
}

export const DepartmentalFilters: React.FC<DepartmentalFiltersProps> = ({
  filters,
  setters,
  committees,
  onReset,
}) => {
  const tCommon = useTranslations("common");

  const committeeName = committees.find(
    (c) => String(c.id) === filters.committeeId,
  )?.name;

  const chips = [
    committeeName && {
      key: "committee",
      label: committeeName,
      onRemove: () => setters.setCommitteeId(""),
    },
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
      title={tCommon("competition.levels.departmental")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={tCommon("filters.committees")}
          value={filters.committeeId}
          onChange={(val) => setters.setCommitteeId(String(val ?? ""))}
          options={[
            { value: "", label: tCommon("filters.allCommittees") },
            ...committees.map((c) => ({ value: String(c.id), label: c.name })),
          ]}
        />

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
