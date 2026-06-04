// src/frontend/features/players/components/list/PlayersFilters.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useCommitteeLeagueClubFilters } from "@/features/competitions/championships/hooks";
import { useClubSearch } from "@/features/organizations/clubs/api";
import { ErrorMessage } from "@/shared/components/feedback";
import { FiltersShell } from "@/shared/components/filters/FiltersShell";
import { LevelLocationFilters } from "@/shared/components/filters/LevelLocationFilters";
import { Input, Select } from "@/shared/components/forms";
import { ComboBox } from "@/shared/components/primitives";
import type { Category, Gender } from "@/shared/constants";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
} from "@/shared/constants";
import { useDebounce } from "@/shared/hooks";

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

  const {
    committees,
    leagues,
    error: locationError,
  } = useCommitteeLeagueClubFilters();

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

  const [clubSearch, setClubSearch] = useState("");
  const debouncedClubSearch = useDebounce(clubSearch, 300);
  const { data: clubData, isLoading: clubsLoading } = useClubSearch(
    debouncedClubSearch,
    { committeeId, leagueId },
  );
  const clubOptions = (clubData?.items ?? []).map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const { data: playerFilterValues } = usePlayerFilterValues({
    committeeId,
    leagueId,
  });
  const playerNumbers = playerFilterValues?.numbers ?? [];
  const teamNumbers = playerFilterValues?.teamNumbers ?? [];

  const locationLabel =
    level === CompetitionLevel.DEPARTMENTAL
      ? committees.find((c) => c.id === committeeId)?.name
      : leagues.find((l) => l.id === leagueId)?.name;

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
    category && {
      key: "category",
      label: tCommon(`category.${category}`),
      onRemove: () => setCategory(undefined),
    },
    gender && {
      key: "gender",
      label: tCommon(`gender.${gender}`),
      onRemove: () => setGender(undefined),
    },
    number && {
      key: "number",
      label: `#${number}`,
      onRemove: () => setNumber(undefined),
    },
    teamNumber && {
      key: "teamNumber",
      label: `${tCommon("filters.teamNumbers")} ${teamNumber}`,
      onRemove: () => setTeamNumber(undefined),
    },
    level && {
      key: "level",
      label: tCommon(`competition.levels.${level.toLowerCase()}`),
      onRemove: () => setLevel(undefined),
    },
    locationLabel && {
      key: "location",
      label: locationLabel,
      onRemove: () => {
        setCommitteeId(undefined);
        setLeagueId(undefined);
      },
    },
  ].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

  const categoryOptions = [
    { value: "", label: tCommon("filters.allCategories") },
    ...CATEGORY_LIST.map((cat) => ({
      value: cat,
      label: tCommon(`category.${cat}`),
    })),
  ];

  const genderOptions = [
    { value: "", label: tCommon("filters.allGenders") },
    ...GENDER_LIST.map((g) => ({
      value: g,
      label: tCommon(`gender.${g}`),
    })),
  ];

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
        <ErrorMessage message={tCommon("errors.fetchLeagueOrCommittee")} />
      )}

      {/* Row 1: Name search + Club */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          variant="search"
          label={tPlayers("filters.searchName")}
          value={name}
          placeholder={tPlayers("filters.searchNamePlaceholder")}
          onChange={(e) => setName(e.target.value)}
          onClear={() => setName("")}
          clearAriaLabel={tCommon("clearSearch")}
        />
        <ComboBox
          label={tCommon("filters.clubs")}
          placeholder={tCommon("filters.allClubs")}
          options={clubOptions}
          value={clubId ? String(clubId) : undefined}
          onChange={(val) => {
            const parsed = Number(val) || undefined;
            setClubId(parsed);
            setSelectedClubName(
              clubOptions.find((c) => c.value === String(val ?? ""))?.label ??
                "",
            );
          }}
          onSearchChange={setClubSearch}
          isLoading={clubsLoading}
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
