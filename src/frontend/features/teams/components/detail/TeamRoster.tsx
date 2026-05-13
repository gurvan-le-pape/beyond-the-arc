// src/frontend/features/teams/components/detail/TeamRoster.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import type { PlayerMatchHistoryEntry } from "@/features/players/types";
import { useRouter } from "@/navigation";
import { Section } from "@/shared/components/blocks";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";

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
    <Section title={tTeams("teamDetail.rosterTitle")} variant="highlighted">
      <div className="overflow-x-auto">
        <Table className="border border-primary rounded-card box-border">
          <TableHeader className="bg-primary-subtle border-b border-primary">
            <TableRow hoverable={false}>
              <TableHead
                align="left"
                sortable
                sortDirection={
                  sortConfig?.key === "number" ? sortConfig.direction : null
                }
                onSort={() => handleSort("number")}
              >
                {tTeams("teamDetail.numberShort")}
              </TableHead>
              <TableHead
                align="left"
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
              sortedPlayers.map((player: PlayerMatchHistoryEntry[], index) => {
                const stats = calculatePlayerStats(player);

                return (
                  <TableRow
                    key={player[0]?.player.id}
                    clickable
                    onClick={() =>
                      router.push(`/players/${player[0]?.player.id}`)
                    }
                    className={
                      index % 2 === 0 ? "bg-primary-ghost" : "bg-surface-inset"
                    }
                  >
                    <TableCell align="center" highlight>
                      #{player[0]?.player.number}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="font-medium hover:text-primary transition-colors duration-200"
                    >
                      {player[0]?.player.name}
                    </TableCell>
                    <TableCell align="center">{stats.gp}</TableCell>
                    <TableCell align="center">{stats.ppg}</TableCell>
                    <TableCell align="center">{stats.rpg}</TableCell>
                    <TableCell align="center">{stats.apg}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
};

export default TeamRoster;
