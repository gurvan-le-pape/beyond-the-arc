// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/MatchDetailsTable.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { Match, MatchEvent } from "@/features/matches/types";
import { computeQuarterScores } from "@/features/matches/utils";
import { DataTable, type TableColumn } from "@/shared/components/table";

interface MatchDetailsTableProps {
  match: Match;
  matchEvents: MatchEvent[];
  isLoadingEvents: boolean;
}

/** One team's line in the quarter-by-quarter box score. */
interface TeamScoreRow {
  side: "home" | "away";
  label: string;
  quarters: number[];
  /** Null until the match has a recorded final score. */
  total: number | null;
}

/** Regulation quarters, plus overtime when the match went to OT. */
const REGULATION_QUARTERS = [0, 1, 2, 3];

export const MatchDetailsTable: React.FC<MatchDetailsTableProps> = ({
  match,
  matchEvents,
  isLoadingEvents,
}) => {
  const t = useTranslations("competitions");
  const tCommon = useTranslations("common");

  const quarterScores = computeQuarterScores(
    matchEvents,
    match.homeTeam.id,
    match.awayTeam.id,
    match.date,
  );

  const display = (value: number) => (isLoadingEvents ? "-" : value);

  const rows: TeamScoreRow[] = [
    {
      side: "home",
      label: `${match.homeTeam.club.name} - ${match.homeTeam.number}`,
      quarters: quarterScores.home,
      total: match.homeTeamScore,
    },
    {
      side: "away",
      label: `${match.awayTeam.club.name} - ${match.awayTeam.number}`,
      quarters: quarterScores.away,
      total: match.awayTeamScore,
    },
  ];

  const quarterIndexes = match.overtime
    ? [...REGULATION_QUARTERS, 4]
    : REGULATION_QUARTERS;

  const columns: TableColumn<TeamScoreRow>[] = [
    {
      key: "team",
      header: t("matchDetails.teamHeader"),
      align: "left",
      render: (row) => row.label,
    },
    ...quarterIndexes.map<TableColumn<TeamScoreRow>>((index) => ({
      key: `q${index}`,
      header:
        index === 4 ? t("matchDetails.overtimeHeader") : String(index + 1),
      numeric: true,
      render: (row) => display(row.quarters[index]),
    })),
    {
      key: "total",
      header: t("matchDetails.totalHeader"),
      numeric: true,
      render: (row) => row.total,
      emphasis: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.side}
      emptyMessage={tCommon("noData")}
      density="cozy"
      frame="outline"
    />
  );
};

export default MatchDetailsTable;
