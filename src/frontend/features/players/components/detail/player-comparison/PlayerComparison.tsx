// src/frontend/features/players/components/detail/player-comparison/PlayerComparison.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { usePlayerMatches } from "@/features/players/api/use-players";
import type { Player } from "@/features/players/types/Player";
import { aggregateStats } from "@/features/players/utils/statsAggregation";
import { Section } from "@/shared/components/blocks";
import { Badge } from "@/shared/components/primitives";

import { PlayerIdentity } from "../PlayerIdentity";
import { PlayerSearchDropdown } from "../PlayerSearchDropdown";
import { type ComparisonStatConfig, ComparisonTable } from "./ComparisonTable";

const comparisonConfig: ComparisonStatConfig[] = [
  {
    key: "gamesPlayed",
    labelKey: "stats.gamesPlayed",
    value: (s) => s.gamesPlayed,
  },
  {
    key: "pointsPerGame",
    labelKey: "stats.pointsPerGame",
    value: (s) =>
      s.gamesPlayed > 0 ? (s.points / s.gamesPlayed).toFixed(1) : "0.0",
  },
  {
    key: "reboundsPerGame",
    labelKey: "stats.reboundsPerGame",
    value: (s) =>
      s.gamesPlayed > 0 ? (s.rebounds / s.gamesPlayed).toFixed(1) : "0.0",
  },
  {
    key: "assistsPerGame",
    labelKey: "stats.assistsPerGame",
    value: (s) =>
      s.gamesPlayed > 0 ? (s.assists / s.gamesPlayed).toFixed(1) : "0.0",
  },
  {
    key: "stealsPerGame",
    labelKey: "stats.stealsPerGame",
    value: (s) =>
      s.gamesPlayed > 0 ? (s.steals / s.gamesPlayed).toFixed(1) : "0.0",
  },
  {
    key: "blocksPerGame",
    labelKey: "stats.blocksPerGame",
    value: (s) =>
      s.gamesPlayed > 0 ? (s.blocks / s.gamesPlayed).toFixed(1) : "0.0",
  },
  {
    key: "turnoversPerGame",
    labelKey: "stats.turnoversPerGame",
    value: (s) =>
      s.gamesPlayed > 0 ? (s.turnovers / s.gamesPlayed).toFixed(1) : "0.0",
    lowerIsBetter: true,
  },
  {
    key: "foulsPerGame",
    labelKey: "stats.foulsPerGame",
    value: (s) =>
      s.gamesPlayed > 0 ? (s.fouls / s.gamesPlayed).toFixed(1) : "0.0",
    lowerIsBetter: true,
  },
];

interface PlayerComparisonProps {
  readonly player: Player;
}

export function PlayerComparison({ player }: PlayerComparisonProps) {
  const tPlayers = useTranslations("players");

  const [opponent, setOpponent] = useState<Player | null>(null);

  const { data: playerMatches = [] } = usePlayerMatches(player.id);
  const { data: opponentMatches = [], isLoading: isLoadingOpponent } =
    usePlayerMatches(opponent?.id ?? 0, { enabled: !!opponent });

  const statsA = aggregateStats(playerMatches.map((m) => m.player.stats));
  const statsB = opponent
    ? aggregateStats(opponentMatches.map((m) => m.player.stats))
    : null;

  const labelForPlayer = (p: Player) => `#${p.number} ${p.name}`;

  return (
    <Section
      title={tPlayers("playerDetail.compareTitle")}
      variant="highlighted"
    >
      <div className="relative rounded-2xl min-h-[140px]">
        {/* Decorations */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-ghost via-transparent to-secondary-ghost opacity-50" />
          <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-divide opacity-25" />
        </div>

        <div className="relative z-10 flex items-center justify-between px-6 py-6 gap-4">
          <PlayerIdentity
            player={player}
            side="left"
            className="flex-1 animate-slide-up"
          />

          <Badge
            variant="vs"
            size="lg"
            className="w-12 h-12 rounded-full justify-center shadow-lg mx-2"
          >
            VS
          </Badge>

          <div className="flex-1 flex justify-end">
            <PlayerSearchDropdown
              excludeId={player.id}
              gender={player.team.gender}
              category={player.team.category}
              selectedPlayer={opponent}
              onSelect={setOpponent}
              onClear={() => setOpponent(null)}
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        {isLoadingOpponent && (
          <div className="flex items-center justify-center gap-2 py-6">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={[
                  "inline-block w-2 h-2 rounded-full bg-primary animate-pulse",
                  i === 1 && "[animation-delay:200ms]",
                  i === 2 && "[animation-delay:400ms]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ))}
          </div>
        )}

        {statsB && !isLoadingOpponent && (
          <div className="animate-slide-up">
            <ComparisonTable
              statsA={statsA}
              statsB={statsB}
              labelA={labelForPlayer(player)}
              labelB={labelForPlayer(opponent!)}
              config={comparisonConfig}
            />
          </div>
        )}
      </div>
    </Section>
  );
}
