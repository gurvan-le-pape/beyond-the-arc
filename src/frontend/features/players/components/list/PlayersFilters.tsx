// src/frontend/features/players/components/list/PlayersFilters.tsx
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useClubSearch } from "@/features/organizations/clubs/api";
import { FiltersShell } from "@/shared/components/filters/FiltersShell";
import { LevelLocationFilters } from "@/shared/components/filters/LevelLocationFilters";
import { Input } from "@/shared/components/forms";
import { Select } from "@/shared/components/forms/Select";
import { ComboBox } from "@/shared/components/primitives/ComboBox";
import type { Category, Gender } from "@/shared/constants";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
} from "@/shared/constants";
import { useDebounce } from "@/shared/hooks";

interface PlayersFiltersProps {
  // Name search
  name: string;
  setName: (value: string) => void;
  // Category & Gender
  category: Category | undefined;
  setCategory: (value: Category | undefined) => void;
  gender: Gender | undefined;
  setGender: (value: Gender | undefined) => void;
  // Level & Location
  level: CompetitionLevel | undefined;
  setLevel: (value: CompetitionLevel | undefined) => void;
  committeeId: number | undefined;
  setCommitteeId: (value: number | undefined) => void;
  leagueId: number | undefined;
  setLeagueId: (value: number | undefined) => void;
  committees: any[];
  leagues: any[];
  // Club
  clubId: string;
  setClubId: (value: string) => void;
  selectedClubName: string;
  setSelectedClubName: (value: string) => void;
  // Player number
  number: string;
  setNumber: (value: string) => void;
  playerNumbers: number[];
  // Team number
  teamNumber: string;
  setTeamNumber: (value: string) => void;
  teamNumbers: number[];
  // Reset
  onReset: () => void;
}

export const PlayersFilters: React.FC<PlayersFiltersProps> = ({
  name,
  setName,
  category,
  setCategory,
  gender,
  setGender,
  level,
  setLevel,
  committeeId,
  setCommitteeId,
  leagueId,
  setLeagueId,
  committees,
  leagues,
  clubId,
  setClubId,
  selectedClubName,
  setSelectedClubName,
  number,
  setNumber,
  playerNumbers,
  teamNumber,
  setTeamNumber,
  teamNumbers,
  onReset,
}) => {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");

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

  const locationLabel =
    level === CompetitionLevel.DEPARTMENTAL
      ? committees.find((c) => c.id === committeeId)?.name
      : leagues.find((l) => l.id === leagueId)?.name;

  const chips = [
    name && { key: "name", label: `"${name}"`, onRemove: () => setName("") },
    clubId && {
      key: "club",
      label: selectedClubName || clubId,
      onRemove: () => {
        setClubId("");
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
      onRemove: () => setNumber(""),
    },
    teamNumber && {
      key: "teamNumber",
      label: `${tCommon("filters.teamNumbers")} ${teamNumber}`,
      onRemove: () => setTeamNumber(""),
    },
    level && {
      key: "level",
      label: tCommon(`competition.levels.${level.toLowerCase()}`),
      onRemove: () => {
        setLevel(undefined);
        setCommitteeId(undefined);
        setLeagueId(undefined);
      },
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
          value={clubId || undefined}
          onChange={(val) => {
            setClubId(String(val ?? ""));
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
          value={number}
          onChange={(val) => setNumber(String(val ?? ""))}
          placeholder={tCommon("filters.allPlayerNumbers")}
        />

        <Select
          label={tCommon("filters.teamNumbers")}
          options={teamNumberOptions}
          value={teamNumber}
          onChange={(val) => setTeamNumber(String(val ?? ""))}
          placeholder={tCommon("filters.allTeamNumbers")}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-divide-light dark:border-divide-dark" />

      {/* Row 4: Level → Committee/League cascade */}
      <LevelLocationFilters
        level={level}
        setLevel={(val) => {
          setLevel(val);
          setCommitteeId(undefined);
          setLeagueId(undefined);
        }}
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
