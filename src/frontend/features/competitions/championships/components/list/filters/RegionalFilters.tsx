// src/frontend/features/competitions/championships/components/list/filters/RegionalFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { FiltersShell } from "@/shared/components/filters/FiltersShell";
import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import { CATEGORY_LIST, GENDER_LIST } from "@/shared/constants";

interface League {
  id: number;
  name: string;
}

interface RegionalFilters {
  leagueId: string;
  category: Category | undefined;
  gender: Gender | undefined;
}

interface RegionalSetters {
  setLeagueId: (value: string) => void;
  setCategory: (value: Category | undefined) => void;
  setGender: (value: Gender | undefined) => void;
}

interface RegionalFiltersProps {
  filters: RegionalFilters;
  setters: RegionalSetters;
  leagues: League[];
  onReset: () => void;
}

export const RegionalFilters: React.FC<RegionalFiltersProps> = ({
  filters,
  setters,
  leagues,
  onReset,
}) => {
  const tCommon = useTranslations("common");

  const leagueName = leagues.find(
    (l) => String(l.id) === filters.leagueId,
  )?.name;

  const chips = [
    leagueName && {
      key: "league",
      label: leagueName,
      onRemove: () => setters.setLeagueId(""),
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
      title={tCommon("competition.levels.regional")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={tCommon("filters.leagues")}
          value={filters.leagueId}
          onChange={(val) => setters.setLeagueId(String(val ?? ""))}
          options={[
            { value: "", label: tCommon("filters.allLeagues") },
            ...leagues.map((l) => ({ value: String(l.id), label: l.name })),
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
