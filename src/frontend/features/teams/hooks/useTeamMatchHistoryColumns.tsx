// src/frontend/features/teams/hooks/useTeamMatchHistoryColumns.tsx
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { formatMatchDateTime } from "@/shared/utils/helpers/date-helpers";

import type { Team } from "../types/Team";
import type { TeamMatchHistory } from "../types/TeamMatchHistory";

export function useTeamMatchHistoryColumns(team: Team) {
  const t = useTranslations("common");

  return useMemo(() => {
    const renderTeam = (teamName: string | null) =>
      teamName === team.club?.name ? (
        <span className="font-bold">{teamName ?? ""}</span>
      ) : (
        <span>{teamName ?? ""}</span>
      );

    return [
      {
        key: "date",
        header: t("matchHistory.date"),
        render: (match: TeamMatchHistory) => formatMatchDateTime(match.date),
        align: "left" as const,
        className: "px-6 py-3 text-left text-sm font-semibold",
      },
      {
        key: "match",
        header: t("matchHistory.match"),
        render: (match: TeamMatchHistory) => (
          <>
            {renderTeam(match.homeTeam.club.name)}
            {" vs "}
            {renderTeam(match.awayTeam.club.name)}
          </>
        ),
        align: "left" as const,
        className: "px-6 py-3 text-left text-sm font-semibold",
      },
      {
        key: "score",
        header: t("matchHistory.score"),
        render: (match: TeamMatchHistory) => {
          const homeScore = match.homeTeamScore;
          const awayScore = match.awayTeamScore;
          const isHomeHigher =
            homeScore !== null && awayScore !== null && homeScore > awayScore;
          const isAwayHigher =
            homeScore !== null && awayScore !== null && awayScore > homeScore;
          return (
            <span>
              <span className={isHomeHigher ? "font-bold" : "font-normal"}>
                {homeScore ?? "-"}
              </span>
              {" - "}
              <span className={isAwayHigher ? "font-bold" : "font-normal"}>
                {awayScore ?? "-"}
              </span>
            </span>
          );
        },
        align: "center" as const,
        className: "px-6 py-3 text-center text-sm font-semibold",
      },
    ];
  }, [t, team.club?.name]);
}

export default useTeamMatchHistoryColumns;
