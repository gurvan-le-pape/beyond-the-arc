// src/frontend/features/organizations/clubs/components/club-directory/ClubsFilters.tsx
"use client";

import { useTranslations } from "next-intl";

import {
  useDropUnknownLocation,
  useLocationOptions,
} from "@/features/organizations/hooks";
import { ErrorMessage } from "@/shared/components/feedback";
import type { ActiveFilterChip } from "@/shared/components/filters";
import { FiltersShell } from "@/shared/components/filters";
import { DebouncedInput, Select } from "@/shared/components/forms";
import { Grid } from "@/shared/components/primitives";

import type {
  ClubsFilterSetters,
  ClubsFilterState,
} from "./useClubsFilterState";

interface ClubsFiltersProps {
  readonly filters: ClubsFilterState;
  readonly setters: ClubsFilterSetters;
  readonly onReset: () => void;
}

/**
 * The filter panel for the clubs list — name search, and the level →
 * committee/league cascade.
 *
 * Holds no state: values and setters come from the caller's filter hook. The
 * committee select is gated on a league being chosen, because committees are
 * only meaningful once a league scopes them.
 */
export function ClubsFilters({ filters, setters, onReset }: ClubsFiltersProps) {
  const tCommon = useTranslations("common");
  const tOrganizations = useTranslations("organizations");

  const { search, leagueId, committeeId } = filters;
  const { setSearch, setLeagueId, setCommitteeId } = setters;

  const locationOptions = useLocationOptions({ leagueId });
  const {
    leagues,
    committees,
    error: locationError,
    retry: retryLocation,
  } = locationOptions;

  useDropUnknownLocation(locationOptions, {
    leagueId,
    setLeagueId,
    committeeId,
    setCommitteeId,
  });

  const leagueOptions = [
    { value: "", label: tCommon("filters.allLeagues") },
    ...leagues.map((league) => ({
      value: String(league.id),
      label: league.name,
    })),
  ];

  const committeeOptions = [
    { value: "", label: tCommon("filters.allCommittees") },
    ...committees.map((committee) => ({
      value: String(committee.id),
      label: committee.name,
    })),
  ];

  const selectedLeague = leagues.find((league) => league.id === leagueId);
  const selectedCommittee = committees.find(
    (committee) => committee.id === committeeId,
  );

  const chips = [
    search && {
      key: "search",
      label: `"${search}"`,
      onRemove: () => setSearch(""),
    },
    leagueId && {
      key: "league",
      label: selectedLeague?.name ?? String(leagueId),
      onRemove: () => setLeagueId(undefined),
    },
    committeeId && {
      key: "committee",
      label: selectedCommittee?.name ?? String(committeeId),
      onRemove: () => setCommitteeId(undefined),
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

      <DebouncedInput
        variant="search"
        label={tOrganizations("clubs.searchLabel")}
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
        placeholder={tOrganizations("clubs.searchPlaceholder")}
        clearAriaLabel={tCommon("clearSearch")}
      />

      <Grid columns={{ base: 1, md: 2 }} gap={4}>
        <Select
          label={tCommon("filters.leagues")}
          options={leagueOptions}
          value={leagueId ?? ""}
          onChange={(val) => setLeagueId(Number(val) || undefined)}
        />

        {/* Committees are only meaningful once a league scopes them. */}
        {leagueId && (
          <Select
            label={tCommon("filters.committees")}
            options={committeeOptions}
            value={committeeId ?? ""}
            onChange={(val) => setCommitteeId(Number(val) || undefined)}
          />
        )}
      </Grid>
    </FiltersShell>
  );
}
