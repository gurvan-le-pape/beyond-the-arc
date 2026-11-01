// src/frontend/features/players/components/list/PlayersFilters.tsx
"use client";

import { useTranslations } from "next-intl";

import { ClubComboBoxFilter } from "@/features/organizations/clubs/components";
import {
  useDropUnknownLocation,
  useLocationOptions,
} from "@/features/organizations/hooks";
import { ErrorMessage } from "@/shared/components/feedback";
import type { ActiveFilterChip } from "@/shared/components/filters";
import {
  CategoryGenderSelects,
  FiltersShell,
  LevelLocationFilters,
  useCommonFilterChips,
} from "@/shared/components/filters";
import { DebouncedSearchField, Select } from "@/shared/components/forms";
import { Grid } from "@/shared/components/primitives";
import type { FilterProps } from "@/shared/hooks";

import { usePlayerFilterValues } from "../../api";
import type { PlayersFilterValues } from "../../hooks/usePlayersFilterState";

interface PlayersFiltersProps extends FilterProps<PlayersFilterValues> {
  readonly onReset: () => void;
}

/**
 * The filter panel for the players list — name search, club, category, gender,
 * jersey and team number, and the level → committee/league cascade.
 *
 * Holds no state of its own: `filters` and `set` come from
 * `usePlayersFilterState`, which also owns the reset-to-page-1 behaviour. Wiring
 * it to hand-rolled state instead loses that.
 *
 * Two option sources are fetched here rather than passed in — `useLocationOptions`
 * for committees and leagues, `usePlayerFilterValues` for the jersey and team
 * numbers that actually occur. The latter is not optional: without it those
 * dropdowns render empty, which reads as "no players match" rather than as a
 * failure. Location errors surface inline with a retry; the rest of the panel
 * stays usable.
 */
export function PlayersFilters({ filters, set, onReset }: PlayersFiltersProps) {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");

  const locationOptions = useLocationOptions();
  const {
    committees,
    leagues,
    error: locationError,
    retry: retryLocation,
  } = locationOptions;

  const { q, club, clubName, number, teamNumber, committee, league } = filters;

  useDropUnknownLocation(locationOptions, { filters, set });

  const {
    data: playerFilterValues,
    isError: filterValuesFailed,
    refetch: retryFilterValues,
  } = usePlayerFilterValues({ committeeId: committee, leagueId: league });
  const playerNumbers = playerFilterValues?.numbers ?? [];
  const teamNumbers = playerFilterValues?.teamNumbers ?? [];

  const { categoryGenderChips, levelLocationChips } = useCommonFilterChips({
    filters,
    set,
    committees,
    leagues,
  });

  const chips = [
    q && {
      key: "name",
      label: `"${q}"`,
      onRemove: () => set({ q: undefined }),
    },
    club && {
      key: "club",
      label: clubName || String(club),
      onRemove: () => set({ club: undefined, clubName: undefined }),
    },
    ...categoryGenderChips,
    number && {
      key: "number",
      label: `#${number}`,
      onRemove: () => set({ number: undefined }),
    },
    teamNumber && {
      key: "teamNumber",
      label: tTeams("teamNumber", { number: teamNumber }),
      onRemove: () => set({ teamNumber: undefined }),
    },
    ...levelLocationChips,
  ].filter(Boolean) as ActiveFilterChip[];

  const playerNumberOptions = [
    { value: undefined, label: tCommon("filters.allPlayerNumbers") },
    ...playerNumbers.map((n) => ({ value: n, label: String(n) })),
  ];

  const teamNumberOptions = [
    { value: undefined, label: tCommon("filters.allTeamNumbers") },
    ...teamNumbers.map((n) => ({ value: n, label: String(n) })),
  ];

  return (
    <FiltersShell
      activeFilterCount={chips.length}
      chips={chips}
      onReset={onReset}
      title={tPlayers("label")}
    >
      {locationError && (
        <ErrorMessage
          message={tCommon("errors.fetchLeagueOrCommittee")}
          onRetry={retryLocation}
        />
      )}

      {/* Without this the number dropdowns render empty, which reads as "this
          scope has no players" rather than a failed request. */}
      {filterValuesFailed && (
        <ErrorMessage
          message={tCommon("errors.fetchPlayers")}
          onRetry={retryFilterValues}
        />
      )}

      <Grid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        <DebouncedSearchField
          label={tPlayers("filters.searchName")}
          value={q ?? ""}
          placeholder={tPlayers("filters.searchNamePlaceholder")}
          onChange={(value) => set({ q: value })}
          onClear={() => set({ q: undefined })}
        />
        <ClubComboBoxFilter
          committeeId={committee}
          leagueId={league}
          clubId={club}
          clubName={clubName}
          onChange={(club, clubName) => set({ club, clubName })}
        />

        <CategoryGenderSelects filters={filters} set={set} />

        <Select
          label={tCommon("filters.playerNumbers")}
          options={playerNumberOptions}
          value={number}
          onChange={(number) => set({ number })}
          placeholder={tCommon("filters.allPlayerNumbers")}
        />
        <Select
          label={tCommon("filters.teamNumbers")}
          options={teamNumberOptions}
          value={teamNumber}
          onChange={(teamNumber) => set({ teamNumber })}
          placeholder={tCommon("filters.allTeamNumbers")}
        />

        <LevelLocationFilters
          filters={filters}
          set={set}
          committees={committees}
          leagues={leagues}
        />
      </Grid>
    </FiltersShell>
  );
}
