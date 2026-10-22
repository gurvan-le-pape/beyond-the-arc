// src/frontend/features/organizations/clubs/components/clubs-view/ClubsTable.tsx
import { useTranslations } from "next-intl";

import { DataTable, type TableColumn } from "@/shared/components/table";

import type { ClubBasic } from "../../types/ClubBasic";

interface ClubsTableProps {
  readonly clubs: ClubBasic[];
}

/**
 * One page of the clubs listing, a row per club: its name, city and postcode.
 * Each row links to the club. On a phone the postcode steps aside.
 *
 * City and postcode are each optional in the list response, and an absent one
 * reads as a dash.
 */
export function ClubsTable({ clubs }: ClubsTableProps) {
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
      key: "zipCode",
      header: t("clubs.columns.zipCode"),
      align: "left",
      width: "fit",
      from: "sm",
      render: (club) => club.zipCode || "—",
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
