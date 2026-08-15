// src/frontend/features/players/components/list/PlayersFilters.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { ClubComboBoxFilter } from "@/features/organizations/clubs/components";
import { useLocationOptions } from "@/features/organizations/hooks";
import { ErrorMessage } from "@/shared/components/feedback";
import type { ActiveFilterChip } from "@/shared/components/filters";
import {
  FiltersShell,
  LevelLocationFilters,
  useCategoryGenderOptions,
  useCommonFilterChips,
} from "@/shared/components/filters";
import { DebouncedInput, Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";

import { usePlayerFilterValues } from "../../api";
import type {
  PlayersFilterSetters,
  PlayersFilterState,
} from "../../hooks/usePlayersFilterState";

interface PlayersFiltersProps {
  filters: PlayersFilterState;
  setters: PlayersFilterSetters;
  onReset: () => void;
}

export const PlayersFilters: React.FC<PlayersFiltersProps> = ({
  filters,
  setters,
  onReset,
}) => {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");

  const {
    committees,
    leagues,
    error: locationError,
    retry: retryLocation,
  } = useLocationOptions();

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

  const { categoryOptions, genderOptions } = useCategoryGenderOptions();
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

      {/* Row 1: Name search + Club */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Row 2: Category + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={tCommon("filters.categories")}
          options={categoryOptions}
          value={category ?? ""}
          onChange={(val) => setCategory((val as Category) || undefined)}
          placeholder={tCommon("filters.allCategories")}
        />

        <Select
          label={tCommon("filters.genders")}
          options={genderOptions}
          value={gender ?? ""}
          onChange={(val) => setGender((val as Gender) || undefined)}
          placeholder={tCommon("filters.allGenders")}
        />
      </div>

      {/* Row 3: Player number + Team number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Divider */}
      <div className="border-t border-divide" />

      {/* Row 4: Level → Committee/League */}
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
    </FiltersShell>
  );
};

export default PlayersFilters;
