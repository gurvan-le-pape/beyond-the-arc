// src/frontend/features/competitions/championships/components/detail/matches/MatchDetailsTable.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { Match } from "@/features/matches/types";
import type { MatchEvent } from "@/features/matches/types";
import { computeQuarterScores } from "@/features/matches/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";

interface MatchDetailsTableProps {
  match: Match;
  matchEvents: MatchEvent[];
  isLoadingEvents: boolean;
}

export const MatchDetailsTable: React.FC<MatchDetailsTableProps> = ({
  match,
  matchEvents,
  isLoadingEvents,
}) => {
  const t = useTranslations("competitions");

  const quarterScores = computeQuarterScores(
    matchEvents,
    match.homeTeam.id,
    match.awayTeam.id,
    match.date,
  );

  const display = (value: number) => {
    if (isLoadingEvents) return "-";
    return value;
  };

  return (
    <Table className="border border-divide rounded-button">
      <TableHeader>
        <TableRow hoverable={false}>
          <TableHead align="left">{t("matchDetails.teamHeader")}</TableHead>
          <TableHead align="center">1</TableHead>
          <TableHead align="center">2</TableHead>
          <TableHead align="center">3</TableHead>
          <TableHead align="center">4</TableHead>
          {match.overtime && (
            <TableHead align="center">
              {t("matchDetails.overtimeHeader")}
            </TableHead>
          )}
          <TableHead align="center">{t("matchDetails.totalHeader")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Home Team Row */}
        <TableRow hoverable={false}>
          <TableCell>{`${match.homeTeam.club.name} - ${match.homeTeam.number}`}</TableCell>
          <TableCell align="center">{display(quarterScores.home[0])}</TableCell>
          <TableCell align="center">{display(quarterScores.home[1])}</TableCell>
          <TableCell align="center">{display(quarterScores.home[2])}</TableCell>
          <TableCell align="center">{display(quarterScores.home[3])}</TableCell>
          {match.overtime && (
            <TableCell align="center">
              {display(quarterScores.home[4])}
            </TableCell>
          )}
          <TableCell align="center" highlight>
            {match.homeTeamScore}
          </TableCell>
        </TableRow>

        {/* Away Team Row */}
        <TableRow hoverable={false} className="bg-surface-inset">
          <TableCell>{`${match.awayTeam.club.name} - ${match.awayTeam.number}`}</TableCell>
          <TableCell align="center">{display(quarterScores.away[0])}</TableCell>
          <TableCell align="center">{display(quarterScores.away[1])}</TableCell>
          <TableCell align="center">{display(quarterScores.away[2])}</TableCell>
          <TableCell align="center">{display(quarterScores.away[3])}</TableCell>
          {match.overtime && (
            <TableCell align="center">
              {display(quarterScores.away[4])}
            </TableCell>
          )}
          <TableCell align="center" highlight>
            {match.awayTeamScore}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default MatchDetailsTable;
