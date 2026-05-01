// src/frontend/shared/components/filters/LevelLocationFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Select } from "@/shared/components/forms";
import { CompetitionLevel } from "@/shared/constants";

interface LevelLocationFiltersProps {
  readonly level: CompetitionLevel | undefined;
  readonly setLevel: (value: CompetitionLevel | undefined) => void;
  readonly committeeId: number | undefined;
  readonly setCommitteeId: (value: number | undefined) => void;
  readonly leagueId: number | undefined;
  readonly setLeagueId: (value: number | undefined) => void;
  readonly committees: { id: number; name: string }[];
  readonly leagues: { id: number; name: string }[];
}

export function LevelLocationFilters({
  level,
  setLevel,
  committeeId,
  setCommitteeId,
  leagueId,
  setLeagueId,
  committees,
  leagues,
}: LevelLocationFiltersProps) {
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");

  const showCommittee = level === CompetitionLevel.DEPARTMENTAL;
  const showLeague = level === CompetitionLevel.REGIONAL;
  const showLocation = showCommittee || showLeague;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        id="level-filter"
        label={tCommon("filters.levels")}
        value={level ?? ""}
        onChange={(e) => {
          setLevel((e.target.value as CompetitionLevel) || undefined);
          setCommitteeId(undefined);
          setLeagueId(undefined);
        }}
      >
        <option value="">{tCommon("filters.allLevels")}</option>
        <option value={CompetitionLevel.DEPARTMENTAL}>
          {tCommon("competition.levels.departmental")}
        </option>
        <option value={CompetitionLevel.REGIONAL}>
          {tCommon("competition.levels.regional")}
        </option>
        <option value={CompetitionLevel.NATIONAL}>
          {tCommon("competition.levels.national")}
        </option>
      </Select>

      {showCommittee && (
        <Select
          id="committee-filter"
          label={tCommon("filters.committees")}
          value={committeeId ?? ""}
          onChange={(e) => setCommitteeId(Number(e.target.value) || undefined)}
        >
          <option value="">{tCommon("filters.allCommittees")}</option>
          {committees.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      )}

      {showLeague && (
        <Select
          id="league-filter"
          label={tCommon("filters.leagues")}
          value={leagueId ?? ""}
          onChange={(e) => setLeagueId(Number(e.target.value) || undefined)}
        >
          <option value="">{tCommon("filters.allLeagues")}</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
      )}

      {!showLocation && (
        <div className="opacity-40 pointer-events-none">
          <Select
            id="location-filter-disabled"
            label={tFilters("filters.committeeOrLeague")}
            value=""
            onChange={() => {}}
          >
            <option value="">{tFilters("filters.selectLevelFirst")}</option>
          </Select>
        </div>
      )}
    </div>
  );
}

export default LevelLocationFilters;
