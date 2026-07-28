// src/frontend/features/teams/components/detail/team-roster/index.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import type { TeamPlayerRef } from "@/features/teams/types";
import { useRouter } from "@/navigation";
import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

import { PlayerCard } from "./PlayerCard";
import { SortControls } from "./SortControls";
import type { SortConfig, SortKey } from "./types";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TeamRosterProps {
  players?: TeamPlayerRef[];
}

export const TeamRoster: React.FC<TeamRosterProps> = ({ players }) => {
  // Memoized so the `?? []` fallback doesn't produce a fresh array on every
  // render and invalidate the sort memo below.
  const safePlayers: TeamPlayerRef[] = React.useMemo(
    () => players ?? [],
    [players],
  );

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
      const dir = sortConfig.direction === "asc" ? 1 : -1;

      switch (sortConfig.key) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "number":
          return (a.number - b.number) * dir;
        case "ppg":
          return (
            (a.seasonStats.pointsPerGame - b.seasonStats.pointsPerGame) * dir
          );
        case "rpg":
          return (
            (a.seasonStats.reboundsPerGame - b.seasonStats.reboundsPerGame) *
            dir
          );
        case "apg":
          return (
            (a.seasonStats.assistsPerGame - b.seasonStats.assistsPerGame) * dir
          );
        default:
          return 0;
      }
    });
  }, [safePlayers, sortConfig]);

  return (
    <Section title={tTeams("teamDetail.rosterTitle")} variant="highlighted">
      {safePlayers.length === 0 ? (
        <Text variant="caption" className="text-center py-8">
          {tTeams("teamDetail.noPlayers")}
        </Text>
      ) : (
        <>
          <SortControls sortConfig={sortConfig} onSort={handleSort} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sortedPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={() => router.push(`/players/${player.id}`)}
              />
            ))}
          </div>
        </>
      )}
    </Section>
  );
};

export default TeamRoster;
