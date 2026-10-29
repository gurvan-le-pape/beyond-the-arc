// src/frontend/shared/components/filters/LevelLocationFilters.tsx
import { useTranslations } from "next-intl";

import { Select } from "@/shared/components/forms";
import { CompetitionLevel } from "@/shared/constants";
import type { FilterProps } from "@/shared/hooks";

/** The competition level and the committee or league it is scoped by. */
export interface LevelLocationValues {
  level: CompetitionLevel | undefined;
  committee: number | undefined;
  league: number | undefined;
}

interface LevelLocationFiltersProps extends FilterProps<LevelLocationValues> {
  readonly committees: { id: number; name: string }[];
  readonly leagues: { id: number; name: string }[];
}

/**
 * The competition-level select and, after it, the location select that level
 * implies. Both render bare, as a fragment: the panel's own grid places them.
 *
 * **The second select appears only for departmental and regional.** Those levels
 * are scoped by a committee and a league respectively; national competitions
 * have no parent to pick, so nothing renders and no location is required. That
 * asymmetry is the whole component — it is why callers gate their own deeper
 * cascades on a location actually being selected.
 *
 * The option lists are supplied by the caller, which fetches them; this renders
 * whatever it is given.
 */
export function LevelLocationFilters({
  filters: { level, committee, league },
  set,
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
    <>
      <Select
        label={tCommon("filters.levels")}
        options={levelOptions}
        value={level ?? ""}
        onChange={(val) =>
          set({ level: (val as CompetitionLevel) || undefined })
        }
      />

      {showCommittee && (
        <Select
          label={tCommon("filters.committees")}
          options={committeeOptions}
          value={committee ? String(committee) : ""}
          onChange={(val) => set({ committee: val ? Number(val) : undefined })}
        />
      )}

      {showLeague && (
        <Select
          label={tCommon("filters.leagues")}
          options={leagueOptions}
          value={league ? String(league) : ""}
          onChange={(val) => set({ league: val ? Number(val) : undefined })}
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
    </>
  );
}
