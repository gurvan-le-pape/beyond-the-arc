// src/frontend/features/teams/components/list/TeamsFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Select } from "@/shared/components/forms";
import { Button, Card } from "@/shared/components/primitives";
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
  clubs: any[];
  clubId: string;
  setClubId: (value: string) => void;
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
  clubs,
  clubId,
  setClubId,
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
  const tFilters = useTranslations("filters");
  const tMatches = useTranslations("matches");

  return (
    <Card variant="highlighted" padding="lg">
      <div className="space-y-6">
        {/* Row 1: Club + Team number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="club-filter"
            label={tTeams("filters.club")}
            value={clubId}
            onChange={(e) => setClubId(e.target.value)}
          >
            <option value="">{tTeams("filters.allClubs")}</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </Select>

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

        {/* Row 3: Division + Pool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="division-filter"
            label={tMatches("division")}
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          >
            <option value="">{tMatches("selectDivision")}</option>
            {divisions.map((div) => (
              <option key={div} value={div}>
                {tMatches("divisionLabel", { div })}
              </option>
            ))}
          </Select>

          <Select
            id="pool-filter"
            label={tMatches("pool")}
            value={pool}
            onChange={(e) => setPool(e.target.value)}
          >
            <option value="">{tMatches("allPools")}</option>
            {poolLetters.map((letter) => (
              <option key={letter} value={letter}>
                {tTeams("poolLabel", { letter })}
              </option>
            ))}
          </Select>
        </div>

        {/* Row 4: Level + Location */}
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

export default TeamsFilters;
