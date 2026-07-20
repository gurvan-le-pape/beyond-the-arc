// src/frontend/features/matches/components/detail/player-match-stats/PlayerStatsTable.tsx
import type { MatchPlayerWithStats } from "@/features/matches/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";

import type { StatColumn } from "./types";

interface PlayerStatsTableProps {
  readonly columns: StatColumn[];
  readonly players: MatchPlayerWithStats[];
}

/** Renders the player match stats table from the column defs and player rows. */
export function PlayerStatsTable({ columns, players }: PlayerStatsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow hoverable={false}>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                align={column.align}
                size="compact"
                tooltip={column.tooltip}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((playerWithStats) => (
            <TableRow
              key={playerWithStats.player.number}
              hoverable
              clickable={false}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  className={column.className}
                  size="compact"
                >
                  {column.getValue(playerWithStats)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PlayerStatsTable;
