// src/frontend/features/organizations/clubs/components/list/club-directory/ClubsTable.tsx
import { useTranslations } from "next-intl";

import { DataTable, type TableColumn } from "@/shared/components/table";

import type { ClubBasic } from "../../../types/ClubBasic";

/** Where a club sits, by the ids its list row carries. */
export interface ClubPlaces {
  /** Each committee by id, named by its department: "69 · Rhône". */
  readonly committees: Readonly<Record<number, string>>;
  /** Each league by id, named by its region. */
  readonly leagues: Readonly<Record<number, string>>;
}

interface ClubsTableProps {
  readonly clubs: ClubBasic[];
  readonly places: ClubPlaces;
}

/**
 * One page of the clubs listing, a row per club: its name, city, committee
 * and league. Each row links to the club. On a phone the committee and league
 * step aside.
 *
 * A committee is named by its department and a league by its region, as on
 * their own pages.
 *
 * The city is optional in the list response, and an absent one reads as a
 * dash; so does a committee or league the lookups have not loaded yet.
 */
export function ClubsTable({ clubs, places }: ClubsTableProps) {
  const t = useTranslations("organizations");
  const tCommon = useTranslations("common");

  const columns: TableColumn<ClubBasic>[] = [
    {
      key: "name",
      header: t("clubs.columns.name"),
      align: "left",
      emphasis: true,
      render: (club) => club.name,
    },
    {
      key: "city",
      header: t("clubs.columns.city"),
      align: "left",
      render: (club) => club.city || "—",
    },
    {
      key: "committee",
      header: t("clubs.columns.committee"),
      align: "left",
      from: "sm",
      render: (club) => places.committees[club.committeeId] ?? "—",
    },
    {
      key: "league",
      header: t("clubs.columns.league"),
      align: "left",
      from: "sm",
      render: (club) => places.leagues[club.leagueId] ?? "—",
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={clubs}
      getRowKey={(club) => club.id}
      getRowHref={(club) => `/organizations/clubs/${club.id}`}
      getRowLabel={(club) => club.name}
      density="compact"
      emptyMessage={tCommon("emptyState.clubs")}
    />
  );
}
