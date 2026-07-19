// src/frontend/features/players/components/detail/PlayerComparison.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { usePlayerMatches } from "@/features/players/api";
import type { Player } from "@/features/players/types";
import { aggregateStats } from "@/features/players/utils";
import { Section, StatComparison } from "@/shared/components/blocks";
import { Badge } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

import { PlayerIdentity } from "./PlayerIdentity";
import { PlayerSearchDropdown } from "./PlayerSearchDropdown";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function labelForPlayer(p: Player) {
  return `#${p.number} ${p.name}`;
}

// ─── Loading indicator ────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "inline-block w-2 h-2 rounded-full bg-primary animate-pulse",
            i === 1 && "[animation-delay:200ms]",
            i === 2 && "[animation-delay:400ms]",
          )}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface PlayerComparisonProps {
  readonly player: Player;
}

export function PlayerComparison({ player }: PlayerComparisonProps) {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");

  const [opponent, setOpponent] = useState<Player | null>(null);

  const { data: playerMatches = [] } = usePlayerMatches(player.id);
  const { data: opponentMatches = [], isLoading: isLoadingOpponent } =
    usePlayerMatches(opponent?.id ?? 0, { enabled: !!opponent });

  const statsA = aggregateStats(playerMatches.map((m) => m.player.stats));
  const statsB = opponent
    ? aggregateStats(opponentMatches.map((m) => m.player.stats))
    : null;

  const statCategories = useMemo(
    () => [
      { key: "gamesPlayed", label: tCommon("stats.gamesPlayed") },
      { key: "pointsPerGame", label: tCommon("stats.pointsPerGame") },
      { key: "reboundsPerGame", label: tCommon("stats.reboundsPerGame") },
      { key: "assistsPerGame", label: tCommon("stats.assistsPerGame") },
      { key: "stealsPerGame", label: tCommon("stats.stealsPerGame") },
      { key: "blocksPerGame", label: tCommon("stats.blocksPerGame") },
      {
        key: "turnoversPerGame",
        label: tCommon("stats.turnoversPerGame"),
        lowerIsBetter: true,
      },
      {
        key: "foulsPerGame",
        label: tCommon("stats.foulsPerGame"),
        lowerIsBetter: true,
      },
    ],
    [tCommon],
  );

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
        {isLoadingOpponent && <LoadingDots />}

        {statsB && !isLoadingOpponent && (
          <div className="animate-slide-up">
            <StatComparison
              variant="mirrored"
              sideA={statsA}
              sideB={statsB}
              labelA={labelForPlayer(player)}
              labelB={labelForPlayer(opponent!)}
              config={statCategories}
            />
          </div>
        )}
      </div>
    </Section>
  );
}
