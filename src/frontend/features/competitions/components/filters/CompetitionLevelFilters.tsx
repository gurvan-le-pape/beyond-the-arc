// src/frontend/features/competitions/components/filters/CompetitionLevelFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Button, Card, Select } from "@/shared/components/ui";
import { CompetitionLevel } from "@/shared/constants";

interface CompetitionLevelFiltersProps {
  level: CompetitionLevel;
  setLevel: (level: CompetitionLevel) => void;
  committeeId: number | undefined;
  setCommitteeId: (id: number | undefined) => void;
  leagueId: number | undefined;
  setLeagueId: (id: number | undefined) => void;
  committees: any[];
  leagues: any[];
  onReset: () => void;
}

/**
 * Global filters component for entity list pages
 * Handles level, committee, and league filtering with Card UI
 */
export const CompetitionLevelFilters: React.FC<
  CompetitionLevelFiltersProps
> = ({
  level,
  setLevel,
  committeeId,
  setCommitteeId,
  leagueId,
  setLeagueId,
  committees,
  leagues,
  onReset,
}) => {
  const t = useTranslations("filters");

  return (
    <Card variant="default" padding="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level Filter */}
          <Select
            label={t("filters.level")}
            value={level ?? ""}
            onChange={(e) =>
              setLevel(
                e.target.value
                  ? (e.target.value as CompetitionLevel)
                  : CompetitionLevel.ALL,
              )
            }
            aria-label={t("filters.level")}
          >
            <option value="">{t("levels.all")}</option>
            <option value={CompetitionLevel.DEPARTMENTAL}>
              {t(`levels.${CompetitionLevel.DEPARTMENTAL}`)}
            </option>
            <option value={CompetitionLevel.REGIONAL}>
              {t(`levels.${CompetitionLevel.REGIONAL}`)}
            </option>
            <option value={CompetitionLevel.NATIONAL}>
              {t(`levels.${CompetitionLevel.NATIONAL}`)}
            </option>
          </Select>

          {/* Committee Filter (shown when level is DEPARTMENTAL) */}
          {level === CompetitionLevel.DEPARTMENTAL && (
            <Select
              label={t("filters.committee")}
              value={committeeId ?? ""}
              onChange={(e) =>
                setCommitteeId(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              aria-label={t("filters.committee")}
            >
              <option value="">{t("filters.allCommittees")}</option>
              {committees.map((committee) => (
                <option key={committee.id} value={committee.id}>
                  {committee.name}
                </option>
              ))}
            </Select>
          )}

          {/* League Filter (shown when level is REGIONAL) */}
          {level === CompetitionLevel.REGIONAL && (
            <Select
              label={t("filters.league")}
              value={leagueId ?? ""}
              onChange={(e) =>
                setLeagueId(e.target.value ? Number(e.target.value) : undefined)
              }
              aria-label={t("filters.league")}
            >
              <option value="">{t("filters.allLeagues")}</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            aria-label={t("filters.reset") + " " + t("filters.global")}
          >
            {t("filters.reset")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CompetitionLevelFilters;
