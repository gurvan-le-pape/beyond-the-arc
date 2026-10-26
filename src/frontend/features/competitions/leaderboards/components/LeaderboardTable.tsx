// src/frontend/features/competitions/leaderboards/components/LeaderboardTable.tsx
import { useLocale, useTranslations } from "next-intl";

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
  readonly dropdown?: React.ReactNode;
  /** Beside the title: a link onward, such as to the full table. */
  readonly action?: React.ReactNode;
}

/**
 * A pool's standings — rank, team, the season record and, in the full
 * table, recent form. Each row links to its team.
 *
 * Stays a **server component**. The `dropdown` slot is what keeps it that way:
 * a client-side pool picker is passed in as an element rather than rendered
 * here, so choosing a pool does not pull the table and its columns into the
 * browser bundle. Marking this `"use client"` to add interactivity would undo
 * that.
 */
export function LeaderboardTable({
  leaderboards,
  variant = "full",
  dropdown,
  action,
}: LeaderboardTableProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const locale = useLocale();

  // On a phone the table keeps rank, team, points, games played and point
  // difference — wins and losses follow from those — with abbreviated
  // headings whose full label stays on the abbreviation. All seven at full
  // width made the table more than twice the phone's width.
  const heading = (abbr: string, full: string) => (
    <>
      <abbr title={full} className="no-underline sm:hidden">
        {abbr}
      </abbr>
      <span className="hidden sm:inline">{full}</span>
    </>
  );

  // A summary's columns are few and narrow, so its headings stay abbreviated
  // at every width, and never break at the dash in "W–L".
  const abbreviation = (abbr: string, full: string) => (
    <abbr title={full} className="no-underline whitespace-nowrap">
      {abbr}
    </abbr>
  );

  const signed = new Intl.NumberFormat(locale, { signDisplay: "exceptZero" });

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
      render: (row) => signed.format(row.pointDifference),
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
      {dropdown && (
        <div className="flex justify-end mb-2">
          <div className="min-w-[200px]">{dropdown}</div>
        </div>
      )}
      <DataTable
        columns={variant === "summary" ? summaryColumns : fullColumns}
        rows={leaderboards}
        getRowKey={(row) => row.id}
        getRowHref={(row) => `/teams/${row.teamId}`}
        getRowLabel={(row) => formatTeamName(row.clubName, row.teamNumber)}
        density="cozy"
        emptyMessage={tCompetitions("leaderboardEmpty")}
      />
    </Section>
  );
}

export default LeaderboardTable;
