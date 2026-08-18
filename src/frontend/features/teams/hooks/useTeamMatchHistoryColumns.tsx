// src/frontend/features/teams/hooks/useTeamMatchHistoryColumns.tsx
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  buildMatchDateColumn,
  buildMatchupColumn,
  MatchScore,
} from "@/shared/components/domain";
import type { TableColumn } from "@/shared/components/table";

import type { Team } from "../types/Team";
import type { TeamMatchHistory } from "../types/TeamMatchHistory";

/**
 * Column definitions for a team's match-history table: date, matchup, and the
 * final score.
 *
 * `team` is read only for its id, which the matchup column uses to render each
 * fixture from this team's side. Unlike the player equivalent there is no
 * fallback id — a team always has one.
 *
 * Memoised on the team id and locale, so the returned array keeps its identity
 * between unrelated parent renders and `DataTable` does not rebuild every row.
 *
 * @param team - the team the table belongs to; supplies the matchup perspective
 * @returns column definitions, stable between renders
 */
export function useTeamMatchHistoryColumns(
  team: Team,
): TableColumn<TeamMatchHistory>[] {
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return useMemo<TableColumn<TeamMatchHistory>[]>(
    () => [
      buildMatchDateColumn<TeamMatchHistory>(
        tCommon("matchHistory.date"),
        locale,
      ),
      buildMatchupColumn<TeamMatchHistory>(
        tCommon("matchHistory.match"),
        team.id,
      ),
      {
        key: "score",
        header: tCommon("matchHistory.score"),
        render: (match: TeamMatchHistory) => (
          <MatchScore
            homeScore={match.homeTeamScore}
            awayScore={match.awayTeamScore}
            variant="table"
          />
        ),
        align: "center",
      },
    ],
    [tCommon, locale, team.id],
  );
}

export default useTeamMatchHistoryColumns;
