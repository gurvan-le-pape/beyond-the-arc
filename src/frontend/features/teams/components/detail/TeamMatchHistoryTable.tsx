// src/frontend/features/teams/components/detail/TeamMatchHistoryTable.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { MatchHistoryTable } from "@/features/matches/components";
import { useRouter } from "@/navigation";

import { useTeamMatchHistoryColumns } from "../../hooks/useTeamMatchHistoryColumns";
import type { Team } from "../../types/Team";
import type { TeamMatchHistory } from "../../types/TeamMatchHistory";

interface TeamMatchHistoryTableProps {
  team: Team;
  matches: TeamMatchHistory[];
  maxRows?: number;
}

export function TeamMatchHistoryTable({
  team,
  matches,
  maxRows = 5,
}: TeamMatchHistoryTableProps) {
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const columns = useTeamMatchHistoryColumns(team);

  return (
    <MatchHistoryTable
      title={tTeams("teamDetail.matchHistoryTitle")}
      matches={matches}
      columns={columns}
      emptyMessage={tCommon("matchHistory.noMatches")}
      onRowClick={(match) => void router.push(`/matches/${match.id}`)}
      showAll={showAll}
      setShowAll={setShowAll}
      showAllLabel={tCommon("matchHistory.seeAllMatches", {
        count: matches.length,
      })}
      showLessLabel={tCommon("seeLess")}
      maxRows={maxRows}
    />
  );
}
