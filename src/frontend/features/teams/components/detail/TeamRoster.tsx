// src/frontend/features/teams/components/detail/TeamRoster.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import type { PlayerMatchHistoryEntry } from "@/features/players/types";
import { useRouter } from "@/navigation";
import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

import { PlayerCard } from "./team-roster/PlayerCard";
import { SortControls } from "./team-roster/SortControls";
import type { PlayerStats, SortConfig, SortKey } from "./team-roster/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calculatePlayerStats(player: PlayerMatchHistoryEntry[]): PlayerStats {
  const gp = player.length;
  const pts = player.reduce((sum, s) => sum + s.stats.points, 0);
  const reb = player.reduce(
    (sum, s) => sum + s.stats.rebounds.offensive + s.stats.rebounds.defensive,
    0,
  );
  const ast = player.reduce((sum, s) => sum + s.stats.assists, 0);

  return {
    gp,
    ppg: gp > 0 ? (pts / gp).toFixed(1) : "0.0",
    rpg: gp > 0 ? (reb / gp).toFixed(1) : "0.0",
    apg: gp > 0 ? (ast / gp).toFixed(1) : "0.0",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TeamRosterProps {
  players?: PlayerMatchHistoryEntry[][];
}

export const TeamRoster: React.FC<TeamRosterProps> = ({ players }) => {
  const safePlayers: PlayerMatchHistoryEntry[][] = players ?? [];

  const tTeams = useTranslations("teams");
  const router = useRouter();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "number",
    direction: "asc",
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const sortedPlayers = React.useMemo(() => {
    return [...safePlayers].sort((a, b) => {
      const aStats = calculatePlayerStats(a);
      const bStats = calculatePlayerStats(b);
      const dir = sortConfig.direction === "asc" ? 1 : -1;

      switch (sortConfig.key) {
        case "name": {
          const aName = a[0]?.player.name ?? "";
          const bName = b[0]?.player.name ?? "";
          return aName.localeCompare(bName) * dir;
        }
        case "number": {
          const aN = a[0]?.player.number ?? 0;
          const bN = b[0]?.player.number ?? 0;
          return (aN - bN) * dir;
        }
        case "ppg":
          return (
            (Number.parseFloat(aStats.ppg) - Number.parseFloat(bStats.ppg)) *
            dir
          );
        case "rpg":
          return (
            (Number.parseFloat(aStats.rpg) - Number.parseFloat(bStats.rpg)) *
            dir
          );
        case "apg":
          return (
            (Number.parseFloat(aStats.apg) - Number.parseFloat(bStats.apg)) *
            dir
          );
        default:
          return 0;
      }
    });
  }, [safePlayers, sortConfig]);

  return (
    <Section title={tTeams("teamDetail.rosterTitle")} variant="highlighted">
      {safePlayers.length === 0 ? (
        <Text variant="caption" className="text-text-muted text-center py-8">
          {tTeams("teamDetail.noPlayers")}
        </Text>
      ) : (
        <>
          <SortControls sortConfig={sortConfig} onSort={handleSort} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sortedPlayers.map((player) => (
              <PlayerCard
                key={player[0]?.player.id}
                player={player}
                stats={calculatePlayerStats(player)}
                onClick={() => router.push(`/players/${player[0]?.player.id}`)}
              />
            ))}
          </div>
        </>
      )}
    </Section>
  );
};

export default TeamRoster;
