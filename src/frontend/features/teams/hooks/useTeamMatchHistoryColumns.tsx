// src/frontend/features/teams/hooks/useTeamMatchHistoryColumns.tsx
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  buildMatchDateColumn,
  buildMatchupColumn,
  MatchScore,
} from "@/shared/components/domain";
import type { TableColumn } from "@/shared/components/table";

import type { Team } from "../types/Team";
import type { TeamMatchHistory } from "../types/TeamMatchHistory";

export function useTeamMatchHistoryColumns(
  team: Team,
): TableColumn<TeamMatchHistory>[] {
  const tCommon = useTranslations("common");

  return useMemo<TableColumn<TeamMatchHistory>[]>(
    () => [
      buildMatchDateColumn<TeamMatchHistory>(tCommon("matchHistory.date")),
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
    [tCommon, team.id],
  );
}

export default useTeamMatchHistoryColumns;
