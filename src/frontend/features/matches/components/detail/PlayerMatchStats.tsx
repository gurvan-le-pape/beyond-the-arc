// src/frontend/features/matches/components/detail/PlayerMatchStats.tsx
"use client";

import { BarChart2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

import { ShotModal } from "@/features/charts/components";
import { formatPlaytime } from "@/features/matches/utils";
import type { Player } from "@/features/players/types";
import type { TeamInfo, TeamInfoExtended } from "@/features/teams/types";
import { useRouter } from "@/navigation";
import { Section } from "@/shared/components/blocks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";
import { Text } from "@/shared/components/typography";

import type { MatchEvent } from "../../types/MatchEvent";

interface PlayerMatchStatsProps {
  team: TeamInfoExtended;
  isHomeTeam: boolean;
  opponent: TeamInfo;
  playerShots: Record<number, MatchEvent[]>;
}

/**
 * Column definition for player stats table
 */
interface StatColumn {
  id: string;
  label?: string;
  tooltip?: string;
  align?: "left" | "center" | "right";
  getValue: (player: any) => string | number | React.ReactNode;
  className?: string;
}

interface PlayerNameCellProps {
  readonly playerId: number;
  readonly playerName: string;
  readonly onNavigate: (id: number) => void;
}

function PlayerNameCell({
  playerId,
  playerName,
  onNavigate,
}: PlayerNameCellProps) {
  return (
    <button
      type="button"
      className="cursor-pointer hover:text-primary bg-transparent border-none p-0 m-0 font-inherit text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ring-offset-surface rounded"
      onClick={() => onNavigate(playerId)}
    >
      {playerName}
    </button>
  );
}

interface ShotChartCellProps {
  readonly player: any;
  readonly onSelect: (player: any) => void;
  readonly label: string;
}

function ShotChartCell({ player, onSelect, label }: ShotChartCellProps) {
  return (
    <button
      className="p-1 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary ring-offset-surface rounded"
      title={label}
      onClick={() => onSelect(player)}
      aria-label={label}
    >
      <BarChart2 className="h-5 w-5 text-primary" aria-hidden />
    </button>
  );
}

export const PlayerMatchStats: React.FC<PlayerMatchStatsProps> = ({
  team,
  isHomeTeam,
  opponent,
  playerShots,
}) => {
  const router = useRouter();
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);
  const tCommon = useTranslations("common");
  const tMatches = useTranslations("matches");

  // Use shot data from playerShots prop
  const getPlayerShots = (playerId: number) => playerShots[playerId] ?? [];

  // Define columns configuration
  const columns: StatColumn[] = useMemo(
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
            onSelect={setModalPlayer}
            label={tMatches("playerMatchStats.shotChart")}
          />
        ),
      },
    ],
    [tCommon, tMatches, router],
  );

  const sortedPlayers = [...team.players].sort(
    (a, b) => a.player.number - b.player.number,
  );

  return (
    <Section
      title={
        <span>
          <button
            type="button"
            className="text-text-heading cursor-pointer hover:text-primary bg-transparent border-none p-0 m-0 font-inherit transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ring-offset-surface rounded"
            onClick={() => router.push(`/teams/${team.id}`)}
            aria-label={`${tMatches("playerMatchStats.viewTeam")} ${team.name}`}
          >
            {team.name}
          </button>{" "}
          <Text variant="body" as="span">
            (
            {isHomeTeam
              ? tMatches("playerMatchStats.home")
              : tMatches("playerMatchStats.away")}
            )
          </Text>
        </span>
      }
      variant="highlighted"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  align={column.align}
                  size="compact"
                  tooltip={column.tooltip}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((playerWithStats) => (
              <TableRow
                key={playerWithStats.player.number}
                hoverable
                clickable={false}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    className={column.className}
                    size="compact"
                  >
                    {column.getValue(playerWithStats)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for shot chart */}
      <ShotModal
        open={!!modalPlayer}
        player={modalPlayer ?? null}
        onClose={() => setModalPlayer(null)}
        teamName={team.name}
        opponentTeamName={opponent.name}
        teamScore={team.score}
        opponentScore={opponent.score}
        getPlayerShots={getPlayerShots}
      />
    </Section>
  );
};

export default PlayerMatchStats;
