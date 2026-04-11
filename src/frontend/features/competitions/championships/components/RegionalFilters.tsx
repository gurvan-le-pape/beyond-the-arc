// src/frontend/features/competitions/championships/components/RegionalFilters.tsx
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
  const tMatches = useTranslations("matches");
  const tCompetitions = useTranslations("competitions");

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
      title={tCompetitions("regional.label")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="league-filter"
          label={tCompetitions("carousel.titles.regionalLeagues")}
          value={leagueId}
          onChange={(e) => {
            setLeagueId(e.target.value);
            setSeasonYear("");
          }}
        >
          <option value="">{tCompetitions("allLeagues")}</option>
          {leagues.map((l) => (
            <option key={l.id} value={String(l.id)}>
              {l.name}
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
