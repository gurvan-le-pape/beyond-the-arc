// src/frontend/features/players/components/list/playersTableColumns.tsx
import type { _Translator } from "next-intl";

export function getPlayersTableColumns(
  t: _Translator<Record<string, any>, "players">,
) {
  return [
    {
      accessorKey: "number",
      header: () => (
        <span className="cursor-pointer select-none">
          {t("playersTable.number")}
        </span>
      ),
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "name",
      header: () => (
        <span className="cursor-pointer select-none">
          {t("playersTable.name")}
        </span>
      ),
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "team",
      header: () => (
        <span className="cursor-pointer select-none">
          {t("playersTable.team")}
        </span>
      ),
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "club",
      header: () => (
        <span className="cursor-pointer select-none">
          {t("playersTable.club")}
        </span>
      ),
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "equalsString",
    },
    {
      accessorKey: "category",
      header: () => (
        <span className="cursor-pointer select-none">
          {t("playersTable.category")}
        </span>
      ),
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "equalsString",
    },
    {
      accessorKey: "gender",
      header: () => (
        <span className="cursor-pointer select-none">
          {t("playersTable.gender")}
        </span>
      ),
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "equalsString",
    },
  ];
}

export default getPlayersTableColumns;
