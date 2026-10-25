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
import { DebouncedInput, Select } from "@/shared/components/forms";
import { Grid } from "@/shared/components/primitives";

import { usePlayerFilterValues } from "../../api";
import type {
  PlayersFilterSetters,
  PlayersFilterState,
} from "../../hooks/usePlayersFilterState";

interface PlayersFiltersProps {
  readonly filters: PlayersFilterState;
  readonly setters: PlayersFilterSetters;
  readonly onReset: () => void;
}

/**
 * The filter panel for the players list — name search, club, category, gender,
 * jersey and team number, and the level → committee/league cascade.
 *
 * Holds no state of its own: `filters` and `setters` come from
 * `usePlayersFilterState`, which also owns the reset-to-page-1 behaviour. Wiring
 * it to hand-rolled state instead loses that.
 *
 * Two option sources are fetched here rather than passed in — `useLocationOptions`
 * for committees and leagues, `usePlayerFilterValues` for the jersey and team
 * numbers that actually occur. The latter is not optional: without it those
 * dropdowns render empty, which reads as "no players match" rather than as a
 * failure. Location errors surface inline with a retry; the rest of the panel
 * stays usable.
 *
 * Rendered inside `FiltersShell`, so this subtree exists **twice** in the DOM —
 * once in the mobile sheet, once in the desktop card. Nothing here may rely on a
 * unique `id` or on being mounted once.
 */
export function PlayersFilters({
  filters,
  setters,
  onReset,
}: PlayersFiltersProps) {
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

  const {
    name,
    clubId,
    selectedClubName,
    category,
    gender,
    number,
    teamNumber,
    level,
    committeeId,
    leagueId,
  } = filters;

  const {
    setName,
    setClubId,
    setSelectedClubName,
    setCategory,
    setGender,
    setNumber,
    setTeamNumber,
    setLevel,
    setCommitteeId,
    setLeagueId,
  } = setters;

  useDropUnknownLocation(locationOptions, {
    leagueId,
    setLeagueId,
    committeeId,
    setCommitteeId,
  });

  const {
    data: playerFilterValues,
    isError: filterValuesFailed,
    refetch: retryFilterValues,
  } = usePlayerFilterValues({
    committeeId,
    leagueId,
  });
  const playerNumbers = playerFilterValues?.numbers ?? [];
  const teamNumbers = playerFilterValues?.teamNumbers ?? [];

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
    name && { key: "name", label: `"${name}"`, onRemove: () => setName("") },
    clubId && {
      key: "club",
      label: selectedClubName || String(clubId),
      onRemove: () => {
        setClubId(undefined);
        setSelectedClubName("");
      },
    },
    ...categoryGenderChips,
    number && {
      key: "number",
      label: `#${number}`,
      onRemove: () => setNumber(undefined),
    },
    teamNumber && {
      key: "teamNumber",
      label: tTeams("teamNumber", { number: teamNumber }),
      onRemove: () => setTeamNumber(undefined),
    },
    ...levelLocationChips,
  ].filter(Boolean) as ActiveFilterChip[];

  const playerNumberOptions = [
    { value: "", label: tCommon("filters.allPlayerNumbers") },
    ...playerNumbers.map((n) => ({ value: String(n), label: String(n) })),
  ];

  const teamNumberOptions = [
    { value: "", label: tCommon("filters.allTeamNumbers") },
    ...teamNumbers.map((n) => ({ value: String(n), label: String(n) })),
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
        <DebouncedInput
          variant="search"
          label={tPlayers("filters.searchName")}
          value={name}
          placeholder={tPlayers("filters.searchNamePlaceholder")}
          onChange={setName}
          onClear={() => setName("")}
          clearAriaLabel={tCommon("clearSearch")}
        />
        <ClubComboBoxFilter
          committeeId={committeeId}
          leagueId={leagueId}
          clubId={clubId}
          setClubId={setClubId}
          setSelectedClubName={setSelectedClubName}
        />

        <CategoryGenderSelects
          category={category}
          setCategory={setCategory}
          gender={gender}
          setGender={setGender}
        />

        <Select
          label={tCommon("filters.playerNumbers")}
          options={playerNumberOptions}
          value={number ?? ""}
          onChange={(val) => setNumber(Number(val) || undefined)}
          placeholder={tCommon("filters.allPlayerNumbers")}
        />
        <Select
          label={tCommon("filters.teamNumbers")}
          options={teamNumberOptions}
          value={teamNumber ?? ""}
          onChange={(val) => setTeamNumber(Number(val) || undefined)}
          placeholder={tCommon("filters.allTeamNumbers")}
        />

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
      </Grid>
    </FiltersShell>
  );
}

export default PlayersFilters;
