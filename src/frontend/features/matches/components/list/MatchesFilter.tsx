// src/frontend/features/matches/components/list/MatchesFilter.tsx
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import React from "react";

import type { Championship } from "@/features/competitions/championships/types/Championship";
import { SearchInput } from "@/shared/components/ui";
import { Section } from "@/shared/components/ui";
import { Select } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui";
import { Input } from "@/shared/components/ui";
import { Category, CompetitionLevel, Gender } from "@/shared/constants";

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
  // Reset handler
  onReset: () => void;
}

/**
 * Filters component for matches page
 * Handles search, date, category, gender, level, location, and competition hierarchy
 */
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

  // Get unique divisions from championships
  const divisions = Array.from(
    new Set(
      championships
        .map((c: any) => c.division)
        .filter((d: any) => d !== null && d !== undefined),
    ),
  ).sort((a: any, b: any) => a - b);

  // Get number of matchdays for selected pool
  const getMatchdaysCount = () => {
    if (!poolId) return 30;
    const pool = pools.find((p: any) => String(p.id) === String(poolId));
    return pool?.nbMatchdays || 30;
  };

  return (
    <Section>
      <div className="space-y-6">
        {/* Row 1: Search and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Club Search */}
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tMatches("searchClubPlaceholder")}
            label={tMatches("searchClub")}
            onClear={() => setSearch("")}
          />

          {/* Date Filter */}
          <Input
            id="date-filter"
            type="date"
            label={tMatches("date")}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            leftIcon={<CalendarIcon className="w-5 h-5" />}
          />
        </div>

        {/* Row 2: Category and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <Select
            id="category-filter"
            label={tMatches("category")}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="">{tMatches("allCategories")}</option>
            <option value={Category.U11}>{tCommon("category.U11")}</option>
            <option value={Category.U13}>{tCommon("category.U13")}</option>
            <option value={Category.U15}>{tCommon("category.U15")}</option>
            <option value={Category.U18}>{tCommon("category.U18")}</option>
            <option value={Category.U21}>{tCommon("category.U21")}</option>
            <option value={Category.SENIOR}>
              {tCommon("category.senior")}
            </option>
          </Select>

          {/* Gender */}
          <Select
            id="gender-filter"
            label={tMatches("gender")}
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            <option value="">{tMatches("allGenders")}</option>
            <option value={Gender.MALE}>{tCommon("gender.male")}</option>
            <option value={Gender.FEMALE}>{tCommon("gender.female")}</option>
          </Select>
        </div>

        {/* Row 3: Level and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Level */}
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

          {/* Committee (if departmental) */}
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
              {committees.map((committee) => (
                <option key={committee.id} value={committee.id}>
                  {committee.name}
                </option>
              ))}
            </Select>
          )}

          {/* League (if regional) */}
          {level === CompetitionLevel.REGIONAL && (
            <Select
              id="league-filter"
              label={tMatches("league")}
              value={leagueId}
              onChange={(e) => setLeagueId(Number(e.target.value) || undefined)}
            >
              <option value="">{tMatches("selectLeague")}</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </Select>
          )}
        </div>

        {/* Row 4: Division, Pool, Matchday (conditional) */}
        {((level === CompetitionLevel.DEPARTMENTAL && committeeId) ||
          (level === CompetitionLevel.REGIONAL && leagueId)) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Division */}
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

            {/* Pool (if division selected) */}
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

            {/* Matchday (if pool selected) */}
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

        {/* Reset Button */}
        <div className="flex justify-end items-center">
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
    </Section>
  );
};

export default MatchesFilters;
