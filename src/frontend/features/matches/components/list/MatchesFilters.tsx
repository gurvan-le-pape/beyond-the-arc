// src/frontend/features/matches/components/list/MatchesFilters.tsx
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import React from "react";

import type { Championship } from "@/features/competitions/championships/types/Championship";
import type { CascadeStep } from "@/shared/components/filters/CascadeSelects";
import { CascadeSelects } from "@/shared/components/filters/CascadeSelects";
import { FiltersShell } from "@/shared/components/filters/FiltersShell";
import { LevelLocationFilters } from "@/shared/components/filters/LevelLocationFilters";
import { Input, Select } from "@/shared/components/forms";
import type { Category, Gender } from "@/shared/constants";
import {
  CATEGORY_LIST,
  CompetitionLevel,
  GENDER_LIST,
} from "@/shared/constants";

interface MatchesFiltersProps {
  // Search & Date
  search: string;
  setSearch: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
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
  // Competition Hierarchy
  division: number | undefined;
  setDivision: (value: number | undefined) => void;
  poolId: number | undefined;
  setPoolId: (value: number | undefined) => void;
  matchday: number | undefined;
  setMatchday: (value: number | undefined) => void;
  championships: Championship[];
  pools: any[];
  // Reset
  onReset: () => void;
}

export const MatchesFilters: React.FC<MatchesFiltersProps> = ({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
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
  division,
  setDivision,
  poolId,
  setPoolId,
  matchday,
  setMatchday,
  championships,
  pools,
  onReset,
}) => {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");

  const divisions = Array.from(
    new Set(
      championships
        .map((c: any) => c.division)
        .filter((d: any) => d !== null && d !== undefined),
    ),
  ).sort((a: any, b: any) => a - b);

  const matchdaysCount = poolId
    ? pools.find((p: any) => String(p.id) === String(poolId))?.nbMatchdays ?? 30
    : 30;

  const locationLabel =
    level === CompetitionLevel.DEPARTMENTAL
      ? committees.find((c) => c.id === committeeId)?.name
      : leagues.find((l) => l.id === leagueId)?.name;

  const locationSelected =
    (level === CompetitionLevel.DEPARTMENTAL && committeeId) ||
    (level === CompetitionLevel.REGIONAL && leagueId);

  const selectedPool = pools.find((p) => p.id === poolId);

  const chips = [
    search && {
      key: "search",
      label: `"${search}"`,
      onRemove: () => setSearch(""),
    },
    dateFilter && {
      key: "date",
      label: dateFilter,
      onRemove: () => setDateFilter(""),
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
        setDivision(undefined);
        setPoolId(undefined);
        setMatchday(undefined);
      },
    },
    locationLabel && {
      key: "location",
      label: locationLabel,
      onRemove: () => {
        setCommitteeId(undefined);
        setLeagueId(undefined);
        setDivision(undefined);
        setPoolId(undefined);
        setMatchday(undefined);
      },
    },
    division && {
      key: "division",
      label: tMatches("divisionLabel", { div: division }),
      onRemove: () => {
        setDivision(undefined);
        setPoolId(undefined);
        setMatchday(undefined);
      },
    },
    poolId && {
      key: "pool",
      label: selectedPool?.name ?? String(poolId),
      onRemove: () => {
        setPoolId(undefined);
        setMatchday(undefined);
      },
    },
    matchday && {
      key: "matchday",
      label: tMatches("matchdayLabel", { matchday }),
      onRemove: () => setMatchday(undefined),
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

  const cascadeSteps: CascadeStep[] = [
    {
      id: "division-filter",
      label: tCommon("filters.divisions"),
      value: division ?? "",
      onChange: (val) => {
        setDivision(Number(val) || undefined);
        setPoolId(undefined);
        setMatchday(undefined);
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
      label: tCommon("filters.pools"),
      value: poolId ?? "",
      onChange: (val) => {
        setPoolId(Number(val) || undefined);
        setMatchday(undefined);
      },
      enabled: !!division,
      options: pools.map((p) => ({ value: p.id, label: p.name })),
      allLabel: tCommon("filters.allPools"),
      waitLabel: tFilters("filters.selectDivisionFirst"),
    },
    {
      id: "matchday-filter",
      label: tMatches("matchday"),
      value: matchday ?? "",
      onChange: (val) => setMatchday(Number(val) || undefined),
      enabled: !!poolId,
      options: Array.from({ length: matchdaysCount }, (_, i) => ({
        value: i + 1,
        label: tMatches("matchdayLabel", { matchday: i + 1 }),
      })),
      allLabel: tMatches("allMatchdays"),
      waitLabel: tFilters("filters.selectPoolFirst"),
    },
  ];

  return (
    <FiltersShell
      activeFilterCount={chips.length}
      chips={chips}
      onReset={onReset}
      title={tMatches("label")}
    >
      {/* Row 1: Search + Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          variant="search"
          label={tMatches("searchClub")}
          value={search}
          placeholder={tMatches("searchClubPlaceholder")}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          clearAriaLabel={tCommon("clearSearch")}
        />

        <Input
          id="date-filter"
          type="date"
          label={tMatches("date")}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          leftIcon={<CalendarIcon className="w-5 h-5" />}
        />
      </div>

      {/* Row 2: Category + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={tCommon("filters.categories")}
          options={categoryOptions}
          value={category ?? ""}
          onChange={(val) => setCategory((val as Category) || undefined)}
        />

        <Select
          label={tCommon("filters.genders")}
          options={genderOptions}
          value={gender ?? ""}
          onChange={(val) => setGender((val as Gender) || undefined)}
        />
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
          setDivision(undefined);
          setPoolId(undefined);
          setMatchday(undefined);
        }}
        committeeId={committeeId}
        setCommitteeId={(val) => {
          setCommitteeId(val);
          setDivision(undefined);
          setPoolId(undefined);
          setMatchday(undefined);
        }}
        leagueId={leagueId}
        setLeagueId={(val) => {
          setLeagueId(val);
          setDivision(undefined);
          setPoolId(undefined);
          setMatchday(undefined);
        }}
        committees={committees}
        leagues={leagues}
      />

      {/* Row 4: Division → Pool → Matchday cascade */}
      <CascadeSelects steps={cascadeSteps} cols={3} />
    </FiltersShell>
  );
};

export default MatchesFilters;
