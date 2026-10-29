// src/frontend/features/teams/components/detail/team-roster/index.tsx
"use client";

import { useFormatter, useTranslations } from "next-intl";
import React, { useState } from "react";

import type { TeamPlayerRef } from "@/features/teams/types";
import { Section } from "@/shared/components/blocks";
import { Badge } from "@/shared/components/primitives";
import { DataTable, type TableColumn } from "@/shared/components/table";
import { createStatFormat, positionVariant } from "@/shared/utils";

import { SortHeader } from "./SortHeader";
import type { SortConfig, SortKey } from "./types";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TeamRosterProps {
  readonly players?: TeamPlayerRef[];
}

/**
 * The team's players as a table, sortable by number, name, or a per-game stat
 * from the column headings. Each row links to the player.
 *
 * **Sorting is client-side over the whole roster** — there is no pagination and
 * no server round trip, so the list is expected to stay small. The input array
 * is copied before sorting, so the `players` prop is never reordered underneath
 * its owner.
 *
 * **The first click on any column sorts descending**, including on `number`.
 * Only clicking an already-descending column flips it back to ascending; the
 * initial render is ascending by number.
 *
 * `players` is optional and memoised through a `?? []` fallback, because a fresh
 * empty array on every render would invalidate the sort memo below it.
 */
export function TeamRoster({ players }: TeamRosterProps) {
  // Memoized so the `?? []` fallback doesn't produce a fresh array on every
  // render and invalidate the sort memo below.
  const safePlayers: TeamPlayerRef[] = React.useMemo(
    () => players ?? [],
    [players],
  );

  const tTeams = useTranslations("teams");
  const tCommon = useTranslations("common");
  const { perGame } = createStatFormat(useFormatter());

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "number",
    direction: "asc",
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const sortedPlayers = React.useMemo(() => {
    return [...safePlayers].sort((a, b) => {
      const dir = sortConfig.direction === "asc" ? 1 : -1;

      switch (sortConfig.key) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "number":
          return (a.number - b.number) * dir;
        case "ppg":
          return (
            (a.seasonStats.pointsPerGame - b.seasonStats.pointsPerGame) * dir
          );
        case "rpg":
          return (
            (a.seasonStats.reboundsPerGame - b.seasonStats.reboundsPerGame) *
            dir
          );
        case "apg":
          return (
            (a.seasonStats.assistsPerGame - b.seasonStats.assistsPerGame) * dir
          );
        default:
          return 0;
      }
    });
  }, [safePlayers, sortConfig]);

  const ariaSort = (key: SortKey) => {
    if (sortConfig.key !== key) return "none";
    return sortConfig.direction === "asc" ? "ascending" : "descending";
  };

  const sortHeader = (key: SortKey, label: string, fullLabel?: string) => (
    <SortHeader
      sortKey={key}
      label={label}
      fullLabel={fullLabel}
      sortConfig={sortConfig}
      onSort={handleSort}
    />
  );

  const columns: TableColumn<TeamPlayerRef>[] = [
    {
      key: "number",
      header: sortHeader("number", tTeams("teamDetail.numberShort")),
      sort: ariaSort("number"),
      numeric: true,
      align: "left",
      width: "icon",
      render: (player) => player.number,
    },
    {
      key: "name",
      header: sortHeader("name", tTeams("teamDetail.player")),
      sort: ariaSort("name"),
      emphasis: true,
      render: (player) => player.name,
    },
    {
      key: "position",
      from: "sm",
      // The badges say what the column is, so the name is for screen
      // readers only: an empty header cell leaves the column unnamed.
      header: <span className="sr-only">{tTeams("teamDetail.position")}</span>,
      render: (player) => (
        <Badge variant={positionVariant(player.position)} size="sm">
          {tCommon(`positions.${player.position}`)}
        </Badge>
      ),
    },
    {
      key: "gamesPlayed",
      from: "sm",
      header: tCommon("stats.gamesPlayedShort"),
      tooltip: tCommon("stats.gamesPlayed"),
      numeric: true,
      render: (player) => player.seasonStats.gamesPlayed,
    },
    {
      key: "ppg",
      header: sortHeader(
        "ppg",
        tCommon("stats.points.abbr"),
        tCommon("stats.pointsPerGame"),
      ),
      sort: ariaSort("ppg"),
      numeric: true,
      render: (player) => perGame(player.seasonStats.pointsPerGame),
    },
    {
      key: "rpg",
      header: sortHeader(
        "rpg",
        tCommon("stats.rebounds.abbr"),
        tCommon("stats.reboundsPerGame"),
      ),
      sort: ariaSort("rpg"),
      numeric: true,
      render: (player) => perGame(player.seasonStats.reboundsPerGame),
    },
    {
      key: "apg",
      header: sortHeader(
        "apg",
        tCommon("stats.assists.abbr"),
        tCommon("stats.assistsPerGame"),
      ),
      sort: ariaSort("apg"),
      numeric: true,
      render: (player) => perGame(player.seasonStats.assistsPerGame),
    },
  ];

  return (
    <Section title={tTeams("teamDetail.rosterTitle")}>
      <DataTable
        columns={columns}
        rows={sortedPlayers}
        getRowKey={(player) => player.id}
        getRowHref={(player) => `/players/${player.id}`}
        getRowLabel={(player) => player.name}
        emptyMessage={tTeams("teamDetail.noPlayers")}
      />
    </Section>
  );
}
