// src/frontend/features/matches/components/list/MatchesFilters.tsx
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import React from "react";

import type { Championship } from "@/features/competitions/championships/types/Championship";
import { Input, Select } from "@/shared/components/forms";
import { Button, Card } from "@/shared/components/primitives";
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

  const getMatchdaysCount = () => {
    if (!poolId) return 30;
    const pool = pools.find((p: any) => String(p.id) === String(poolId));
    return pool?.nbMatchdays || 30;
  };

  return (
    <Card variant="highlighted" padding="lg">
      <div className="space-y-6">
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
            id="category-filter"
            label={tMatches("category")}
            value={category}
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
            value={gender}
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

        {/* Row 3: Level + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="level-filter"
            label={tMatches("level")}
            value={level}
            onChange={(e) => setLevel(e.target.value as CompetitionLevel)}
          >
            <option value="">{tMatches("selectLevel")}</option>
            <option value={CompetitionLevel.DEPARTMENTAL}>
              {tCommon(`competition.levels.${CompetitionLevel.DEPARTMENTAL}`)}
            </option>
            <option value={CompetitionLevel.REGIONAL}>
              {tCommon(`competition.levels.${CompetitionLevel.REGIONAL}`)}
            </option>
            <option value={CompetitionLevel.NATIONAL}>
              {tCommon(`competition.levels.${CompetitionLevel.NATIONAL}`)}
            </option>
          </Select>

          {level === CompetitionLevel.DEPARTMENTAL && (
            <Select
              id="committee-filter"
              label={tMatches("committee")}
              value={committeeId}
              onChange={(e) =>
                setCommitteeId(Number(e.target.value) || undefined)
              }
            >
              <option value="">{tMatches("selectCommittee")}</option>
              {committees.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          )}

          {level === CompetitionLevel.REGIONAL && (
            <Select
              id="league-filter"
              label={tMatches("league")}
              value={leagueId}
              onChange={(e) => setLeagueId(Number(e.target.value) || undefined)}
            >
              <option value="">{tMatches("selectLeague")}</option>
              {leagues.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          )}
        </div>

        {/* Row 4: Division / Pool / Matchday (conditional) */}
        {((level === CompetitionLevel.DEPARTMENTAL && committeeId) ||
          (level === CompetitionLevel.REGIONAL && leagueId)) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              id="division-filter"
              label={tMatches("division")}
              value={division}
              onChange={(e) => setDivision(Number(e.target.value) || undefined)}
            >
              <option value="">{tMatches("selectDivision")}</option>
              {divisions.map((div: any) => (
                <option key={div} value={div}>
                  {tMatches("divisionLabel", { div })}
                </option>
              ))}
            </Select>

            {division && pools.length > 0 && (
              <Select
                id="pool-filter"
                label={tMatches("pool")}
                value={poolId}
                onChange={(e) => setPoolId(Number(e.target.value) || undefined)}
              >
                <option value="">{tMatches("allPools")}</option>
                {pools.map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {pool.name}
                  </option>
                ))}
              </Select>
            )}

            {poolId && (
              <Select
                id="matchday-filter"
                label={tMatches("matchday")}
                value={matchday}
                onChange={(e) =>
                  setMatchday(Number(e.target.value) || undefined)
                }
              >
                <option value="">{tMatches("allMatchdays")}</option>
                {Array.from({ length: getMatchdaysCount() }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {tMatches("matchdayLabel", { j: i + 1 })}
                  </option>
                ))}
              </Select>
            )}
          </div>
        )}

        {/* Reset */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="md"
            onClick={onReset}
            aria-label={tFilters("filters.reset")}
          >
            {tFilters("filters.reset")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MatchesFilters;
