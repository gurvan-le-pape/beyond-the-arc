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

interface RegionalFiltersProps {
  leagueId: string;
  setLeagueId: (value: string) => void;
  leagues: League[];
  category: Category | undefined;
  setCategory: (value: Category | undefined) => void;
  gender: Gender | undefined;
  setGender: (value: Gender | undefined) => void;
  seasonYear: string;
  setSeasonYear: (value: string) => void;
  seasonYears: { value: string; label: string }[];
  onReset: () => void;
}

export const RegionalFilters: React.FC<RegionalFiltersProps> = ({
  leagueId,
  setLeagueId,
  leagues,
  category,
  setCategory,
  gender,
  setGender,
  seasonYear,
  setSeasonYear,
  seasonYears,
  onReset,
}) => {
  const tCommon = useTranslations("common");

  const leagueName = leagues.find((l) => String(l.id) === leagueId)?.name;

  const chips = [
    leagueName && {
      key: "league",
      label: leagueName,
      onRemove: () => {
        setLeagueId("");
        setSeasonYear("");
      },
    },
    category && {
      key: "category",
      label: tCommon(`category.${category}`),
      onRemove: () => setCategory(undefined),
    },
    gender && {
      key: "gender",
      label: tCommon(`gender.${gender}`),
      onRemove: () => setGender(undefined),
    },
    seasonYear && {
      key: "seasonYear",
      label: seasonYear,
      onRemove: () => setSeasonYear(""),
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
          value={leagueId}
          onChange={(val) => {
            setLeagueId(String(val ?? ""));
            setSeasonYear("");
          }}
          options={[
            { value: "", label: tCommon("filters.allLeagues") },
            ...leagues.map((l) => ({ value: String(l.id), label: l.name })),
          ]}
        />

        <Select
          label={tCommon("filters.seasons")}
          value={seasonYear}
          onChange={(val) => setSeasonYear(String(val ?? ""))}
          options={[
            { value: "", label: tCommon("filters.allSeasons") },
            ...seasonYears,
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={tCommon("filters.categories")}
          value={category ?? ""}
          onChange={(val) => setCategory((val as Category) || undefined)}
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
          value={gender ?? ""}
          onChange={(val) => setGender((val as Gender) || undefined)}
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
