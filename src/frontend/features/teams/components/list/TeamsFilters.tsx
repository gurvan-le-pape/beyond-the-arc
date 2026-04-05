// src/frontend/features/teams/components/list/TeamsFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { CascadeStep } from "@/shared/components/filters/CascadeSelects";
import { CascadeSelects } from "@/shared/components/filters/CascadeSelects";
import { ClubSearchField } from "@/shared/components/filters/ClubSearchField";
import { FiltersShell } from "@/shared/components/filters/FiltersShell";
import { LevelLocationFilters } from "@/shared/components/filters/LevelLocationFilters";
import { Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
} from "@/shared/constants";

interface TeamsFiltersProps {
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
  // Team number
  number: string;
  setNumber: (value: string) => void;
  teamNumbers: number[];
  // Division + Pool
  division: string;
  setDivision: (value: string) => void;
  divisions: (string | number)[];
  pool: string;
  setPool: (value: string) => void;
  poolLetters: string[];
  // Reset
  onReset: () => void;
}

export const TeamsFilters: React.FC<TeamsFiltersProps> = ({
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
  teamNumbers,
  division,
  setDivision,
  divisions,
  pool,
  setPool,
  poolLetters,
  onReset,
}) => {
  const tTeams = useTranslations("teams");
  const tCommon = useTranslations("common");
  const tMatches = useTranslations("matches");
  const tFilters = useTranslations("filters");

  const locationLabel =
    level === CompetitionLevel.DEPARTMENTAL
      ? committees.find((c) => c.id === committeeId)?.name
      : leagues.find((l) => l.id === leagueId)?.name;

  const locationSelected =
    (level === CompetitionLevel.DEPARTMENTAL && committeeId) ||
    (level === CompetitionLevel.REGIONAL && leagueId);

  const chips = [
    clubId && {
      key: "club",
      label: selectedClubName || clubId,
      onRemove: () => {
        setClubId("");
        setSelectedClubName("");
      },
    },
    number && {
      key: "number",
      label: `${tTeams("filters.teamNumber")} ${number}`,
      onRemove: () => setNumber(""),
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
    level && {
      key: "level",
      label: tCommon(`competition.levels.${level.toLowerCase()}`),
      onRemove: () => {
        setLevel(undefined);
        setCommitteeId(undefined);
        setLeagueId(undefined);
        setDivision("");
        setPool("");
      },
    },
    locationLabel && {
      key: "location",
      label: locationLabel,
      onRemove: () => {
        setCommitteeId(undefined);
        setLeagueId(undefined);
        setDivision("");
        setPool("");
      },
    },
    division && {
      key: "division",
      label: tMatches("divisionLabel", { div: division }),
      onRemove: () => {
        setDivision("");
        setPool("");
      },
    },
    pool && {
      key: "pool",
      label: tTeams("poolLabel", { letter: pool }),
      onRemove: () => setPool(""),
    },
  ].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

  const cascadeSteps: CascadeStep[] = [
    {
      id: "division-filter",
      label: tMatches("division"),
      value: division,
      onChange: (val) => {
        setDivision(val);
        setPool("");
      },
      enabled: !!locationSelected,
      options: divisions.map((div) => ({
        value: div,
        label: tMatches("divisionLabel", { div }),
      })),
      allLabel: tMatches("selectDivision"),
      waitLabel: tFilters("filters.selectLevelFirst"),
    },
    {
      id: "pool-filter",
      label: tMatches("pool"),
      value: pool,
      onChange: setPool,
      enabled: !!division,
      options: poolLetters.map((letter) => ({
        value: letter,
        label: tTeams("poolLabel", { letter }),
      })),
      allLabel: tMatches("allPools"),
      waitLabel: tFilters("filters.selectDivisionFirst"),
    },
  ];

  return (
    <FiltersShell
      activeFilterCount={chips.length}
      chips={chips}
      onReset={onReset}
      title={tTeams("label")}
    >
      {/* Row 1: Club + Team number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClubSearchField
          committeeId={committeeId}
          leagueId={leagueId}
          clubId={clubId}
          setClubId={setClubId}
          setSelectedClubName={setSelectedClubName}
          label={tTeams("filters.club")}
          placeholder={tTeams("filters.allClubs")}
        />

        <Select
          id="number-filter"
          label={tTeams("filters.teamNumber")}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        >
          <option value="">{tTeams("filters.allTeams")}</option>
          {teamNumbers.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </div>

      {/* Row 2: Category + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="category-filter"
          label={tMatches("category")}
          value={category ?? ""}
          onChange={(e) =>
            setCategory((e.target.value as Category) || undefined)
          }
        >
          <option value="">{tMatches("allCategories")}</option>
          {CATEGORY_LIST.map((cat) => (
            <option key={cat} value={cat}>
              {tCommon(`category.${cat}`)}
            </option>
          ))}
        </Select>

        <Select
          id="gender-filter"
          label={tMatches("gender")}
          value={gender ?? ""}
          onChange={(e) => setGender((e.target.value as Gender) || undefined)}
        >
          <option value="">{tMatches("allGenders")}</option>
          {GENDER_LIST.map((g) => (
            <option key={g} value={g}>
              {tCommon(`gender.${g}`)}
            </option>
          ))}
        </Select>
      </div>

      {/* Divider */}
      <div className="border-t border-divide-light dark:border-divide-dark" />

      {/* Row 3: Level → Committee/League cascade */}
      <LevelLocationFilters
        level={level}
        setLevel={(val) => {
          setLevel(val);
          setCommitteeId(undefined);
          setLeagueId(undefined);
          setDivision("");
          setPool("");
        }}
        committeeId={committeeId}
        setCommitteeId={(val) => {
          setCommitteeId(val);
          setDivision("");
          setPool("");
        }}
        leagueId={leagueId}
        setLeagueId={(val) => {
          setLeagueId(val);
          setDivision("");
          setPool("");
        }}
        committees={committees}
        leagues={leagues}
      />

      {/* Row 4: Division → Pool cascade */}
      <CascadeSelects steps={cascadeSteps} cols={2} />
    </FiltersShell>
  );
};

export default TeamsFilters;
