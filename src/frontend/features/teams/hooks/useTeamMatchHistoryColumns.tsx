// src/frontend/features/teams/hooks/useTeamMatchHistoryColumns.tsx
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  buildMatchDateColumn,
  buildMatchupColumn,
} from "@/shared/components/domain";
import { Badge } from "@/shared/components/primitives";

import type { Team } from "../types/Team";
import type { TeamMatchHistory } from "../types/TeamMatchHistory";

export function useTeamMatchHistoryColumns(team: Team) {
  const tCommon = useTranslations("common");
  const tMatches = useTranslations("matches");

  return useMemo(
    () => [
      buildMatchDateColumn<TeamMatchHistory>(tCommon("matchHistory.date")),
      buildMatchupColumn<TeamMatchHistory>(
        tCommon("matchHistory.match"),
        team.id,
      ),
      {
        key: "score",
        header: tCommon("matchHistory.score"),
        render: (match: TeamMatchHistory) => {
          const homeScore = match.homeTeamScore;
          const awayScore = match.awayTeamScore;
          const hasScore = homeScore !== null && awayScore !== null;

          if (!hasScore) {
            return (
              <Badge variant="outline" size="md">
                {tMatches("upcoming")}
              </Badge>
            );
          }

          return (
            <span>
              <span
                className={homeScore > awayScore ? "font-bold" : "font-normal"}
              >
                {homeScore}
              </span>
              {" - "}
              <span
                className={awayScore > homeScore ? "font-bold" : "font-normal"}
              >
                {awayScore}
              </span>
            </span>
          );
        },
        align: "center" as const,
      },
    ],
    [tCommon, tMatches, team.id],
  );
}

export default useTeamMatchHistoryColumns;
