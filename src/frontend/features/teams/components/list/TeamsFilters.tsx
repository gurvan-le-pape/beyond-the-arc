// src/frontend/features/teams/components/list/TeamsFilters.tsx
"use client";

import { useTranslations } from "next-intl";

import { useChampionshipCascadeOptions } from "@/features/competitions/championships/hooks";
import { ClubComboBoxFilter } from "@/features/organizations/clubs/components";
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
import { NumberField } from "@/shared/components/forms";
import { Grid } from "@/shared/components/primitives";
import type { FilterProps } from "@/shared/hooks";

import type { TeamsFilterValues } from "../../hooks";

interface TeamsFiltersProps extends FilterProps<TeamsFilterValues> {
  readonly onReset: () => void;
}

/**
 * The filter panel for the teams list — club, team number, category, gender,
 * the level → committee/league cascade, and the division → pool cascade.
 *
 * Holds no state: `filters` and `set` come from `useTeamsFilterState`, which
 * also owns the reset-to-page-1 behaviour and the cascade clearing.
 *
 * **The division → pool cascade stays disabled until a location is chosen.**
 * `isLocationSelected` gates it, because divisions only mean something within a
 * committee or league; the steps render dimmed rather than hidden so the panel
 * does not change shape as filters are filled in.
 *
 * The pool step also waits for a category and gender: only with both does the
 * division name one championship, whose pools are the options.
 *
 * Option sources are fetched here rather than passed in — `useLocationOptions`
 * for committees and leagues, `useChampionshipCascadeOptions` for divisions and
 * pools (the matches filters use the same). Each surfaces its own error and
 * retry, so a failed lookup reads as a failure instead of as an empty dropdown.
 * The team number is typed, so it needs no options.
 */
export function TeamsFilters({ filters, set, onReset }: TeamsFiltersProps) {
  const tTeams = useTranslations("teams");
  const tCommon = useTranslations("common");
  const tMatches = useTranslations("matches");
  const tCompetitions = useTranslations("competitions");
  const tFilters = useTranslations("filters");

  const locationOptions = useLocationOptions();
  const {
    committees,
    leagues,
    error: locationError,
    retry: retryLocation,
  } = locationOptions;

  const {
    club,
    clubName,
    number,
    category,
    gender,
    level,
    committee,
    league,
    division,
    pool,
  } = filters;

  useDropUnknownLocation(locationOptions, { filters, set });

  const {
    divisions,
    pools,
    isError: cascadeFailed,
    retry: retryCascade,
  } = useChampionshipCascadeOptions(filters);
  const selectedPool = pools.find((p) => p.id === pool);

  const { categoryGenderChips, levelLocationChips } = useCommonFilterChips({
    filters,
    set,
    committees,
    leagues,
  });

  const chips = [
    club && {
      key: "club",
      label: clubName || String(club),
      onRemove: () => set({ club: undefined, clubName: undefined }),
    },
    number && {
      key: "number",
      label: tTeams("teamNumber", { number }),
      onRemove: () => set({ number: undefined }),
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
      label: selectedPool
        ? tTeams("poolLabel", { letter: selectedPool.letter })
        : String(pool),
      onRemove: () => set({ pool: undefined }),
    },
  ].filter(Boolean) as ActiveFilterChip[];

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

      {/* Without this the division and pool dropdowns render empty, which
          reads as "this scope has none" rather than a failed request. */}
      {cascadeFailed && (
        <ErrorMessage
          message={tCommon("errors.fetchChampionships")}
          onRetry={retryCascade}
        />
      )}

      <Grid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        <ClubComboBoxFilter
          committeeId={committee}
          leagueId={league}
          clubId={club}
          clubName={clubName}
          onChange={(club, clubName) => set({ club, clubName })}
        />

        <NumberField
          label={tCommon("filters.teamNumbers")}
          value={number}
          onChange={(number) => set({ number })}
          minValue={1}
          placeholder={tCommon("filters.allTeamNumbers")}
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
          options={pools.map((p) => ({
            value: p.id,
            label: tTeams("poolLabel", { letter: p.letter }),
          }))}
          allLabel={tCommon("filters.allPools")}
          waitLabel={
            division
              ? tFilters("filters.selectCategoryGenderFirst")
              : tFilters("filters.selectDivisionFirst")
          }
        />
      </Grid>
    </FiltersShell>
  );
}
