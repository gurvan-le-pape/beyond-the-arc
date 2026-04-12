// src/frontend/features/competitions/championships/components/DepartmentalFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { FiltersShell } from "@/shared/components/filters/FiltersShell";
import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import { CATEGORY_LIST, GENDER_LIST } from "@/shared/constants";

interface Committee {
  id: number;
  name: string;
}

interface DepartmentalFiltersProps {
  committeeId: string;
  setCommitteeId: (value: string) => void;
  committees: Committee[];
  category: Category | undefined;
  setCategory: (value: Category | undefined) => void;
  gender: Gender | undefined;
  setGender: (value: Gender | undefined) => void;
  seasonYear: string;
  setSeasonYear: (value: string) => void;
  seasonYears: { value: string; label: string }[];
  onReset: () => void;
}

export const DepartmentalFilters: React.FC<DepartmentalFiltersProps> = ({
  committeeId,
  setCommitteeId,
  committees,
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
  const tMatches = useTranslations("matches");
  const tCompetitions = useTranslations("competitions");

  const committeeName = committees.find(
    (c) => String(c.id) === committeeId,
  )?.name;

  const chips = [
    committeeName && {
      key: "committee",
      label: committeeName,
      onRemove: () => {
        setCommitteeId("");
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
      title={tCompetitions("departmental.label")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="committee-filter"
          label={tCompetitions("carousel.titles.departmentalCommittees")}
          value={committeeId}
          onChange={(e) => {
            setCommitteeId(e.target.value);
            setSeasonYear("");
          }}
        >
          <option value="">{tCompetitions("allCommittees")}</option>
          {committees.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          id="season-year-filter"
          label={tCommon("filters.seasonYear")}
          value={seasonYear}
          onChange={(e) => setSeasonYear(e.target.value)}
        >
          <option value="">{tCompetitions("allSeasons")}</option>
          {seasonYears.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="category-filter"
          label={tMatches("category")}
          value={category ?? ""}
          onChange={(e) =>
            setCategory((e.target.value as Category) || undefined)
          }
        >
          <option value="">{tMatches("allCategories")}</option>
          {CATEGORY_LIST.map((cat) => (
            <option key={cat} value={cat}>
              {tCommon(`category.${cat}`)}
            </option>
          ))}
        </Select>

        <Select
          id="gender-filter"
          label={tMatches("gender")}
          value={gender ?? ""}
          onChange={(e) => setGender((e.target.value as Gender) || undefined)}
        >
          <option value="">{tMatches("allGenders")}</option>
          {GENDER_LIST.map((g) => (
            <option key={g} value={g}>
              {tCommon(`gender.${g}`)}
            </option>
          ))}
        </Select>
      </div>
    </FiltersShell>
  );
};
