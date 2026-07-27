// src/frontend/features/teams/components/detail/TeamMatchHistoryTable.tsx
"use client";

import { useTranslations } from "next-intl";

import { MatchHistoryTable } from "@/features/matches/components";

import { useTeamMatchHistoryColumns } from "../../hooks/useTeamMatchHistoryColumns";
import type { Team } from "../../types/Team";
import type { TeamMatchHistory } from "../../types/TeamMatchHistory";

interface TeamMatchHistoryTableProps {
  readonly team: Team;
  readonly matches: TeamMatchHistory[];
  readonly maxRows?: number;
}

export function TeamMatchHistoryTable({
  team,
  matches,
  maxRows = 5,
}: TeamMatchHistoryTableProps) {
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");

  const columns = useTeamMatchHistoryColumns(team);

  return (
    <MatchHistoryTable
      title={tTeams("teamDetail.matchHistoryTitle")}
      matches={matches}
      columns={columns}
      emptyMessage={tCommon("matchHistory.noMatches")}
      showAllLabel={tCommon("matchHistory.seeAllMatches", {
        count: matches.length,
      })}
      showLessLabel={tCommon("seeLess")}
      maxRows={maxRows}
    />
  );
}
