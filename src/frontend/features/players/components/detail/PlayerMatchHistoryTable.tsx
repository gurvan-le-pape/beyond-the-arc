// src/frontend/features/players/components/detail/PlayerMatchHistoryTable.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { MatchHistoryTable } from "@/features/matches/components";
import { useRouter } from "@/navigation";

import { usePlayerMatchHistoryColumns } from "../../hooks";
import type { Player } from "../../types/Player";
import type { PlayerMatchHistory } from "../../types/PlayerMatchHistory";

interface PlayerMatchHistoryTableProps {
  player: Player;
  matches: PlayerMatchHistory[];
  maxRows?: number;
}

export function PlayerMatchHistoryTable({
  player,
  matches,
  maxRows = 5,
}: PlayerMatchHistoryTableProps) {
  const tCommon = useTranslations("common");
  const tPlayers = useTranslations("players");
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const columns = usePlayerMatchHistoryColumns(player);

  return (
    <MatchHistoryTable
      title={tPlayers("playerDetail.matchHistoryTitle")}
      matches={matches}
      columns={columns}
      emptyMessage={tCommon("matchHistory.noMatches")}
      onRowClick={(match) => void router.push(`/matches/${match.id}`)}
      showAll={showAll}
      setShowAll={setShowAll}
      showAllLabel={tCommon("matchHistory.seeAllMatches", {
        count: matches.length,
      })}
      showLessLabel={tCommon("seeLess")}
      maxRows={maxRows}
    />
  );
}
