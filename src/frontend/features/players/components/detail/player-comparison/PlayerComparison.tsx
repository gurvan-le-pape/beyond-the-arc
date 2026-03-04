// src/frontend/features/players/components/detail/player-comparison/PlayerComparison.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { usePlayerMatches } from "@/features/players/api/usePlayers";
import type { Player } from "@/features/players/types/Player";
import { aggregateStats } from "@/features/players/utils/statsAggregation";
import { Section } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui";

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

function PlayerCard({
  player,
  side,
  placeholder,
}: {
  player: Player | null;
  side: "left" | "right";
  placeholder: React.ReactNode;
}) {
  const isRight = side === "right";

  return (
    <div
      className={`flex-1 flex flex-col ${
        isRight ? "items-end text-right" : "items-start text-left"
      }`}
      style={{
        animation: player
          ? "playerCardSlideIn 0.4s cubic-bezier(.22,1,.36,1) both"
          : "none",
        animationDelay: isRight ? "60ms" : "0ms",
      }}
    >
      {player ? (
        <>
          <span
            className="text-7xl font-black leading-none select-none pointer-events-none"
            style={{
              color: "transparent",
              WebkitTextStroke: `2px ${
                isRight
                  ? "var(--color-secondary-400)"
                  : "var(--color-primary-400)"
              }`,
              opacity: 0.35,
              lineHeight: 1,
            }}
          >
            #{player.number}
          </span>

          <span className="text-lg font-bold text-gray-900 dark:text-gray-100 -mt-2 relative z-10">
            {player.name}
          </span>

          {player.team?.club?.name && (
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {player.team.club.name}
            </span>
          )}
        </>
      ) : (
        placeholder
      )}
    </div>
  );
}

function VsBadge() {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0 mx-2">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--color-primary-rgb, 99,102,241), 0.25) 0%, transparent 70%)",
          filter: "blur(8px)",
          animation: "vsPulse 2.4s ease-in-out infinite",
        }}
      />
      <div
        className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-500, #6366f1), var(--color-secondary-500, #14b8a6))",
        }}
      >
        <span className="text-white text-xs font-black tracking-widest">
          VS
        </span>
      </div>
    </div>
  );
}

const KEYFRAMES = `
  @keyframes playerCardSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes vsPulse {
    0%, 100% { transform: scale(1);   opacity: 0.7; }
    50%      { transform: scale(1.15); opacity: 1;   }
  }
  @keyframes tableReveal {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
`;

function KeyframeInjector() {
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
}

interface PlayerComparisonProps {
  player: Player;
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

  const labelForPlayer = (p: Player) => `#${p.number} ${p.name}`;

  return (
    <Section
      title={tPlayers("playerDetail.compareTitle")}
      variant="highlighted"
      className="mb-8"
    >
      <KeyframeInjector />

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ minHeight: 140 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, " +
              "rgba(var(--color-primary-rgb, 99,102,241), 0.08) 0%, " +
              "transparent 45%, " +
              "transparent 55%, " +
              "rgba(var(--color-secondary-rgb, 20,184,166), 0.08) 100%)",
          }}
        />

        <div
          className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(150,150,150,0.25), transparent)",
          }}
        />

        <div className="relative z-10 flex items-center justify-between px-6 py-6 gap-4">
          <PlayerCard player={player} side="left" placeholder={null} />
          <VsBadge />

          {!opponent ? (
            <div className="flex-1 flex justify-end">
              <div className="w-full max-w-[260px]">
                <PlayerSearchDropdown
                  excludeId={player.id}
                  onSelect={setOpponent}
                />
              </div>
            </div>
          ) : (
            <PlayerCard player={opponent} side="right" placeholder={null} />
          )}
        </div>
      </div>

      {opponent && (
        <div className="flex justify-center mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpponent(null)}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xs"
          >
            {tCommon("clear")}
          </Button>
        </div>
      )}

      <div className="mt-5">
        {isLoadingOpponent && (
          <div className="flex items-center justify-center gap-2 py-6">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-500"
                style={{
                  animation: "vsPulse 1.2s ease-in-out infinite",
                  animationDelay: `${i * 200}ms`,
                }}
              />
            ))}
          </div>
        )}

        {statsB && !isLoadingOpponent && (
          <div
            style={{
              animation: "tableReveal 0.45s cubic-bezier(.22,1,.36,1) both",
            }}
          >
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
