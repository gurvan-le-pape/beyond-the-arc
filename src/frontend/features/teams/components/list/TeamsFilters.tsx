// src/frontend/features/teams/components/list/TeamsFilters.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useCommitteeLeagueClubFilters } from "@/features/competitions/championships/hooks";
import { useClubSearch } from "@/features/organizations/clubs/api";
import { useTeamFilterValues } from "@/features/teams/api";
import { ErrorMessage } from "@/shared/components/feedback";
import type { CascadeStep } from "@/shared/components/filters/CascadeSelects";
import { CascadeSelects } from "@/shared/components/filters/CascadeSelects";
import { FiltersShell } from "@/shared/components/filters/FiltersShell";
import { LevelLocationFilters } from "@/shared/components/filters/LevelLocationFilters";
import { Select } from "@/shared/components/forms";
import { ComboBox } from "@/shared/components/primitives";
import type { Category, Gender } from "@/shared/constants";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
} from "@/shared/constants";
import { useDebounce } from "@/shared/hooks";

import type { TeamsFilterSetters, TeamsFilterState } from "../../hooks";

interface TeamsFiltersProps {
  filters: TeamsFilterState;
  setters: TeamsFilterSetters;
  onReset: () => void;
}

export const TeamsFilters: React.FC<TeamsFiltersProps> = ({
  filters,
  setters,
  onReset,
}) => {
  const tTeams = useTranslations("teams");
  const tCommon = useTranslations("common");
  const tMatches = useTranslations("matches");
  const tFilters = useTranslations("filters");

  const {
    committees,
    leagues,
    error: locationError,
  } = useCommitteeLeagueClubFilters();

  const {
    clubId,
    selectedClubName,
    number,
    category,
    gender,
    level,
    committeeId,
    leagueId,
    division,
    pool,
  } = filters;

  const {
    setClubId,
    setSelectedClubName,
    setNumber,
    setCategory,
    setGender,
    setLevel,
    setCommitteeId,
    setLeagueId,
    setDivision,
    setPool,
  } = setters;

  const [clubSearch, setClubSearch] = useState("");
  const debouncedClubSearch = useDebounce(clubSearch, 300);
  const { data: clubData, isLoading: clubsLoading } = useClubSearch(
    debouncedClubSearch,
    { committeeId, leagueId },
  );
  const clubOptions = (clubData?.items ?? []).map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const { data: teamFilterValues } = useTeamFilterValues({
    committeeId,
    leagueId,
  });
  const teamNumbers = teamFilterValues?.numbers ?? [];
  const divisions = teamFilterValues?.divisions ?? [];
  const poolLetters = teamFilterValues?.poolLetters ?? [];

  const locationLabel =
    level === CompetitionLevel.DEPARTMENTAL
      ? committees.find((c) => c.id === committeeId)?.name
      : leagues.find((l) => l.id === leagueId)?.name;

  const locationSelected =
    (level === CompetitionLevel.DEPARTMENTAL && committeeId) ||
    (level === CompetitionLevel.REGIONAL && leagueId);

  const chips = [
    clubId && {
      key: "club",
      label: selectedClubName || String(clubId),
      onRemove: () => {
        setClubId(undefined);
        setSelectedClubName("");
      },
    },
    number && {
      key: "number",
      label: `${tCommon("filters.teamNumbers")} ${number}`,
      onRemove: () => setNumber(undefined),
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
    level && {
      key: "level",
      label: tCommon(`competition.levels.${level.toLowerCase()}`),
      onRemove: () => setLevel(undefined),
    },
    locationLabel && {
      key: "location",
      label: locationLabel,
      onRemove: () => {
        setCommitteeId(undefined);
        setLeagueId(undefined);
      },
    },
    division && {
      key: "division",
      label: tMatches("divisionLabel", { div: division }),
      onRemove: () => setDivision(undefined),
    },
    pool && {
      key: "pool",
      label: tTeams("poolLabel", { letter: pool }),
      onRemove: () => setPool(undefined),
    },
  ].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

  const teamNumberOptions = [
    { value: "", label: tCommon("filters.allTeamNumbers") },
    ...teamNumbers.map((n) => ({ value: String(n), label: String(n) })),
  ];

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

  const cascadeSteps: CascadeStep[] = [
    {
      id: "division-filter",
      label: tCommon("filters.divisions"),
      value: division ?? "",
      onChange: (val) => setDivision(Number(val) || undefined),
      enabled: !!locationSelected,
      options: divisions.map((div) => ({
        value: div,
        label: tMatches("divisionLabel", { div }),
      })),
      allLabel: tMatches("selectDivision"),
      waitLabel: tFilters("filters.selectLevelFirst"),
    },
    {
      id: "pool-filter",
      label: tCommon("filters.pools"),
      value: pool ?? "",
      onChange: (val) => setPool(String(val) || undefined),
      enabled: !!division,
      options: poolLetters.map((letter) => ({
        value: letter,
        label: tTeams("poolLabel", { letter }),
      })),
      allLabel: tCommon("filters.allPools"),
      waitLabel: tFilters("filters.selectDivisionFirst"),
    },
  ];

  return (
    <FiltersShell
      activeFilterCount={chips.length}
      chips={chips}
      onReset={onReset}
      title={tTeams("label")}
    >
      {locationError && (
        <ErrorMessage message={tCommon("errors.fetchLeagueOrCommittee")} />
      )}

      {/* Row 1: Club + Team number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComboBox
          label={tCommon("filters.clubs")}
          placeholder={tCommon("filters.allClubs")}
          options={clubOptions}
          value={clubId ? String(clubId) : undefined}
          onChange={(val) => {
            const parsed = Number(val) || undefined;
            setClubId(parsed);
            setSelectedClubName(
              clubOptions.find((c) => c.value === String(val ?? ""))?.label ??
                "",
            );
          }}
          onSearchChange={setClubSearch}
          isLoading={clubsLoading}
        />

        <Select
          label={tCommon("filters.teamNumbers")}
          options={teamNumberOptions}
          value={number ?? ""}
          onChange={(val) => setNumber(Number(val) || undefined)}
        />
      </div>

      {/* Row 2: Category + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={tCommon("filters.categories")}
          options={categoryOptions}
          value={category ?? ""}
          onChange={(val) => setCategory((val as Category) || undefined)}
        />

        <Select
          label={tCommon("filters.genders")}
          options={genderOptions}
          value={gender ?? ""}
          onChange={(val) => setGender((val as Gender) || undefined)}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-divide" />

      {/* Row 3: Level → Committee/League cascade */}
      <LevelLocationFilters
        level={level}
        setLevel={setLevel}
        committeeId={committeeId}
        setCommitteeId={setCommitteeId}
        leagueId={leagueId}
        setLeagueId={setLeagueId}
        committees={committees}
        leagues={leagues}
      />

      {/* Row 4: Division → Pool cascade */}
      <CascadeSelects steps={cascadeSteps} cols={2} />
    </FiltersShell>
  );
};

export default TeamsFilters;
