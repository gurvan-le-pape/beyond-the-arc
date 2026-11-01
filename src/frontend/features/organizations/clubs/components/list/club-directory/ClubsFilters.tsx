// src/frontend/features/organizations/clubs/components/list/club-directory/ClubsFilters.tsx
"use client";

import { useTranslations } from "next-intl";

import {
  useDropUnknownLocation,
  useLocationOptions,
} from "@/features/organizations/hooks";
import { ErrorMessage } from "@/shared/components/feedback";
import type { ActiveFilterChip } from "@/shared/components/filters";
import { FiltersShell } from "@/shared/components/filters";
import { DebouncedSearchField, Select } from "@/shared/components/forms";
import { Grid } from "@/shared/components/primitives";
import type { FilterProps } from "@/shared/hooks";

import type { ClubsFilterValues } from "./useClubsFilterState";

interface ClubsFiltersProps extends FilterProps<ClubsFilterValues> {
  readonly onReset: () => void;
}

/**
 * The filter panel for the clubs list — name search, and the level →
 * committee/league cascade.
 *
 * Holds no state: values and `set` come from the caller's filter hook. The
 * committee select is gated on a league being chosen, because committees are
 * only meaningful once a league scopes them.
 */
export function ClubsFilters({ filters, set, onReset }: ClubsFiltersProps) {
  const tCommon = useTranslations("common");
  const tOrganizations = useTranslations("organizations");

  const { q, league, committee } = filters;

  const locationOptions = useLocationOptions({ leagueId: league });
  const {
    leagues,
    committees,
    error: locationError,
    retry: retryLocation,
  } = locationOptions;

  useDropUnknownLocation(locationOptions, { filters, set });

  const leagueOptions = [
    { value: undefined, label: tCommon("filters.allLeagues") },
    ...leagues.map((option) => ({ value: option.id, label: option.name })),
  ];

  const committeeOptions = [
    { value: undefined, label: tCommon("filters.allCommittees") },
    ...committees.map((option) => ({ value: option.id, label: option.name })),
  ];

  const selectedLeague = leagues.find((option) => option.id === league);
  const selectedCommittee = committees.find(
    (option) => option.id === committee,
  );

  const chips = [
    q && {
      key: "search",
      label: `"${q}"`,
      onRemove: () => set({ q: undefined }),
    },
    league && {
      key: "league",
      label: selectedLeague?.name ?? String(league),
      onRemove: () => set({ league: undefined }),
    },
    committee && {
      key: "committee",
      label: selectedCommittee?.name ?? String(committee),
      onRemove: () => set({ committee: undefined }),
    },
  ].filter(Boolean) as ActiveFilterChip[];

  return (
    <FiltersShell
      activeFilterCount={chips.length}
      chips={chips}
      onReset={onReset}
      title={tOrganizations("clubs.label")}
    >
      {locationError && (
        <ErrorMessage
          message={tCommon("errors.fetchLeagueOrCommittee")}
          onRetry={retryLocation}
        />
      )}

      <DebouncedSearchField
        label={tOrganizations("clubs.searchLabel")}
        value={q ?? ""}
        onChange={(value) => set({ q: value })}
        onClear={() => set({ q: undefined })}
        placeholder={tOrganizations("clubs.searchPlaceholder")}
      />

      <Grid columns={{ base: 1, md: 2 }} gap={4}>
        <Select
          label={tCommon("filters.leagues")}
          options={leagueOptions}
          value={league}
          onChange={(league) => set({ league })}
        />

        {/* Committees are only meaningful once a league scopes them. */}
        {league && (
          <Select
            label={tCommon("filters.committees")}
            options={committeeOptions}
            value={committee}
            onChange={(committee) => set({ committee })}
          />
        )}
      </Grid>
    </FiltersShell>
  );
}
