// src/frontend/features/players/components/list/PlayersFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Input, Select } from "@/shared/components/forms";
import { Button, Card } from "@/shared/components/primitives";
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
  clubs: any[];
  clubId: string;
  setClubId: (value: string) => void;
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
  clubs,
  clubId,
  setClubId,
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
  const tFilters = useTranslations("filters");
  const tMatches = useTranslations("matches");

  return (
    <Card variant="highlighted" padding="lg">
      <div className="space-y-6">
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

          <Select
            id="club-filter"
            label={tPlayers("filters.club")}
            value={clubId}
            onChange={(e) => setClubId(e.target.value)}
          >
            <option value="">{tPlayers("filters.allClubs")}</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
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

        {/* Row 3: Player number + Team number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="number-filter"
            label={tPlayers("filters.playerNumber")}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          >
            <option value="">{tPlayers("filters.allNumbers")}</option>
            {playerNumbers.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>

          <Select
            id="team-filter"
            label={tPlayers("filters.teamNumber")}
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value)}
          >
            <option value="">{tPlayers("filters.allTeams")}</option>
            {teamNumbers.map((n) => (
              <option key={n} value={n}>
                {n}
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

export default PlayersFilters;
