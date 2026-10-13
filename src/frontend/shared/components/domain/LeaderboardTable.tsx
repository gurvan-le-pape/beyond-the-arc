// src/frontend/shared/components/domain/LeaderboardTable.tsx
import { useTranslations } from "next-intl";

import type { Leaderboard } from "@/shared/types";

import { Section } from "../blocks";
import { DataTable, type TableColumn } from "../table";
import { ClubMark } from "./ClubMark";

interface LeaderboardTableProps {
  readonly leaderboards: Leaderboard[];
  readonly dropdown?: React.ReactNode;
}

/**
 * A pool's standings — rank, team, and the season record.
 *
 * Stays a **server component**. The `dropdown` slot is what keeps it that way:
 * a client-side pool picker is passed in as an element rather than rendered
 * here, so choosing a pool does not pull the table, its columns and the crests
 * into the browser bundle. Marking this `"use client"` to add interactivity
 * would undo that.
 */
export function LeaderboardTable({
  leaderboards,
  dropdown,
}: LeaderboardTableProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  const columns: TableColumn<Leaderboard>[] = [
    {
      key: "rank",
      header: tCommon("table.rank"),
      numeric: true,
      render: (row) => row.rank,
      emphasis: true,
    },
    {
      key: "team",
      header: tCommon("table.team"),
      align: "left",
      render: (row) => (
        <div className="flex items-center gap-2">
          <ClubMark clubName={row.clubName} size="sm" />
          <span>
            {row.clubName} - {row.teamNumber}
          </span>
        </div>
      ),
    },
    {
      key: "points",
      header: tCommon("stats.points.full"),
      numeric: true,
      render: (row) => row.points,
    },
    {
      key: "gamesPlayed",
      header: tCommon("stats.gamesPlayed"),
      numeric: true,
      render: (row) => row.gamesPlayed,
    },
    {
      key: "gamesWon",
      header: tCommon("table.gamesWon"),
      numeric: true,
      render: (row) => row.gamesWon,
    },
    {
      key: "gamesLost",
      header: tCommon("table.gamesLost"),
      numeric: true,
      render: (row) => row.gamesLost,
    },
    {
      key: "pointDifference",
      header: tCommon("table.pointDifference"),
      numeric: true,
      render: (row) => row.pointDifference,
    },
  ];

  return (
    <Section variant="highlighted" title={tCompetitions("leaderboardTitle")}>
      <div className="flex justify-end mb-2">
        <div className="min-w-[200px]">{dropdown}</div>
      </div>
      <DataTable
        columns={columns}
        rows={leaderboards}
        getRowKey={(row) => row.id}
        emptyMessage={tCompetitions("leaderboardEmpty")}
      />
    </Section>
  );
}

export default LeaderboardTable;
