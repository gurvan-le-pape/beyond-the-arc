// src/frontend/features/matches/components/list/MatchesFilters.tsx
"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

import { useMatchesCascadeOptions } from "@/features/matches/hooks";
import { useLocationOptions } from "@/features/organizations/hooks";
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
import { DebouncedInput, Input } from "@/shared/components/forms";

import type { MatchesFilterSetters, MatchesFilterState } from "../../hooks";

interface MatchesFiltersProps {
  readonly filters: MatchesFilterState;
  readonly setters: MatchesFilterSetters;
  readonly onReset: () => void;
}

/**
 * The filter panel for the matches list — text search, date, category, gender,
 * the level → committee/league cascade, and the division → pool → matchday
 * cascade.
 *
 * Holds no state: `filters` and `setters` come from `useMatchesFilterState`,
 * which owns the cascade clearing and the reset to page 1.
 *
 * **The three-step cascade is gated twice over.** `isLocationSelected` keeps
 * divisions and pools inert until a committee or league is chosen, and the
 * matchday step depends on the selected pool, since the number of matchdays is
 * a property of that pool rather than of the championship.
 *
 * Options are fetched here rather than passed in — `useLocationOptions` for
 * committees and leagues, `useMatchesCascadeOptions` for divisions and pools.
 * Both surface their own error and retry, so a failed lookup reads as a failure
 * instead of as an empty dropdown.
 *
 * Rendered inside `FiltersShell`, so this subtree exists **twice** in the DOM —
 * mobile sheet and desktop card. Nothing here may rely on a unique `id`.
 */
export function MatchesFilters({
  filters,
  setters,
  onReset,
}: MatchesFiltersProps) {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");

  const {
    committees,
    leagues,
    error: locationError,
    retry: retryLocation,
  } = useLocationOptions();
  const {
    divisions,
    pools,
    isError: cascadeFailed,
    retry: retryCascade,
  } = useMatchesCascadeOptions(filters);

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
        <ErrorMessage
          message={tCommon("errors.fetchLeagueOrCommittee")}
          onRetry={retryLocation}
        />
      )}

      {/* Without this the division and pool dropdowns render empty, which
          reads as "this scope has none" rather than a failed request. */}
      {cascadeFailed && (
        <ErrorMessage
          message={tCommon("errors.fetchChampionships")}
          onRetry={retryCascade}
        />
      )}

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

      {/* Division → Pool → Matchday */}
      <CascadeSelects steps={cascadeSteps} cols={3} />
    </FiltersShell>
  );
}

export default MatchesFilters;
