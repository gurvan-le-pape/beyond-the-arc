// src/frontend/features/matches/components/detail/player-match-stats/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import type {
  MatchTeam,
  MatchTeamWithStats,
  Shot,
} from "@/features/matches/types";
import { transformToShotEvents } from "@/features/matches/utils";
import { ShotModal } from "@/features/shot-chart/components";
import { Section } from "@/shared/components/blocks";
import { TextLink } from "@/shared/components/primitives";
import { DataTable } from "@/shared/components/table";
import { Text } from "@/shared/components/typography";
import type { NamedEntity } from "@/shared/types";

import { usePlayerStatColumns } from "./usePlayerStatColumns";

interface PlayerMatchStatsProps {
  readonly team: MatchTeamWithStats;
  readonly isHomeTeam: boolean;
  readonly opponent: MatchTeam;
  readonly playerShots: Record<number, Shot[]>;
}

/**
 * A team's per-player match stats table with a shot-chart modal. Owns the
 * selected-player modal state; the column definitions live in
 * usePlayerStatColumns.
 */
export function PlayerMatchStats({
  team,
  isHomeTeam,
  opponent,
  playerShots,
}: PlayerMatchStatsProps) {
  const [modalPlayer, setModalPlayer] = useState<NamedEntity | null>(null);
  const tCommon = useTranslations("common");
  const tMatches = useTranslations("matches");

  const getPlayerShots = (playerId: number) =>
    transformToShotEvents(playerShots[playerId] ?? []);

  const columns = usePlayerStatColumns(setModalPlayer);

  const sortedPlayers = [...team.players].sort(
    (a, b) => a.player.number - b.player.number,
  );

  return (
    <Section
      title={
        <span>
          {/* A link, not a button with router.push — the team page is a place,
              so it gets an href, a status-bar URL and open-in-new-tab. */}
          <TextLink
            href={`/teams/${team.id}`}
            variant="plain"
            ariaLabel={tMatches("playerMatchStats.viewTeam", {
              team: team.name,
            })}
          >
            {team.name}
          </TextLink>{" "}
          <Text variant="body" as="span">
            (
            {isHomeTeam
              ? tMatches("playerMatchStats.home")
              : tMatches("playerMatchStats.away")}
            )
          </Text>
        </span>
      }
    >
      <DataTable
        columns={columns}
        rows={sortedPlayers}
        getRowKey={(playerWithStats) => playerWithStats.player.number}
        stickyLead
        density="compact"
        wrap={false}
        emptyMessage={tCommon("emptyState.players")}
      />

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
}
