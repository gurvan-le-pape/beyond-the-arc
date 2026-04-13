// src/frontend/features/matches/components/detail/PlayerMatchStats.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

import { formatPlaytime } from "@/features/matches/utils/formatPlaytime";
import type { Player } from "@/features/players/types/Player";
import type {
  TeamInfo,
  TeamInfoExtended,
} from "@/features/teams/types/TeamInfo";
import { useRouter } from "@/navigation";
import { Section } from "@/shared/components/blocks";
import { ShotModal } from "@/shared/components/charts";
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
      className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 bg-transparent border-none p-0 m-0 font-inherit text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded"
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
      className="p-1 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded"
      title={label}
      onClick={() => onSelect(player)}
      aria-label={label}
    >
      <img
        src="/images/icons/chart-bar.svg"
        alt={label}
        className="h-5 w-5 text-primary-600 dark:text-primary-400"
        draggable="false"
      />
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
        align: "left",
        getValue: (p) => p.player.number,
      },
      {
        id: "name",
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
        label: tCommon("statAbbreviations.pts"),
        align: "center",
        getValue: (p) => p.stats.points,
      },
      {
        id: "rebounds",
        label: tCommon("statAbbreviations.reb"),
        align: "center",
        getValue: (p) =>
          `${p.stats.rebounds.total} (${p.stats.rebounds.offensive}|${p.stats.rebounds.defensive})`,
      },
      {
        id: "assists",
        label: tCommon("statAbbreviations.ast"),
        align: "center",
        getValue: (p) => p.stats.assists,
      },
      {
        id: "steals",
        label: tCommon("statAbbreviations.stl"),
        align: "center",
        getValue: (p) => p.stats.steals,
      },
      {
        id: "blocks",
        label: tCommon("statAbbreviations.blk"),
        align: "center",
        getValue: (p) => p.stats.blocks,
      },
      {
        id: "fouls",
        label: tCommon("statAbbreviations.fl"),
        align: "center",
        getValue: (p) => p.stats.fouls,
      },
      {
        id: "threePoints",
        label: tCommon("stats.threePoints"),
        align: "center",
        getValue: (p) =>
          `${p.stats.threePointsMade}/${p.stats.threePointsAttempted}`,
      },
      {
        id: "twoPointsInt",
        label: tCommon("stats.twoPointsInt"),
        align: "center",
        getValue: (p) =>
          `${p.stats.twoPointsIntMade}/${p.stats.twoPointsIntAttempted}`,
      },
      {
        id: "twoPointsExt",
        label: tCommon("stats.twoPointsExt"),
        align: "center",
        getValue: (p) =>
          `${p.stats.twoPointsExtMade}/${p.stats.twoPointsExtAttempted}`,
      },
      {
        id: "freeThrows",
        label: tCommon("statAbbreviations.ft"),
        align: "center",
        getValue: (p) =>
          `${p.stats.freeThrowsMade}/${p.stats.freeThrowsAttempted}`,
      },
      {
        id: "turnovers",
        label: tCommon("statAbbreviations.to"),
        align: "center",
        getValue: (p) => p.stats.turnovers,
      },
      {
        id: "playtime",
        label: tMatches("playerMatchStats.playtime"),
        align: "center",
        getValue: (p) => formatPlaytime(p.stats.playtime),
      },
      {
        id: "shots",
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

  return (
    <Section
      title={
        <span>
          <button
            type="button"
            className="text-text-heading dark:text-text-emphasis-dark cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 bg-transparent border-none p-0 m-0 font-inherit transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded"
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
                <TableHead key={column.id} align={column.align} size="compact">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.players.map((playerWithStats, index) => (
              <TableRow
                key={playerWithStats.player.number}
                hoverable
                clickable={false}
                className={
                  index % 2 === 0
                    ? "bg-primary-50 dark:bg-primary-900/20"
                    : "bg-surface-raised dark:bg-surface-raised-dark"
                }
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
