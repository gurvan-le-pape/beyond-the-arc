// src/frontend/features/players/components/detail/player-comparison/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { usePlayerMatches } from "@/features/players/api";
import type { Player, PlayerCareerStats } from "@/features/players/types";
import { Section, StatComparison } from "@/shared/components/blocks";
import { ErrorMessage } from "@/shared/components/feedback";
import { Dot } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

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
            "flex animate-pulse",
            i === 1 && "[animation-delay:200ms]",
            i === 2 && "[animation-delay:400ms]",
          )}
        >
          <Dot />
        </span>
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
 * Career comparison between the page's player and one the reader picks: a
 * search box, then the two players' per-game averages bar against bar.
 *
 * The page's player is already named by the page header, and both players are
 * named in the comparison's own legend, so the widget does not introduce
 * either one again.
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
    <Section title={tPlayers("playerDetail.compareTitle")}>
      <div className="max-w-sm">
        <PlayerSearchDropdown
          excludeId={player.id}
          gender={player.team.gender}
          category={player.team.category}
          selectedPlayer={opponent}
          onSelect={setOpponent}
          onClear={() => setOpponent(null)}
        />
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
          <div className="max-w-2xl mx-auto animate-slide-up">
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
