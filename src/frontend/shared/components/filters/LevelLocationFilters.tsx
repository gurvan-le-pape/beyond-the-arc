// src/frontend/shared/components/filters/LevelLocationFilters.tsx
import { useTranslations } from "next-intl";

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

  const levelOptions = [
    { value: "", label: tCommon("filters.allLevels") },
    {
      value: CompetitionLevel.DEPARTMENTAL,
      label: tCommon("competition.levels.departmental"),
    },
    {
      value: CompetitionLevel.REGIONAL,
      label: tCommon("competition.levels.regional"),
    },
    {
      value: CompetitionLevel.NATIONAL,
      label: tCommon("competition.levels.national"),
    },
  ];

  const committeeOptions = [
    { value: "", label: tCommon("filters.allCommittees") },
    ...committees.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const leagueOptions = [
    { value: "", label: tCommon("filters.allLeagues") },
    ...leagues.map((l) => ({ value: String(l.id), label: l.name })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        label={tCommon("filters.levels")}
        options={levelOptions}
        value={level ?? ""}
        onChange={(val) => {
          setLevel((val as CompetitionLevel) || undefined);
          setCommitteeId(undefined);
          setLeagueId(undefined);
        }}
      />

      {showCommittee && (
        <Select
          label={tCommon("filters.committees")}
          options={committeeOptions}
          value={committeeId ? String(committeeId) : ""}
          onChange={(val) => setCommitteeId(val ? Number(val) : undefined)}
        />
      )}

      {showLeague && (
        <Select
          label={tCommon("filters.leagues")}
          options={leagueOptions}
          value={leagueId ? String(leagueId) : ""}
          onChange={(val) => setLeagueId(val ? Number(val) : undefined)}
        />
      )}

      {!showLocation && (
        <div className="opacity-40 pointer-events-none">
          <Select
            label={tFilters("filters.committeeOrLeague")}
            options={[
              { value: "", label: tFilters("filters.selectLevelFirst") },
            ]}
            value=""
            onChange={() => {}}
            disabled
          />
        </div>
      )}
    </div>
  );
}

export default LevelLocationFilters;
