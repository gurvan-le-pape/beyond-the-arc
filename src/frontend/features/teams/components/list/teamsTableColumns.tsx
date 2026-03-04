// src/frontend/features/teams/components/list/teamsTableColumns.tsx
import type { _Translator } from "next-intl/dist/types/react-client";

export function getTeamsTableColumns(
  t: _Translator<Record<string, any>, "teams">,
) {
  return [
    {
      accessorKey: "number",
      header: () => (
        <span className="cursor-pointer select-none">
          {t("teamsTable.number")}
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
          {t("teamsTable.club")}
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
          {t("teamsTable.category")}
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
          {t("teamsTable.gender")}
        </span>
      ),
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "equalsString",
    },
    {
      accessorKey: "division",
      header: () => (
        <span className="cursor-pointer select-none">
          {t("teamsTable.division")}
        </span>
      ),
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "equalsString",
    },
    {
      accessorKey: "pool",
      header: () => (
        <span className="cursor-pointer select-none">
          {t("teamsTable.pool")}
        </span>
      ),
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "equalsString",
    },
  ];
}

export default getTeamsTableColumns;
