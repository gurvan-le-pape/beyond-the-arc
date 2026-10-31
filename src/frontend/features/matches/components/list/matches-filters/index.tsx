// src/frontend/features/matches/components/list/matches-filters/index.tsx
"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

import type { MatchesFilterValues } from "@/features/matches/hooks";
import {
  useDropUnknownLocation,
  useLocationOptions,
} from "@/features/organizations/hooks";
import { ErrorMessage } from "@/shared/components/feedback";
import type { ActiveFilterChip } from "@/shared/components/filters";
import {
  CascadeSelect,
  CategoryGenderSelects,
  FiltersShell,
  isLocationSelected,
  LevelLocationFilters,
  useCommonFilterChips,
} from "@/shared/components/filters";
import { DebouncedInput, Input } from "@/shared/components/forms";
import { Grid } from "@/shared/components/primitives";
import type { FilterProps } from "@/shared/hooks";

import { useMatchesCascadeOptions } from "./useMatchesCascadeOptions";

interface MatchesFiltersProps extends FilterProps<MatchesFilterValues> {
  readonly onReset: () => void;
}

/**
 * The filter panel for the matches list — text search, date, category, gender,
 * the level → committee/league cascade, and the division → pool → matchday
 * cascade.
 *
 * Holds no state: `filters` and `set` come from `useMatchesFilterState`,
 * which owns the cascade clearing and the reset to page 1.
 *
 * **The three-step cascade is gated twice over.** `isLocationSelected` keeps
 * divisions and pools inert until a committee or league is chosen, and the
 * matchday step depends on the selected pool, since the number of matchdays is
 * a property of that pool rather than of the championship. The pool step also
 * waits for a category and gender: only with both does the division name one
 * championship, whose pools are the options.
 *
 * Options are fetched here rather than passed in — `useLocationOptions` for
 * committees and leagues, `useMatchesCascadeOptions` for divisions and pools.
 * Both surface their own error and retry, so a failed lookup reads as a failure
 * instead of as an empty dropdown.
 */
export function MatchesFilters({ filters, set, onReset }: MatchesFiltersProps) {
  const tMatches = useTranslations("matches");
  const tCompetitions = useTranslations("competitions");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");

  const locationOptions = useLocationOptions();
  const {
    committees,
    leagues,
    error: locationError,
    retry: retryLocation,
  } = locationOptions;
  const {
    divisions,
    pools,
    isError: cascadeFailed,
    retry: retryCascade,
  } = useMatchesCascadeOptions(filters);

  const {
    q,
    date,
    category,
    gender,
    level,
    committee,
    league,
    division,
    pool,
    matchday,
  } = filters;

  useDropUnknownLocation(locationOptions, { filters, set });

  const selectedPool = pools.find((p) => p.id === pool);
  const matchdaysCount = selectedPool?.nbMatchdays ?? 30;

  const { categoryGenderChips, levelLocationChips } = useCommonFilterChips({
    filters,
    set,
    committees,
    leagues,
  });

  const chips = [
    q && {
      key: "search",
      label: `"${q}"`,
      onRemove: () => set({ q: undefined }),
    },
    date && {
      key: "date",
      label: date,
      onRemove: () => set({ date: undefined }),
    },
    ...categoryGenderChips,
    ...levelLocationChips,
    division && {
      key: "division",
      label: tCompetitions("divisionWithValue", { value: division }),
      onRemove: () => set({ division: undefined }),
    },
    pool && {
      key: "pool",
      label: selectedPool?.name ?? String(pool),
      onRemove: () => set({ pool: undefined }),
    },
    matchday && {
      key: "matchday",
      label: tMatches("matchdayLabel", { matchday }),
      onRemove: () => set({ matchday: undefined }),
    },
  ].filter(Boolean) as ActiveFilterChip[];

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

      <Grid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        <DebouncedInput
          variant="search"
          label={tMatches("searchClub")}
          value={q ?? ""}
          placeholder={tMatches("searchClubPlaceholder")}
          onChange={(value) => set({ q: value })}
          onClear={() => set({ q: undefined })}
          clearAriaLabel={tCommon("clearSearch")}
        />

        <Input
          id="date-filter"
          type="date"
          label={tMatches("date")}
          value={date ?? ""}
          onChange={(e) => set({ date: e.target.value || undefined })}
          leftIcon={<Calendar className="w-5 h-5" />}
        />

        <CategoryGenderSelects filters={filters} set={set} />

        <LevelLocationFilters
          filters={filters}
          set={set}
          committees={committees}
          leagues={leagues}
        />

        <CascadeSelect
          label={tCommon("filters.divisions")}
          value={division}
          onChange={(division) => set({ division })}
          enabled={isLocationSelected(level, committee, league)}
          options={divisions.map((div) => ({
            value: div,
            label: tCompetitions("divisionWithValue", { value: div }),
          }))}
          allLabel={tMatches("selectDivision")}
          waitLabel={tFilters("filters.selectLevelFirst")}
        />
        <CascadeSelect
          label={tCommon("filters.pools")}
          value={pool}
          onChange={(pool) => set({ pool })}
          enabled={!!division && !!category && !!gender}
          options={pools.map((p) => ({ value: p.id, label: p.name }))}
          allLabel={tCommon("filters.allPools")}
          waitLabel={
            division
              ? tFilters("filters.selectCategoryGenderFirst")
              : tFilters("filters.selectDivisionFirst")
          }
        />
        <CascadeSelect
          label={tMatches("matchday")}
          value={matchday}
          onChange={(matchday) => set({ matchday })}
          enabled={!!pool}
          options={Array.from({ length: matchdaysCount }, (_, i) => ({
            value: i + 1,
            label: tMatches("matchdayLabel", { matchday: i + 1 }),
          }))}
          allLabel={tMatches("allMatchdays")}
          waitLabel={tFilters("filters.selectPoolFirst")}
        />
      </Grid>
    </FiltersShell>
  );
}
