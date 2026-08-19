// src/frontend/features/teams/components/list/TeamsFilters.tsx
"use client";

import { useTranslations } from "next-intl";

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
  CategoryGenderSelects,
  FiltersShell,
  isLocationSelected,
  LevelLocationFilters,
  useCommonFilterChips,
} from "@/shared/components/filters";
import { Select } from "@/shared/components/forms";

import type { TeamsFilterSetters, TeamsFilterState } from "../../hooks";

interface TeamsFiltersProps {
  readonly filters: TeamsFilterState;
  readonly setters: TeamsFilterSetters;
  readonly onReset: () => void;
}

/**
 * The filter panel for the teams list — club, team number, category, gender,
 * the level → committee/league cascade, and the division → pool cascade.
 *
 * Holds no state: `filters` and `setters` come from `useTeamsFilterState`, which
 * also owns the reset-to-page-1 behaviour and the cascade clearing.
 *
 * **The division → pool cascade stays disabled until a location is chosen.**
 * `isLocationSelected` gates it, because divisions only mean something within a
 * committee or league; the steps render dimmed rather than hidden so the panel
 * does not change shape as filters are filled in.
 *
 * Option sources are fetched here rather than passed in — `useLocationOptions`
 * for committees and leagues, `useTeamFilterValues` for the numbers, divisions
 * and pools that actually occur. Without the latter those dropdowns render
 * empty, which reads as "no teams match" rather than as a failure.
 *
 * Rendered inside `FiltersShell`, so this subtree exists **twice** in the DOM —
 * mobile sheet and desktop card. Nothing here may rely on a unique `id`.
 */
export function TeamsFilters({ filters, setters, onReset }: TeamsFiltersProps) {
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

      <CategoryGenderSelects
        category={category}
        setCategory={setCategory}
        gender={gender}
        setGender={setGender}
      />

      <div className="border-t border-divide" />

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

      {/* Division → Pool */}
      <CascadeSelects steps={cascadeSteps} cols={2} />
    </FiltersShell>
  );
}

export default TeamsFilters;
