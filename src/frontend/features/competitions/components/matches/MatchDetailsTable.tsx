// src/frontend/features/competitions/components/matches/MatchDetailsTable.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { Match } from "@/features/matches/types/Match";
import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import { computeQuarterScores } from "@/features/matches/utils/eventHelpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";

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
    return value > 0 ? value : "-";
  };

  return (
    <Table className="border border-divide-light dark:border-divide-dark rounded-button">
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
          <TableCell>{match.homeTeam.club.name}</TableCell>
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
        <TableRow
          hoverable={false}
          className="bg-surface-subtle dark:bg-surface-subtle-dark"
        >
          <TableCell>{match.awayTeam.club.name}</TableCell>
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
