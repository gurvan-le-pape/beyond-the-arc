// src/frontend/features/players/components/detail/PlayerMatchHistoryTable.tsx
// PlayerMatchHistoryTable.tsx
"use client";

import { useTranslations } from "next-intl";

import { MatchHistoryTable } from "@/features/matches/components";
import { useRouter } from "@/navigation";

import { usePlayerMatchHistoryColumns } from "../../hooks";
import type { Player } from "../../types/Player";
import type { PlayerMatchHistory } from "../../types/PlayerMatchHistory";

interface PlayerMatchHistoryTableProps {
  readonly player: Player;
  readonly matches: PlayerMatchHistory[];
  readonly maxRows?: number;
}

export function PlayerMatchHistoryTable({
  player,
  matches,
  maxRows = 5,
}: PlayerMatchHistoryTableProps) {
  const tCommon = useTranslations("common");
  const tPlayers = useTranslations("players");
  const router = useRouter();

  const columns = usePlayerMatchHistoryColumns(player);

  return (
    <MatchHistoryTable
      title={tPlayers("playerDetail.matchHistoryTitle")}
      matches={matches}
      columns={columns}
      emptyMessage={tCommon("matchHistory.noMatches")}
      onRowClick={(match) => router.push(`/matches/${match.id}`)}
      showAllLabel={tCommon("matchHistory.seeAllMatches", {
        count: matches.length,
      })}
      showLessLabel={tCommon("seeLess")}
      maxRows={maxRows}
    />
  );
}
