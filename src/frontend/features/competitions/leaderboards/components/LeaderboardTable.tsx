// src/frontend/features/competitions/leaderboards/components/LeaderboardTable.tsx
import { useFormatter, useTranslations } from "next-intl";

import type { Leaderboard } from "@/features/competitions/leaderboards/types";
import { Section } from "@/shared/components/blocks";
import { DataTable, type TableColumn } from "@/shared/components/table";
import { formatTeamName } from "@/shared/utils";

import { FormGuide } from "./FormGuide";

interface LeaderboardTableProps {
  readonly leaderboards: Leaderboard[];
  /**
   * `full` is the pool's table, every column. `summary` is a glance at it
   * beside other content: rank, team, record, point difference and points,
   * points last.
   */
  readonly variant?: "full" | "summary";
  /** Beside the title: a link onward, such as to the full table. */
  readonly action?: React.ReactNode;
}

/**
 * A pool's standings — rank, team, the season record and, in the full
 * table, recent form. Each row links to its team.
 *
 * Stays a **server component**, so the table and its columns never reach the
 * browser bundle. Controls that change what it shows, such as a pool picker,
 * belong to the page around it; marking this `"use client"` to hold one would
 * undo that.
 */
export function LeaderboardTable({
  leaderboards,
  variant = "full",
  action,
}: LeaderboardTableProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const format = useFormatter();

  // Number headings are abbreviated at every width, with the full label on
  // the abbreviation, and never break at the dash in "W–L": the width goes to
  // the team names, in a table about 700px wide beside the matches. On a
  // phone, wins and losses are left out — they follow from games played and
  // points.
  const abbreviation = (abbr: string, full: string) => (
    <abbr title={full} className="no-underline whitespace-nowrap">
      {abbr}
    </abbr>
  );

  const signed = (value: number) =>
    format.number(value, { signDisplay: "exceptZero" });

  const rankColumn: TableColumn<Leaderboard> = {
    key: "rank",
    header: tCommon("table.rank"),
    numeric: true,
    render: (row) => row.rank,
    emphasis: true,
  };

  const teamColumn: TableColumn<Leaderboard> = {
    key: "team",
    header: tCommon("table.team"),
    align: "left",
    render: (row) => formatTeamName(row.clubName, row.teamNumber),
  };

  const summaryColumns: TableColumn<Leaderboard>[] = [
    rankColumn,
    {
      key: "team",
      header: tCommon("table.team"),
      align: "left",
      render: (row) => formatTeamName(row.clubName, row.teamNumber),
    },
    {
      key: "record",
      header: abbreviation(
        tCommon("table.abbr.record"),
        tCommon("table.record"),
      ),
      numeric: true,
      render: (row) => (
        <span className="whitespace-nowrap">
          {row.gamesWon}–{row.gamesLost}
        </span>
      ),
    },
    {
      key: "pointDifference",
      header: abbreviation(
        tCommon("table.abbr.pointDifference"),
        tCommon("table.pointDifference"),
      ),
      numeric: true,
      render: (row) => signed(row.pointDifference),
    },
    {
      key: "points",
      header: abbreviation(
        tCommon("stats.points.abbr"),
        tCommon("stats.points.full"),
      ),
      numeric: true,
      render: (row) => row.points,
      emphasis: true,
    },
  ];

  const fullColumns: TableColumn<Leaderboard>[] = [
    rankColumn,
    teamColumn,
    {
      key: "points",
      header: abbreviation(
        tCommon("stats.points.abbr"),
        tCommon("stats.points.full"),
      ),
      numeric: true,
      render: (row) => row.points,
    },
    {
      key: "gamesPlayed",
      header: abbreviation(
        tCommon("table.abbr.gamesPlayed"),
        tCommon("stats.gamesPlayed"),
      ),
      numeric: true,
      render: (row) => row.gamesPlayed,
    },
    {
      key: "gamesWon",
      header: abbreviation(
        tCommon("table.abbr.gamesWon"),
        tCommon("table.gamesWon"),
      ),
      from: "sm",
      numeric: true,
      render: (row) => row.gamesWon,
    },
    {
      key: "gamesLost",
      header: abbreviation(
        tCommon("table.abbr.gamesLost"),
        tCommon("table.gamesLost"),
      ),
      from: "sm",
      numeric: true,
      render: (row) => row.gamesLost,
    },
    {
      key: "pointDifference",
      header: abbreviation(
        tCommon("table.abbr.pointDifference"),
        tCommon("table.pointDifference"),
      ),
      numeric: true,
      render: (row) => signed(row.pointDifference),
    },
    {
      key: "form",
      header: tCompetitions("form.title"),
      tooltip: tCompetitions("form.description"),
      from: "sm",
      align: "left",
      width: "fit",
      render: (row) => <FormGuide games={row.form} />,
    },
  ];

  return (
    <Section title={tCompetitions("leaderboardTitle")} action={action}>
      <DataTable
        columns={variant === "summary" ? summaryColumns : fullColumns}
        rows={leaderboards}
        getRowKey={(row) => row.teamId}
        getRowHref={(row) => `/teams/${row.teamId}`}
        getRowLabel={(row) => formatTeamName(row.clubName, row.teamNumber)}
        density="cozy"
        emptyMessage={tCompetitions("leaderboardEmpty")}
      />
    </Section>
  );
}
