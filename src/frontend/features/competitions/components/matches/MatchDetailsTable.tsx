// src/frontend/features/competitions/components/matches/MatchDetailsTable.tsx
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";

interface MatchDetailsTableProps {
  match: any;
}

export const MatchDetailsTable: React.FC<MatchDetailsTableProps> = ({
  match,
}) => (
  <Table className="border border-gray-300 dark:border-gray-600 rounded-button">
    <TableHeader>
      <TableRow hoverable={false}>
        <TableHead align="left">Team</TableHead>
        <TableHead align="center">1</TableHead>
        <TableHead align="center">2</TableHead>
        <TableHead align="center">3</TableHead>
        <TableHead align="center">4</TableHead>
        <TableHead align="center">OT</TableHead>
        <TableHead align="center">T</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {/* Home Team Row */}
      <TableRow hoverable={false}>
        <TableCell>{match.homeTeam.club.name}</TableCell>
        <TableCell align="center">{match.quarter1Home || "-"}</TableCell>
        <TableCell align="center">{match.quarter2Home || "-"}</TableCell>
        <TableCell align="center">{match.quarter3Home || "-"}</TableCell>
        <TableCell align="center">{match.quarter4Home || "-"}</TableCell>
        <TableCell align="center">{match.overtimeHome || "-"}</TableCell>
        <TableCell align="center" highlight>
          {match.homeTeamScore || "-"}
        </TableCell>
      </TableRow>

      {/* Away Team Row */}
      <TableRow hoverable={false} className="bg-gray-50 dark:bg-gray-700/30">
        <TableCell>{match.awayTeam.club.name}</TableCell>
        <TableCell align="center">{match.quarter1Away || "-"}</TableCell>
        <TableCell align="center">{match.quarter2Away || "-"}</TableCell>
        <TableCell align="center">{match.quarter3Away || "-"}</TableCell>
        <TableCell align="center">{match.quarter4Away || "-"}</TableCell>
        <TableCell align="center">{match.overtimeAway || "-"}</TableCell>
        <TableCell align="center" highlight>
          {match.awayTeamScore || "-"}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export default MatchDetailsTable;
