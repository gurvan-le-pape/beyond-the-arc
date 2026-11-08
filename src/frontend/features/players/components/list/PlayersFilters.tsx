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
import { DebouncedSearchField, NumberField } from "@/shared/components/forms";
import { Grid } from "@/shared/components/primitives";
import type { FilterProps } from "@/shared/hooks";

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
 * Committees and leagues are fetched here by `useLocationOptions`; a failure
 * surfaces inline with a retry and the rest of the panel stays usable. Jersey
 * and team numbers are typed, so they need no options.
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

      <Grid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        <DebouncedSearchField
          labels={{ clear: tCommon("clearSearch") }}
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

        <NumberField
          label={tCommon("filters.playerNumbers")}
          value={number}
          onChange={(number) => set({ number })}
          minValue={1}
          placeholder={tCommon("filters.allPlayerNumbers")}
        />
        <NumberField
          label={tCommon("filters.teamNumbers")}
          value={teamNumber}
          onChange={(teamNumber) => set({ teamNumber })}
          minValue={1}
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
