// src/frontend/features/teams/hooks/useTeamMatchHistoryColumns.tsx
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  buildMatchDateColumn,
  buildOpponentColumn,
  buildResultColumn,
} from "@/shared/components/domain";
import type { TableColumn } from "@/shared/components/table";

import type { Team } from "../types/Team";
import type { TeamMatchHistory } from "../types/TeamMatchHistory";

/**
 * Column definitions for a team's match-history table: date, opponent, and the
 * result from this team's side. Fixtures not yet played pass
 * `{ withResult: false }`, since they have no result to show.
 *
 * `team` is read only for its id, which the opponent column uses to render each
 * fixture from this team's side. Unlike the player equivalent there is no
 * fallback id — a team always has one.
 *
 * Memoised on the team id and locale, so the returned array keeps its identity
 * between unrelated parent renders and `DataTable` does not rebuild every row.
 *
 * @param team - the team the table belongs to; supplies the opponent's perspective
 * @param options - `withResult: false` drops the result column, for fixtures
 * @returns column definitions, stable between renders
 */
export function useTeamMatchHistoryColumns(
  team: Team,
  { withResult = true }: { withResult?: boolean } = {},
): TableColumn<TeamMatchHistory>[] {
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return useMemo<TableColumn<TeamMatchHistory>[]>(() => {
    const columns: TableColumn<TeamMatchHistory>[] = [
      // A fixture's start time is still worth knowing; a result's is not.
      buildMatchDateColumn<TeamMatchHistory>(
        tCommon("matchHistory.date"),
        locale,
        { withTime: !withResult },
      ),
      buildOpponentColumn<TeamMatchHistory>(
        tCommon("matchHistory.opponent"),
        team.id,
        (opponent, venue) =>
          venue === "home"
            ? tCommon("matchHistory.opponentHome", { opponent })
            : tCommon("matchHistory.opponentAway", { opponent }),
      ),
    ];
    if (!withResult) return columns;

    return [
      ...columns,
      buildResultColumn<TeamMatchHistory>(
        tCommon("matchHistory.result"),
        team.id,
        {
          win: tCommon("matchHistory.win"),
          winShort: tCommon("matchHistory.winShort"),
          loss: tCommon("matchHistory.loss"),
          lossShort: tCommon("matchHistory.lossShort"),
        },
      ),
    ];
  }, [tCommon, locale, team.id, withResult]);
}

export default useTeamMatchHistoryColumns;
