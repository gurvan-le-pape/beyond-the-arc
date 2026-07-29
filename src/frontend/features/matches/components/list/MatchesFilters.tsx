// src/frontend/features/matches/components/list/MatchesFilters.tsx
"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { useMatchesCascadeOptions } from "@/features/matches/hooks";
import { useCommitteeLeagueClubFilters } from "@/features/organizations/hooks";
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
import { DebouncedInput, Input, Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";

import type { MatchesFilterSetters, MatchesFilterState } from "../../hooks";

interface MatchesFiltersProps {
  filters: MatchesFilterState;
  setters: MatchesFilterSetters;
  onReset: () => void;
}

export const MatchesFilters: React.FC<MatchesFiltersProps> = ({
  filters,
  setters,
  onReset,
}) => {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");

  const {
    committees,
    leagues,
    error: locationError,
  } = useCommitteeLeagueClubFilters();
  const { divisions, pools } = useMatchesCascadeOptions(filters);

  const {
    search,
    dateFilter,
    category,
    gender,
    level,
    committeeId,
    leagueId,
    division,
    poolId,
    matchday,
  } = filters;
  const {
    setSearch,
    setDateFilter,
    setCategory,
    setGender,
    setLevel,
    setCommitteeId,
    setLeagueId,
    setDivision,
    setPoolId,
    setMatchday,
  } = setters;

  const matchdaysCount = poolId
    ? (pools.find((p) => String(p.id) === String(poolId))?.nbMatchdays ?? 30)
    : 30;

  const selectedPool = pools.find((p) => p.id === poolId);

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
    search && {
      key: "search",
      label: `"${search}"`,
      onRemove: () => setSearch(""),
    },
    dateFilter && {
      key: "date",
      label: dateFilter,
      onRemove: () => setDateFilter(""),
    },
    ...categoryGenderChips,
    ...levelLocationChips,
    division && {
      key: "division",
      label: tMatches("divisionLabel", { div: division }),
      onRemove: () => setDivision(undefined),
    },
    poolId && {
      key: "pool",
      label: selectedPool?.name ?? String(poolId),
      onRemove: () => setPoolId(undefined),
    },
    matchday && {
      key: "matchday",
      label: tMatches("matchdayLabel", { matchday }),
      onRemove: () => setMatchday(undefined),
    },
  ].filter(Boolean) as ActiveFilterChip[];

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
      value: poolId ?? "",
      onChange: (val) => setPoolId(Number(val) || undefined),
      enabled: !!division,
      options: pools.map((p) => ({ value: p.id, label: p.name })),
      allLabel: tCommon("filters.allPools"),
      waitLabel: tFilters("filters.selectDivisionFirst"),
    },
    {
      id: "matchday-filter",
      label: tMatches("matchday"),
      value: matchday ?? "",
      onChange: (val) => setMatchday(Number(val) || undefined),
      enabled: !!poolId,
      options: Array.from({ length: matchdaysCount }, (_, i) => ({
        value: i + 1,
        label: tMatches("matchdayLabel", { matchday: i + 1 }),
      })),
      allLabel: tMatches("allMatchdays"),
      waitLabel: tFilters("filters.selectPoolFirst"),
    },
  ];

  return (
    <FiltersShell
      activeFilterCount={chips.length}
      chips={chips}
      onReset={onReset}
      title={tMatches("label")}
    >
      {locationError && (
        <ErrorMessage message={tCommon("errors.fetchLeagueOrCommittee")} />
      )}

      {/* Row 1: Search + Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DebouncedInput
          variant="search"
          label={tMatches("searchClub")}
          value={search}
          placeholder={tMatches("searchClubPlaceholder")}
          onChange={setSearch}
          onClear={() => setSearch("")}
          clearAriaLabel={tCommon("clearSearch")}
        />

        <Input
          id="date-filter"
          type="date"
          label={tMatches("date")}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          leftIcon={<Calendar className="w-5 h-5" />}
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

      {/* Row 4: Division → Pool → Matchday cascade */}
      <CascadeSelects steps={cascadeSteps} cols={3} />
    </FiltersShell>
  );
};

export default MatchesFilters;
