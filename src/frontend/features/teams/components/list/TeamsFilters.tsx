// src/frontend/features/teams/components/list/TeamsFilters.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { ClubComboBoxFilter } from "@/features/organizations/clubs/components";
import { useLocationOptions } from "@/features/organizations/hooks";
import { useTeamFilterValues } from "@/features/teams/api";
import { ErrorMessage } from "@/shared/components/feedback";
import type {
  ActiveFilterChip,
  CascadeStep,
} from "@/shared/components/filters";
import {
  CascadeSelects,
  FiltersShell,
  isLocationSelected,
  LevelLocationFilters,
  useCategoryGenderOptions,
  useCommonFilterChips,
} from "@/shared/components/filters";
import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";

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
    retry: retryLocation,
  } = useLocationOptions();

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

  const {
    data: teamFilterValues,
    isError: filterValuesFailed,
    refetch: retryFilterValues,
  } = useTeamFilterValues({
    committeeId,
    leagueId,
  });
  const teamNumbers = teamFilterValues?.numbers ?? [];
  const divisions = teamFilterValues?.divisions ?? [];
  const poolLetters = teamFilterValues?.poolLetters ?? [];

  const { categoryOptions, genderOptions } = useCategoryGenderOptions();
  const { categoryGenderChips, levelLocationChips } = useCommonFilterChips({
    category,
    gender,
    level,
    committeeId,
    leagueId,
    committees,
    leagues,
    setCategory,
    setGender,
    setLevel,
    setCommitteeId,
    setLeagueId,
  });

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
      label: tTeams("teamNumber", { number }),
      onRemove: () => setNumber(undefined),
    },
    ...categoryGenderChips,
    ...levelLocationChips,
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
  ].filter(Boolean) as ActiveFilterChip[];

  const teamNumberOptions = [
    { value: "", label: tCommon("filters.allTeamNumbers") },
    ...teamNumbers.map((n) => ({ value: String(n), label: String(n) })),
  ];

  const cascadeSteps: CascadeStep[] = [
    {
      id: "division-filter",
      label: tCommon("filters.divisions"),
      value: division ?? "",
      onChange: (val) => setDivision(Number(val) || undefined),
      enabled: isLocationSelected(level, committeeId, leagueId),
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
        <ErrorMessage
          message={tCommon("errors.fetchLeagueOrCommittee")}
          onRetry={retryLocation}
        />
      )}

      {/* Without this the number/division/pool dropdowns render empty, which
          reads as "this scope has no teams" rather than a failed request. */}
      {filterValuesFailed && (
        <ErrorMessage
          message={tCommon("errors.fetchTeams")}
          onRetry={retryFilterValues}
        />
      )}

      {/* Row 1: Club + Team number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClubComboBoxFilter
          committeeId={committeeId}
          leagueId={leagueId}
          clubId={clubId}
          setClubId={setClubId}
          setSelectedClubName={setSelectedClubName}
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
