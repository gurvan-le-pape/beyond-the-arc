// src/frontend/features/matches/components/detail/player-match-stats/usePlayerStatColumns.tsx
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { formatPlaytime } from "@/features/matches/utils";
import { useRouter } from "@/navigation";
import type { NamedEntity } from "@/shared/types";

import { PlayerNameCell } from "./PlayerNameCell";
import { ShotChartCell } from "./ShotChartCell";
import type { StatColumn } from "./types";

/**
 * Builds the player match stats table columns. Depends on translations and the
 * router (name cell navigation), so it is a hook rather than a static array.
 * `onSelectPlayer` opens the shot chart modal for a player.
 */
export function usePlayerStatColumns(
  onSelectPlayer: (player: NamedEntity) => void,
): StatColumn[] {
  const tCommon = useTranslations("common");
  const tMatches = useTranslations("matches");
  const router = useRouter();

  return useMemo<StatColumn[]>(
    () => [
      {
        id: "number",
        label: tMatches("playerMatchStats.number"),
        align: "center",
        getValue: (p) => p.player.number,
      },
      {
        id: "position",
        label: tMatches("playerMatchStats.position"),
        align: "center",
        getValue: (p) => p.player.position,
      },
      {
        id: "name",
        label: tMatches("playerMatchStats.name"),
        align: "left",
        className: "border-r border-divide",
        getValue: (p) => (
          <PlayerNameCell
            playerId={p.player.id}
            playerName={p.player.name}
            onNavigate={(id) => router.push(`/players/${id}`)}
          />
        ),
      },
      {
        id: "points",
        label: tCommon("stats.points.abbr"),
        tooltip: tCommon("stats.points.full"),
        align: "center",
        getValue: (p) => p.stats.points,
      },
      {
        id: "rebounds",
        label: tCommon("stats.rebounds.abbr"),
        tooltip: tCommon("stats.rebounds.full"),
        align: "center",
        getValue: (p) =>
          `${p.stats.rebounds.total} (${p.stats.rebounds.offensive}|${p.stats.rebounds.defensive})`,
      },
      {
        id: "assists",
        label: tCommon("stats.assists.abbr"),
        tooltip: tCommon("stats.assists.full"),
        align: "center",
        getValue: (p) => p.stats.assists,
      },
      {
        id: "steals",
        label: tCommon("stats.steals.abbr"),
        tooltip: tCommon("stats.steals.full"),
        align: "center",
        getValue: (p) => p.stats.steals,
      },
      {
        id: "blocks",
        label: tCommon("stats.blocks.abbr"),
        tooltip: tCommon("stats.blocks.full"),
        align: "center",
        getValue: (p) => p.stats.blocks,
      },
      {
        id: "fouls",
        label: tCommon("stats.fouls.abbr"),
        tooltip: tCommon("stats.fouls.full"),
        align: "center",
        getValue: (p) => p.stats.fouls,
      },
      {
        id: "threePoints",
        label: tCommon("stats.threePoints.abbr"),
        tooltip: tCommon("stats.threePoints.full"),
        align: "center",
        className: "border-l border-divide",
        getValue: (p) =>
          `${p.stats.threePointsMade}/${p.stats.threePointsAttempted}`,
      },
      {
        id: "twoPointsInt",
        label: tCommon("stats.twoPointsInt.abbr"),
        tooltip: tCommon("stats.twoPointsInt.full"),
        align: "center",
        getValue: (p) =>
          `${p.stats.twoPointsIntMade}/${p.stats.twoPointsIntAttempted}`,
      },
      {
        id: "twoPointsExt",
        label: tCommon("stats.twoPointsExt.abbr"),
        tooltip: tCommon("stats.twoPointsExt.full"),
        align: "center",
        getValue: (p) =>
          `${p.stats.twoPointsExtMade}/${p.stats.twoPointsExtAttempted}`,
      },
      {
        id: "freeThrows",
        label: tCommon("stats.freeThrows.abbr"),
        tooltip: tCommon("stats.freeThrows.full"),
        align: "center",
        className: "border-l border-divide",
        getValue: (p) =>
          `${p.stats.freeThrowsMade}/${p.stats.freeThrowsAttempted}`,
      },
      {
        id: "turnovers",
        label: tCommon("stats.turnovers.abbr"),
        tooltip: tCommon("stats.turnovers.full"),
        align: "center",
        className: "border-r border-divide",
        getValue: (p) => p.stats.turnovers,
      },
      {
        id: "playtime",
        label: tMatches("playerMatchStats.playtime"),
        align: "center",
        className: "border-r border-divide",
        getValue: (p) => formatPlaytime(p.stats.playtime),
      },
      {
        id: "shots",
        align: "center",
        className: "w-8",
        getValue: (p) => (
          <ShotChartCell
            player={p.player}
            onSelect={onSelectPlayer}
            label={tMatches("playerMatchStats.shotChart")}
          />
        ),
      },
    ],
    [tCommon, tMatches, router, onSelectPlayer],
  );
}
