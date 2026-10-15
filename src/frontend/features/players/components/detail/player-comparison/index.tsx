// src/frontend/features/players/components/detail/player-comparison/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { usePlayerMatches } from "@/features/players/api";
import type { Player, PlayerCareerStats } from "@/features/players/types";
import { Section, StatComparison } from "@/shared/components/blocks";
import { ErrorMessage } from "@/shared/components/feedback";
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
            "inline-block w-2 h-2 rounded-full bg-solid-primary animate-pulse",
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
  /**
   * The player's own career aggregate, already fetched server-side by the page
   * that renders this. Passed in rather than refetched: the identical
   * /players/{id}/matches response is on screen above this widget, and two
   * independently invalidated caches for one resource disagree with each other.
   */
  readonly careerStats: PlayerCareerStats | null;
}

/**
 * Side-by-side career comparison between the page's player and one the reader
 * picks.
 *
 * **The two sides are loaded differently, deliberately.** The subject's stats
 * arrive as a prop from the page that already fetched them; the opponent's are
 * fetched client-side once one is chosen. So only the right-hand column has
 * loading and error states, and only it can fail while the rest of the widget
 * still renders.
 *
 * The opponent query is issued with an id of `0` until a player is selected,
 * which is safe only because `enabled` gates it — the query never runs with
 * that id. Keep the two together if you touch either.
 */
export function PlayerComparison({
  player,
  careerStats,
}: PlayerComparisonProps) {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");

  const [opponent, setOpponent] = useState<Player | null>(null);

  const {
    data: opponentData,
    isLoading: isLoadingOpponent,
    isError: opponentFailed,
    refetch: retryOpponent,
  } = usePlayerMatches(opponent?.id ?? 0, { enabled: !!opponent });

  const statsA = careerStats;
  const statsB = opponent ? (opponentData?.career ?? null) : null;

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
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-tint-primary via-transparent to-tint-secondary opacity-50" />
          <div className="hidden sm:block absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-divide opacity-25" />
        </div>

        {/* Side by side from sm up; stacked on phones, where the search box
            would otherwise shrink to its icon beside the player card. */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 py-4 sm:px-6 sm:py-6 gap-4">
          <PlayerIdentity
            player={player}
            side="left"
            className="flex-1 animate-slide-up"
          />

          <Badge
            variant="vs"
            size="lg"
            className="w-12 h-12 rounded-full justify-center shadow-lg self-center sm:mx-2"
          >
            VS
          </Badge>

          <div className="sm:flex-1 flex justify-end">
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

        {/* A failed opponent lookup leaves statsB null, which renders exactly
            like "no opponent picked yet" — silence where a failure happened. */}
        {opponentFailed && !isLoadingOpponent && (
          <ErrorMessage
            message={tCommon("errors.fetchPlayers")}
            onRetry={retryOpponent}
          />
        )}

        {statsA && statsB && !isLoadingOpponent && (
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
