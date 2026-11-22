// src/frontend/features/teams/components/detail/team-matches/TeamUpcomingMatchesTable.tsx
"use client";

import { useTranslations } from "next-intl";

import { MatchHistoryTable } from "@/features/matches/components";

import { useTeamMatchHistoryColumns } from "../../../hooks/useTeamMatchHistoryColumns";
import type { Team } from "../../../types/Team";
import type { TeamMatchHistory } from "../../../types/TeamMatchHistory";

interface TeamUpcomingMatchesTableProps {
  readonly team: Team;
  readonly matches: TeamMatchHistory[];
  readonly maxRows?: number;
}

/**
 * A team's next fixtures, soonest first, in the same columns as its results.
 *
 * Renders nothing when there is no fixture left, so a finished season shows
 * no empty section.
 */
export function TeamUpcomingMatchesTable({
  team,
  matches,
  maxRows = 3,
}: TeamUpcomingMatchesTableProps) {
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");

  const columns = useTeamMatchHistoryColumns(team, { withResult: false });

  if (matches.length === 0) return null;

  return (
    <MatchHistoryTable
      title={tTeams("teamDetail.upcomingMatchesTitle")}
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
