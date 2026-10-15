// src/frontend/features/matches/components/detail/player-match-stats/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { ShotModal } from "@/features/charts/components";
import type { MatchEvent } from "@/features/matches/types";
import type { TeamInfo, TeamInfoExtended } from "@/features/teams/types";
import { Link } from "@/navigation";
import { Section } from "@/shared/components/blocks";
import { DataTable } from "@/shared/components/table";
import { Text } from "@/shared/components/typography";
import type { NamedEntity } from "@/shared/types";

import { usePlayerStatColumns } from "./usePlayerStatColumns";

interface PlayerMatchStatsProps {
  readonly team: TeamInfoExtended;
  readonly isHomeTeam: boolean;
  readonly opponent: TeamInfo;
  readonly playerShots: Record<number, MatchEvent[]>;
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

  const getPlayerShots = (playerId: number) => playerShots[playerId] ?? [];

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
          <Link
            href={`/teams/${team.id}`}
            className="text-text-heading hover:text-ink-primary transition-colors duration-200 rounded focus-ring"
            aria-label={tMatches("playerMatchStats.viewTeam", {
              team: team.name,
            })}
          >
            {team.name}
          </Link>{" "}
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

export default PlayerMatchStats;
