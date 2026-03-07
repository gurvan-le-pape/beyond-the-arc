// src/frontend/features/teams/components/detail/TeamRoster.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import type { PlayerMatchHistoryEntry } from "@/features/players/types/PlayerMatchHistory";
import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";

interface TeamRosterProps {
  players?: PlayerMatchHistoryEntry[][];
}

export const TeamRoster: React.FC<TeamRosterProps> = ({ players }) => {
  // Ensure players is always an array
  const safePlayers: PlayerMatchHistoryEntry[][] = players ?? [];

  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Helper function to calculate player averages
  const calculatePlayerStats = (player: PlayerMatchHistoryEntry[]) => {
    const gp = player.length || 0;
    const pts = player.reduce((sum, s) => sum + s.stats.points, 0) || 0;
    const reb =
      player.reduce(
        (sum, s) =>
          sum + (s.stats.rebounds.offensive + s.stats.rebounds.defensive),
        0,
      ) || 0;
    const ast = player.reduce((sum, s) => sum + s.stats.assists, 0) || 0;

    return {
      gp,
      ppg: gp > 0 ? (pts / gp).toFixed(1) : "0.0",
      rpg: gp > 0 ? (reb / gp).toFixed(1) : "0.0",
      apg: gp > 0 ? (ast / gp).toFixed(1) : "0.0",
    };
  };

  // Sort players
  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig) return safePlayers;

    return [...safePlayers].sort((a, b) => {
      const aStats = calculatePlayerStats(a);
      const bStats = calculatePlayerStats(b);

      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortConfig.key) {
        case "number":
          aValue = a[0]?.player.number ?? 0;
          bValue = b[0]?.player.number ?? 0;
          break;
        case "name":
          aValue = a[0]?.player.name ?? "";
          bValue = b[0]?.player.name ?? "";
          break;
        case "gp":
          aValue = aStats.gp;
          bValue = bStats.gp;
          break;
        case "ppg":
          aValue = Number.parseFloat(aStats.ppg);
          bValue = Number.parseFloat(bStats.ppg);
          break;
        case "rpg":
          aValue = Number.parseFloat(aStats.rpg);
          bValue = Number.parseFloat(bStats.rpg);
          break;
        case "apg":
          aValue = Number.parseFloat(aStats.apg);
          bValue = Number.parseFloat(bStats.apg);
          break;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [players, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "desc" };
    });
  };

  return (
    <Card variant="highlighted" padding="none">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {tTeams("teamDetail.rosterTitle")}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              <TableHead
                sortable
                sortDirection={
                  sortConfig?.key === "number" ? sortConfig.direction : null
                }
                onSort={() => handleSort("number")}
              >
                {tTeams("teamDetail.numberShort")}
              </TableHead>
              <TableHead
                sortable
                sortDirection={
                  sortConfig?.key === "name" ? sortConfig.direction : null
                }
                onSort={() => handleSort("name")}
              >
                {tTeams("teamDetail.player")}
              </TableHead>
              <TableHead
                align="center"
                sortable
                sortDirection={
                  sortConfig?.key === "gp" ? sortConfig.direction : null
                }
                onSort={() => handleSort("gp")}
              >
                {tTeams("teamDetail.gamesPlayedShort")}
              </TableHead>
              <TableHead
                align="center"
                sortable
                sortDirection={
                  sortConfig?.key === "ppg" ? sortConfig.direction : null
                }
                onSort={() => handleSort("ppg")}
              >
                {tCommon("statAbbreviations.pts")}
              </TableHead>
              <TableHead
                align="center"
                sortable
                sortDirection={
                  sortConfig?.key === "rpg" ? sortConfig.direction : null
                }
                onSort={() => handleSort("rpg")}
              >
                {tCommon("statAbbreviations.reb")}
              </TableHead>
              <TableHead
                align="center"
                sortable
                sortDirection={
                  sortConfig?.key === "apg" ? sortConfig.direction : null
                }
                onSort={() => handleSort("apg")}
              >
                {tCommon("statAbbreviations.ast")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {safePlayers.length === 0 ? (
              <TableEmpty
                colSpan={6}
                message={tTeams("teamDetail.noPlayers")}
              />
            ) : (
              sortedPlayers.map((player: PlayerMatchHistoryEntry[]) => {
                const stats = calculatePlayerStats(player);

                return (
                  <TableRow
                    key={player[0]?.player.id}
                    clickable
                    onClick={() =>
                      void router.push(`/players/${player[0]?.player.id}`)
                    }
                  >
                    <TableCell highlight>#{player[0]?.player.number}</TableCell>
                    <TableCell className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                      {player[0]?.player.name}
                    </TableCell>
                    <TableCell>{stats.gp}</TableCell>
                    <TableCell>{stats.ppg}</TableCell>
                    <TableCell>{stats.rpg}</TableCell>
                    <TableCell>{stats.apg}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TeamRoster;
