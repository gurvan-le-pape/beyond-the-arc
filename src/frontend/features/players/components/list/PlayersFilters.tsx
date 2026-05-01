// src/frontend/features/players/components/list/PlayersFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { ClubSearchField } from "@/shared/components/filters/ClubSearchField";
import { FiltersShell } from "@/shared/components/filters/FiltersShell";
import { LevelLocationFilters } from "@/shared/components/filters/LevelLocationFilters";
import { Input, Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
} from "@/shared/constants";

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

  const locationLabel =
    level === CompetitionLevel.DEPARTMENTAL
      ? committees.find((c) => c.id === committeeId)?.name
      : leagues.find((l) => l.id === leagueId)?.name;

  const chips = [
    name && {
      key: "name",
      label: `"${name}"`,
      onRemove: () => setName(""),
    },
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

        <ClubSearchField
          committeeId={committeeId}
          leagueId={leagueId}
          clubId={clubId}
          setClubId={setClubId}
          setSelectedClubName={setSelectedClubName}
          label={tCommon("filters.clubs")}
          placeholder={tCommon("filters.allClubs")}
        />
      </div>

      {/* Row 2: Category + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="category-filter"
          label={tCommon("filters.categories")}
          value={category ?? ""}
          onChange={(e) =>
            setCategory((e.target.value as Category) || undefined)
          }
        >
          <option value="">{tCommon("filters.allCategories")}</option>
          {CATEGORY_LIST.map((cat) => (
            <option key={cat} value={cat}>
              {tCommon(`category.${cat}`)}
            </option>
          ))}
        </Select>

        <Select
          id="gender-filter"
          label={tCommon("filters.genders")}
          value={gender ?? ""}
          onChange={(e) => setGender((e.target.value as Gender) || undefined)}
        >
          <option value="">{tCommon("filters.allGenders")}</option>
          {GENDER_LIST.map((g) => (
            <option key={g} value={g}>
              {tCommon(`gender.${g}`)}
            </option>
          ))}
        </Select>
      </div>

      {/* Row 3: Player number + Team number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="number-filter"
          label={tCommon("filters.playerNumbers")}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        >
          <option value="">{tCommon("filters.allPlayerNumbers")}</option>
          {playerNumbers.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>

        <Select
          id="team-filter"
          label={tCommon("filters.teamNumbers")}
          value={teamNumber}
          onChange={(e) => setTeamNumber(e.target.value)}
        >
          <option value="">{tCommon("filters.allTeamNumbers")}</option>
          {teamNumbers.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
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
