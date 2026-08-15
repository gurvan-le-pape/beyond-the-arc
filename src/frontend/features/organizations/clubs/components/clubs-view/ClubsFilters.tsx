// src/frontend/features/organizations/clubs/components/clubs-view/ClubsFilters.tsx
"use client";

import { useTranslations } from "next-intl";

import { useLocationOptions } from "@/features/organizations/hooks";
import { ErrorMessage } from "@/shared/components/feedback";
import type { ActiveFilterChip } from "@/shared/components/filters";
import { FiltersShell } from "@/shared/components/filters";
import { DebouncedInput, Select } from "@/shared/components/forms";

import type { ClubsFilterSetters, ClubsFilterState } from "../../hooks";

interface ClubsFiltersProps {
  readonly filters: ClubsFilterState;
  readonly setters: ClubsFilterSetters;
  readonly onReset: () => void;
}

export function ClubsFilters({ filters, setters, onReset }: ClubsFiltersProps) {
  const tCommon = useTranslations("common");
  const tOrganizations = useTranslations("organizations");

  const { search, leagueId, committeeId } = filters;
  const { setSearch, setLeagueId, setCommitteeId } = setters;

  const {
    leagues,
    committees,
    error: locationError,
    retry: retryLocation,
  } = useLocationOptions({ leagueId });

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </FiltersShell>
  );
}
