// src/frontend/shared/components/domain/LeaderboardTable.tsx
import { useTranslations } from "next-intl";

import type { Leaderboard } from "@/shared/types";
import { formatTeamName } from "@/shared/utils";

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

  // On a phone the table keeps rank, team, points, games played and point
  // difference — wins and losses follow from those — with abbreviated
  // headings whose full label stays on the abbreviation, and the club mark
  // steps aside for the name. All seven at full width made the table more
  // than twice the phone's width.
  const heading = (abbr: string, full: string) => (
    <>
      <abbr title={full} className="no-underline sm:hidden">
        {abbr}
      </abbr>
      <span className="hidden sm:inline">{full}</span>
    </>
  );

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
          <span className="hidden sm:block">
            <ClubMark clubName={row.clubName} size="sm" />
          </span>
          <span>{formatTeamName(row.clubName, row.teamNumber)}</span>
        </div>
      ),
    },
    {
      key: "points",
      header: heading(
        tCommon("stats.points.abbr"),
        tCommon("stats.points.full"),
      ),
      numeric: true,
      render: (row) => row.points,
    },
    {
      key: "gamesPlayed",
      header: heading(
        tCommon("table.abbr.gamesPlayed"),
        tCommon("stats.gamesPlayed"),
      ),
      numeric: true,
      render: (row) => row.gamesPlayed,
    },
    {
      key: "gamesWon",
      header: tCommon("table.gamesWon"),
      from: "sm",
      numeric: true,
      render: (row) => row.gamesWon,
    },
    {
      key: "gamesLost",
      header: tCommon("table.gamesLost"),
      from: "sm",
      numeric: true,
      render: (row) => row.gamesLost,
    },
    {
      key: "pointDifference",
      header: heading(
        tCommon("table.abbr.pointDifference"),
        tCommon("table.pointDifference"),
      ),
      numeric: true,
      render: (row) => row.pointDifference,
    },
  ];

  return (
    <Section title={tCompetitions("leaderboardTitle")}>
      {dropdown && (
        <div className="flex justify-end mb-2">
          <div className="min-w-[200px]">{dropdown}</div>
        </div>
      )}
      <DataTable
        columns={columns}
        rows={leaderboards}
        getRowKey={(row) => row.id}
        density="cozy"
        emptyMessage={tCompetitions("leaderboardEmpty")}
      />
    </Section>
  );
}

export default LeaderboardTable;
