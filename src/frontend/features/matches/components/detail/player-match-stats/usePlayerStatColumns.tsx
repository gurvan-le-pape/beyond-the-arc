// src/frontend/features/matches/components/detail/player-match-stats/usePlayerStatColumns.tsx
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { MatchPlayerWithStats } from "@/features/matches/types";
import { formatPlaytime } from "@/features/matches/utils";
import { useRouter } from "@/navigation";
import type { TableColumn } from "@/shared/components/table";
import type { NamedEntity } from "@/shared/types";

import { PlayerNameCell } from "./PlayerNameCell";
import { ShotChartCell } from "./ShotChartCell";

/**
 * Builds the player match stats table columns. Depends on translations and the
 * router (name cell navigation), so it is a hook rather than a static array.
 * `onSelectPlayer` opens the shot chart modal for a player.
 */
export function usePlayerStatColumns(
  onSelectPlayer: (player: NamedEntity) => void,
): TableColumn<MatchPlayerWithStats>[] {
  const tCommon = useTranslations("common");
  const tMatches = useTranslations("matches");
  const router = useRouter();

  return useMemo<TableColumn<MatchPlayerWithStats>[]>(
    () => [
      // The name leads, so that `stickyLead` pins something that identifies
      // the row. Pinning the jersey number instead would keep a bare digit on
      // screen while the player it belongs to scrolled away.
      {
        key: "name",
        header: tMatches("playerMatchStats.name"),
        align: "left",
        render: (p) => (
          <PlayerNameCell
            playerId={p.player.id}
            playerName={p.player.name}
            onNavigate={(id) => router.push(`/players/${id}`)}
          />
        ),
      },
      {
        key: "number",
        header: tMatches("playerMatchStats.number"),
        align: "center",
        numeric: true,
        render: (p) => p.player.number,
      },
      {
        key: "position",
        header: tMatches("playerMatchStats.position"),
        align: "center",
        // Closes the identity group; the divider moved here with the reorder.
        divider: "right",
        render: (p) => p.player.position,
      },
      {
        key: "points",
        header: tCommon("stats.points.abbr"),
        tooltip: tCommon("stats.points.full"),
        numeric: true,
        render: (p) => p.stats.points,
      },
      {
        key: "rebounds",
        header: tCommon("stats.rebounds.abbr"),
        tooltip: tCommon("stats.rebounds.full"),
        numeric: true,
        render: (p) =>
          `${p.stats.rebounds.total} (${p.stats.rebounds.offensive}|${p.stats.rebounds.defensive})`,
      },
      {
        key: "assists",
        header: tCommon("stats.assists.abbr"),
        tooltip: tCommon("stats.assists.full"),
        numeric: true,
        render: (p) => p.stats.assists,
      },
      {
        key: "steals",
        header: tCommon("stats.steals.abbr"),
        tooltip: tCommon("stats.steals.full"),
        numeric: true,
        render: (p) => p.stats.steals,
      },
      {
        key: "blocks",
        header: tCommon("stats.blocks.abbr"),
        tooltip: tCommon("stats.blocks.full"),
        numeric: true,
        render: (p) => p.stats.blocks,
      },
      {
        key: "fouls",
        header: tCommon("stats.fouls.abbr"),
        tooltip: tCommon("stats.fouls.full"),
        numeric: true,
        render: (p) => p.stats.fouls,
      },
      {
        key: "threePoints",
        header: tCommon("stats.threePoints.abbr"),
        tooltip: tCommon("stats.threePoints.full"),
        numeric: true,
        divider: "left",
        render: (p) =>
          `${p.stats.threePointsMade}/${p.stats.threePointsAttempted}`,
      },
      {
        key: "twoPointsInt",
        header: tCommon("stats.twoPointsInt.abbr"),
        tooltip: tCommon("stats.twoPointsInt.full"),
        numeric: true,
        render: (p) =>
          `${p.stats.twoPointsIntMade}/${p.stats.twoPointsIntAttempted}`,
      },
      {
        key: "twoPointsExt",
        header: tCommon("stats.twoPointsExt.abbr"),
        tooltip: tCommon("stats.twoPointsExt.full"),
        numeric: true,
        render: (p) =>
          `${p.stats.twoPointsExtMade}/${p.stats.twoPointsExtAttempted}`,
      },
      {
        key: "freeThrows",
        header: tCommon("stats.freeThrows.abbr"),
        tooltip: tCommon("stats.freeThrows.full"),
        numeric: true,
        divider: "left",
        render: (p) =>
          `${p.stats.freeThrowsMade}/${p.stats.freeThrowsAttempted}`,
      },
      {
        key: "turnovers",
        header: tCommon("stats.turnovers.abbr"),
        tooltip: tCommon("stats.turnovers.full"),
        numeric: true,
        divider: "right",
        render: (p) => p.stats.turnovers,
      },
      {
        key: "playtime",
        header: tMatches("playerMatchStats.playtime"),
        numeric: true,
        divider: "right",
        render: (p) => formatPlaytime(p.stats.playtime),
      },
      {
        key: "shots",
        align: "center",
        width: "icon",
        render: (p) => (
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
